/**
 * CameraService: MediaPipe Hands kullanarak el takibi ve görselleştirme
 */
const CameraService = {
    hands: null,
    camera: null,
    videoElement: null,
    canvasElement: null,
    canvasCtx: null,
    isStarted: false,
    onResultCallbacks: [],
    latestResults: null,

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
                if (this.isStarted) {
                    await this.hands.send({ image: this.videoElement });
                }
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
        this.latestResults = results;
        
        // Canvas'ı temizle ve çizim yap
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS,
                    { color: '#2563eb', lineWidth: 5 });
                drawLandmarks(this.canvasCtx, landmarks, { color: '#ffffff', lineWidth: 2 });
            }
        }
        this.canvasCtx.restore();

        // Kayıtlı callback'leri çalıştır
        this.onResultCallbacks.forEach(cb => cb(results));
    },

    addResultCallback(callback) {
        this.onResultCallbacks.push(callback);
    }
};

window.CameraService = CameraService;
