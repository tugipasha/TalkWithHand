/**
 * CameraService: MediaPipe Hands kullanarak el takibi ve işaret algılama
 */
const CameraService = {
    hands: null,
    camera: null,
    videoElement: null,
    canvasElement: null,
    canvasCtx: null,
    isStarted: false,
    onResultCallbacks: [],

    async init(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.canvasCtx = canvasElement.getContext('2d');

        // MediaPipe Hands Yapılandırması
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => this.onResults(results));

        // Kamera Yapılandırması
        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({ image: this.videoElement });
            },
            width: 640,
            height: 480
        });
    },

    async start() {
        if (this.isStarted) return;
        try {
            await this.camera.start();
            this.isStarted = true;
            console.log('Camera started');
        } catch (error) {
            console.error('Camera failed to start:', error);
            throw error;
        }
    },

    async stop() {
        if (!this.isStarted) return;
        await this.camera.stop();
        this.isStarted = false;
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    },

    onResults(results) {
        // Canvas'ı temizle
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        
        // El işaretlerini çiz
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS,
                    { color: '#2563eb', lineWidth: 5 });
                drawLandmarks(this.canvasCtx, landmarks, { color: '#ffffff', lineWidth: 2 });
            }
        }
        this.canvasCtx.restore();

        // Callback'leri çalıştır
        this.onResultCallbacks.forEach(cb => cb(results));
    },

    addResultCallback(callback) {
        this.onResultCallbacks.push(callback);
    },

    /**
     * İşaret Doğrulama Mantığı (Basitleştirilmiş)
     * Gerçek bir projede burada landmark koordinatları karşılaştırılır veya bir model çağrılır.
     */
    verifySign(results, targetSignId) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            return { success: false, message: 'El algılanamadı' };
        }

        // Şimdilik simülasyon: El algılandıysa ve "Doğrula"ya basıldıysa başarılı say
        // Gerçek TİD algılama için landmark analizi gerekir.
        const landmarks = results.multiHandLandmarks[0];
        
        // Örnek: Baş parmak ucu (4) ve İşaret parmağı ucu (8) arasındaki mesafe kontrolü vb.
        return { success: true, message: 'Harika! İşaret doğru görünüyor.' };
    }
};

window.CameraService = CameraService;
