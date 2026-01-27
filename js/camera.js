const video = document.getElementById('webcam');
const startBtn = document.getElementById('start-camera');
const feedbackText = document.getElementById('feedback-text');
const feedbackBox = document.getElementById('feedback-box');
const nextBtn = document.getElementById('next-step');

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Kamerayı Durdur';
        feedbackText.innerText = "Kamera Hazır. Hareketi Yapın.";
        
        // Simüle edilmiş AI tespiti
        simulateAIDetection();
    } catch (err) {
        console.error("Kamera erişim hatası:", err);
        feedbackText.innerText = "Kamera Erişimi Reddedildi!";
        feedbackBox.style.borderColor = "var(--error)";
    }
}

function simulateAIDetection() {
    // 3 saniye sonra "Doğru" tespiti yap
    setTimeout(() => {
        feedbackText.innerText = "Mükemmel! Doğru Hareket.";
        feedbackBox.classList.add('success');
        nextBtn.disabled = false;
        
        // Konfeti efekti simülasyonu (isteğe bağlı)
        console.log("AI: Başarılı tespit!");
    }, 3000);
}

startBtn.addEventListener('click', () => {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        startBtn.innerHTML = '<i class="fas fa-video"></i> Kamerayı Başlat';
        feedbackText.innerText = "Kamera Kapalı.";
        feedbackBox.classList.remove('success');
    } else {
        setupCamera();
    }
});

// Zamanlayıcı simülasyonu
let timeLeft = 45;
const timerDisplay = document.getElementById('timer');

setInterval(() => {
    if (timeLeft > 0 && video.srcObject) {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}, 1000);
