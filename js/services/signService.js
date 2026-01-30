export class SignService {
    constructor() {
        this.model = null;
        this.scalerParams = null;
        this.labels = null;
        this.isReady = false;
        this.predictionHistory = [];
        this.historyLimit = 5; // Son 5 tahmini tut
    }

    async init(){
        try {
            // GitHub Pages veya lokal server farketmeksizin kök dizini buluyoruz
            // Eğer URL'de /pages/ varsa bir üst dizine, yoksa mevcut dizine bakıyoruz
            const pathParts = window.location.pathname.split('/');
            const isInPagesFolder = pathParts.includes('pages');
            const basePath = isInPagesFolder ? '../' : './';

            console.log('Model yükleniyor, Base Path:', basePath);

            // Model ve yardımcı dosyaları assets/web_model/ altından yüklüyoruz
            this.model = await tf.loadLayersModel(`${basePath}assets/web_model/model.json`);
            
            // Scaler parametrelerini ve etiketleri yüklüyoruz
            const scalerRes = await fetch(`${basePath}assets/web_model/scaler_params.json`);
            if (scalerRes.ok) {
                this.scalerParams = await scalerRes.json();
            }

            const labelsRes = await fetch(`${basePath}assets/web_model/labels.json`);
            if (labelsRes.ok) {
                this.labels = await labelsRes.json();
            } else {
                // Eğer dosya yüklenemezse varsayılan etiketleri kullan
                this.labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "Y", "Z", "del", "nothing", "space"];
            }
            
            this.isReady = true;
            console.log('Yeni model ve veriler başarıyla yüklendi.');
        } catch(error){
            console.error('Model yüklenirken hata oluştu:', error);
            console.log('Hata detayı: Lütfen assets/web_model/ klasörünün ve içindeki model.json dosyasının doğru yerde olduğundan emin olun.');
        }
    }

    predict(results) {
        if (!this.isReady || !this.model || !results) return null;

        // World Landmarks daha tutarlı olabilir (metre cinsinden 3D koordinatlar)
        // Eğer yoksa normal landmarks kullan
        const multiHandLandmarks = results.multiHandWorldLandmarks || results.multiHandLandmarks;
        const multiHandedness = results.multiHandedness;

        if (!multiHandLandmarks || multiHandLandmarks.length === 0) {
            this.predictionHistory = []; 
            return null;
        }

        // Tahminleri topla
        const predictions = multiHandLandmarks.map((landmarks, idx) => {
            const handedness = multiHandedness ? multiHandedness[idx].label : 'Right';
            const wrist = landmarks[0];
            
            let rawData = [];
            landmarks.forEach(lm => {
                // 1. Bilek merkezli (Relative) koordinatlar
                let dx = lm.x - wrist.x;
                let dy = lm.y - wrist.y;
                let dz = lm.z - wrist.z;

                // 2. El aynalama (Hand Flip) kontrolü
                // MediaPipe Web: 'Left' -> Sağ El, 'Right' -> Sol El
                // Eğer model sağ el ile eğitildiyse ve sol el gelirse X ters çevrilmeli.
                if (handedness === 'Right') { 
                    dx = -dx;
                }

                rawData.push(dx, dy, dz);
            });
            
            // Scaler uygula
            let processedData = rawData;
            if (this.scalerParams && this.scalerParams.mean && this.scalerParams.scale) {
                processedData = rawData.map((val, i) => {
                    return (val - (this.scalerParams.mean[i] || 0)) / (this.scalerParams.scale[i] || 1);
                });
            }

            return tf.tidy(() => {
                const inputTensor = tf.tensor2d([processedData]);
                const prediction = this.model.predict(inputTensor);
                const probabilities = prediction.dataSync();
                const maxIdx = probabilities.indexOf(Math.max(...probabilities));
                
                return {
                    label: this.labels[maxIdx] || `Bilinmeyen (${maxIdx})`,
                    confidence: probabilities[maxIdx]
                };
            });
        });

        // En yüksek güvenilirlikli anlık tahmini bul
        const bestCurrent = predictions.reduce((best, current) => {
            return (current.confidence > (best ? best.confidence : 0)) ? current : best;
        }, null);

        if (!bestCurrent) return null;

        // Geçmişe ekle (Smoothing)
        this.predictionHistory.push(bestCurrent);
        if (this.predictionHistory.length > this.historyLimit) {
            this.predictionHistory.shift();
        }

        // Geçmişteki en sık geçen etiketi bul
        const counts = {};
        let maxCount = 0;
        let mostFrequentLabel = bestCurrent.label;
        let avgConfidence = 0;

        this.predictionHistory.forEach(p => {
            counts[p.label] = (counts[p.label] || 0) + 1;
            if (counts[p.label] > maxCount) {
                maxCount = counts[p.label];
                mostFrequentLabel = p.label;
            }
            avgConfidence += p.confidence;
        });

        avgConfidence /= this.predictionHistory.length;

        return {
            label: mostFrequentLabel,
            confidence: avgConfidence,
            isStable: maxCount >= (this.historyLimit / 2) // Çoğunluk sağlanmış mı?
        };
    }
}