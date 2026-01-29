export class SignService {
    constructor() {
        this.model = null;
        this.scalerParams = null;
        this.labels = null;
        this.isReady = false;
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

    predict(landmarks) {
        if (!this.isReady || !this.model) return null;

        // 1. MediaPipe verisini düzleştir (21 nokta * 3 koordinat = 63 girdi)
        let rawData = [];
        landmarks.forEach(lm => rawData.push(lm.x, lm.y, lm.z));
        
        // Formül: z = (x - mean) / scale (Eğer scalerParams yoksa ham veriyi kullan)
        let processedData = rawData;
        if (this.scalerParams && this.scalerParams.mean && this.scalerParams.scale) {
            processedData = rawData.map((val, i) => {
                return (val - this.scalerParams.mean[i]) / this.scalerParams.scale[i];
            });
        }

        return tf.tidy(() => {
            const inputTensor = tf.tensor2d([processedData]);
            const prediction = this.model.predict(inputTensor);
            const probabilities = prediction.dataSync();
            
            const maxIdx = probabilities.indexOf(Math.max(...probabilities));
            
            return {
                label: this.labels[maxIdx] || `Bilinmeyen (${maxIdx})`,
                confidence: probabilities[maxIdx],
                allScores: Array.from(probabilities)
            };
        });
    }
}