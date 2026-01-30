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

    predict(results) {
        if (!this.isReady || !this.model || !results) return null;

        const multiHandLandmarks = results.multiHandLandmarks;
        const multiHandWorldLandmarks = results.multiHandWorldLandmarks;

        if (!multiHandLandmarks || multiHandLandmarks.length === 0) return null;

        const inputShape = this.model.inputs[0].shape;
        const expectedFeatures = inputShape[1];

        // Eğer model 63 girdi bekliyorsa (tek el)
        if (expectedFeatures === 63) {
            const predictions = multiHandLandmarks.map((landmarks, idx) => {
                // Öncelikli olarak World Landmarks (Metre cinsinden 3D) kullanıyoruz
                // Çünkü backend modelleri genelde bununla eğitilir.
                const worldLandmarks = multiHandWorldLandmarks ? multiHandWorldLandmarks[idx] : null;
                
                let rawData = [];
                if (worldLandmarks) {
                    const worldWrist = worldLandmarks[0];
                    worldLandmarks.forEach(lm => {
                        rawData.push(
                            lm.x - worldWrist.x,
                            lm.y - worldWrist.y,
                            lm.z - worldWrist.z
                        );
                    });
                } else {
                    // Fallback: Normalized landmarks + Relative conversion
                    const wrist = landmarks[0];
                    landmarks.forEach(lm => {
                        rawData.push(lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z);
                    });
                }
                
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

            return predictions.reduce((best, current) => {
                return (current.confidence > (best ? best.confidence : 0)) ? current : best;
            }, null);
        }

        // 126 Girdi (Çift el) durumu için basitleştirilmiş mantık
        if (expectedFeatures === 126) {
            let combinedData = new Array(126).fill(0);
            multiHandLandmarks.slice(0, 2).forEach((landmarks, idx) => {
                const worldLandmarks = multiHandWorldLandmarks ? multiHandWorldLandmarks[idx] : null;
                const wrist = landmarks[0];
                
                landmarks.forEach((lm, lmIdx) => {
                    const baseIdx = idx * 63 + lmIdx * 3;
                    if (worldLandmarks) {
                        const worldWrist = worldLandmarks[0];
                        combinedData[baseIdx] = worldLandmarks[lmIdx].x - worldWrist.x;
                        combinedData[baseIdx + 1] = worldLandmarks[lmIdx].y - worldWrist.y;
                        combinedData[baseIdx + 2] = worldLandmarks[lmIdx].z - worldWrist.z;
                    } else {
                        combinedData[baseIdx] = lm.x - wrist.x;
                        combinedData[baseIdx + 1] = lm.y - wrist.y;
                        combinedData[baseIdx + 2] = lm.z - wrist.z;
                    }
                });
            });

            let processedData = combinedData;
            if (this.scalerParams && this.scalerParams.mean && this.scalerParams.scale) {
                processedData = combinedData.map((val, i) => {
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
        }

        return null;
    }
}