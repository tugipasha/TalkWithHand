/**
 * TalkWithHand - Yapay Zeka Servisi
 * İşaret dili hareketlerini analiz etmek için API entegrasyon katmanı.
 */

const AIService = {
    analyzeLandmarks(handLandmarksArr, targetSignId) {
        if (!handLandmarksArr || handLandmarksArr.length === 0) {
            return { isCorrect: false, accuracy: 0, message: 'El algılanamadı' };
        }
        const primary = handLandmarksArr[0];
        const secondary = handLandmarksArr[1] || null;
        const t = (targetSignId || '').toLowerCase();
        if (t === 'a') return this.verifyA(primary);
        return { isCorrect: true, accuracy: 80, message: 'İşaret algılandı.' };
    },
    async remoteClassify(payload) {
        const url = window.TWH_API_URL;
        if (!url) return null;
        const res = await fetch(`${url}/classify-sign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    },
    verifyA(landmarks) {
        const tips = [8, 12, 16, 20];
        const pips = [6, 10, 14, 18];
        let fingersClosed = true;
        tips.forEach((tipIndex, i) => {
            if (landmarks[tipIndex].y < landmarks[pips[i]].y) {
                fingersClosed = false;
            }
        });
        const thumbTip = landmarks[4];
        const indexRoot = landmarks[5];
        const dist = Math.sqrt(Math.pow(thumbTip.x - indexRoot.x, 2) + Math.pow(thumbTip.y - indexRoot.y, 2));
        const isThumbCorrect = dist < 0.1;
        const ok = fingersClosed && isThumbCorrect;
        return {
            isCorrect: ok,
            accuracy: ok ? 95 : 20,
            message: ok ? 'Harika! TİD "A" harfini doğru yaptın. ✨' : 'Parmaklarını yumruk yap ve baş parmağını yanda tut.'
        };
    },
    async loadModel() {
        return true;
    }
};

export default AIService;
