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
            maxNumHands: 2,
            modelComplexity: 1, // 0: Lite, 1: Full (daha iyi doğruluk)
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
            
            // Canvas boyutlarını video boyutuna eşitle
            this.canvasElement.width = this.videoElement.videoWidth || 640;
            this.canvasElement.height = this.videoElement.videoHeight || 480;
            
            console.log('Camera started', this.canvasElement.width, 'x', this.canvasElement.height);
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
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Debug: Kaç el algılandığını yazdır
            // console.log(`${results.multiHandLandmarks.length} el algılandı.`);

            results.multiHandLandmarks.forEach((landmarks, index) => {
                const handedness = results.multiHandedness[index].label;
                const color = handedness === 'Left' ? '#2563eb' : '#22c55e'; // Sağ el mavi, sol el yeşil (aynalı görüntüde)

                drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS,
                    { color: color, lineWidth: 4 });
                drawLandmarks(this.canvasCtx, landmarks, 
                    { color: '#ffffff', lineWidth: 1, radius: 3 });
            });
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
