/**
 * TalkWithHand - Yapay Zeka Servisi
 * İşaret dili hareketlerini analiz etmek için API entegrasyon katmanı.
 */

const AIService = {
    /**
     * Landmark verilerini kullanarak işareti analiz et
     */
    analyzeLandmarks(landmarks, targetSignId) {
        if (!landmarks) return { isCorrect: false, accuracy: 0, message: 'El algılanamadı' };

        switch (targetSignId.toLowerCase()) {
            case 'a':
                return this.verifyA(landmarks);
            default:
                // Tanımlanmamış işaretler için temel el algılama simülasyonu
                return { isCorrect: true, accuracy: 100, message: 'İşaret algılandı.' };
        }
    },

    /**
     * TİD 'A' Harfi Doğrulama
     * Mantık: Yumruk kapalı, baş parmak yanda.
     */
    verifyA(landmarks) {
        // Parmak uçları (Tips) ve eklemler (PIP)
        const tips = [8, 12, 16, 20]; // İşaret, Orta, Yüzük, Serçe
        const pips = [6, 10, 14, 18];

        // 1. Tüm ana parmakların kapalı olduğunu kontrol et
        // (Uç noktası, eklem noktasından daha aşağıda olmalı - Y ekseni)
        let fingersClosed = true;
        tips.forEach((tipIndex, i) => {
            if (landmarks[tipIndex].y < landmarks[pips[i]].y) {
                fingersClosed = false;
            }
        });

        // 2. Baş parmak konumu (Yanda olmalı)
        // Baş parmak ucu (4), işaret parmağı köküne (5) yakın olmalı
        const thumbTip = landmarks[4];
        const indexRoot = landmarks[5];
        const dist = Math.sqrt(Math.pow(thumbTip.x - indexRoot.x, 2) + Math.pow(thumbTip.y - indexRoot.y, 2));
        
        const isThumbCorrect = dist < 0.1; // Eşik değer

        const isCorrect = fingersClosed && isThumbCorrect;

        return {
            isCorrect: isCorrect,
            accuracy: isCorrect ? 95 : 20,
            message: isCorrect ? 
                'Harika! TİD "A" harfini doğru yaptın. ✨' : 
                'Parmaklarını yumruk yap ve baş parmağını yanda tut.'
        };
    },

    // Model yükleme simülasyonu (MediaPipe zaten yüklü olduğu için sembolik)
    async loadModel() {
        console.log('TİD AI Mantığı hazır.');
        return true;
    }
};

export default AIService;
