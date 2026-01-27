import AuthService from './services/auth.js';
import LessonService from './services/lessonService.js';
import UserService from './services/user.js';

/**
 * TalkWithHand - Eğitim & Ders Yönetimi
 */

class LessonManager {
    constructor() {
        this.currentLesson = null;
        this.currentItemIndex = 0;
        this.stream = null;
        
        this.init();
    }

    async init() {
        // Oturum Kontrolü
        if (!AuthService.isAuthenticated()) {
            window.location.href = 'auth.html';
            return;
        }

        // İlk dersi yükle (veya URL'den al)
        const curriculum = LessonService.getCurriculum();
        this.loadLesson(curriculum[0].id);

        this.setupEventListeners();
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                AuthService.logout();
            });
        }

        document.getElementById('start-camera').addEventListener('click', () => this.toggleCamera());
        document.getElementById('next-lesson').addEventListener('click', () => this.nextItem());
        document.getElementById('prev-lesson').addEventListener('click', () => this.prevItem());
    }

    loadLesson(lessonId) {
        const lesson = LessonService.getLessonById(lessonId);
        if (!lesson) return;

        this.currentLesson = lesson;
        this.currentItemIndex = 0;
        this.updateUI();
        this.renderCurriculum();
    }

    updateUI() {
        const item = this.currentLesson.items[this.currentItemIndex];
        
        // Header info
        document.getElementById('lesson-title').textContent = this.currentLesson.title;
        document.getElementById('lesson-progress-text').textContent = `${this.currentItemIndex + 1} / ${this.currentLesson.items.length}`;
        
        const progressPercent = ((this.currentItemIndex + 1) / this.currentLesson.items.length) * 100;
        document.getElementById('lesson-progress-fill').style.width = `${progressPercent}%`;

        // Content
        document.getElementById('item-label').textContent = item.label;
        document.getElementById('item-content').textContent = item.content;
        document.getElementById('item-image').src = item.imageUrl;
        document.getElementById('lesson-type-badge').textContent = this.currentLesson.type === 'alphabet' ? 'Harf' : 'Kelime';

        // Tips
        const tipsList = document.getElementById('item-tips');
        tipsList.innerHTML = '';
        item.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });

        // Update stats
        document.getElementById('completed-count').textContent = `0/${this.currentLesson.items.length}`;
    }

    renderCurriculum() {
        const list = document.getElementById('curriculum-list');
        list.innerHTML = '';

        this.currentLesson.items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `curriculum-item ${index === this.currentItemIndex ? 'active' : ''}`;
            div.innerHTML = `
                <i class="fas ${index < this.currentItemIndex ? 'fa-check-circle completed' : 'fa-circle'}"></i>
                <div class="item-info">
                    <span>${item.label}</span>
                    <small>${this.currentLesson.type === 'alphabet' ? 'Harf Pratiği' : 'Kelime Pratiği'}</small>
                </div>
            `;
            div.onclick = () => {
                this.currentItemIndex = index;
                this.updateUI();
                this.renderCurriculum();
            };
            list.appendChild(div);
        });
    }

    nextItem() {
        if (this.currentItemIndex < this.currentLesson.items.length - 1) {
            this.currentItemIndex++;
            this.updateUI();
            this.renderCurriculum();
        } else {
            // Dersi tamamla
            UserService.completeLesson(this.currentLesson.id);

            const nextLesson = LessonService.getNextLesson(this.currentLesson.id);
            if (nextLesson) {
                if (confirm('Tebrikler! Bu dersi tamamladınız. Bir sonraki derse geçmek ister misiniz?')) {
                    this.loadLesson(nextLesson.id);
                }
            } else {
                alert('Tüm dersleri tamamladınız! Harikasınız.');
            }
        }
    }

    prevItem() {
        if (this.currentItemIndex > 0) {
            this.currentItemIndex--;
            this.updateUI();
            this.renderCurriculum();
        }
    }

    async toggleCamera() {
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('overlay');
        const btn = document.getElementById('start-camera');
        const feedback = document.getElementById('feedback-text');
        const verifyBtn = document.getElementById('verify-action');

        if (CameraService.isStarted) {
            await CameraService.stop();
            btn.innerHTML = '<i class="fas fa-camera"></i> Kamerayı Başlat';
            feedback.textContent = 'Kamera Bekleniyor...';
            verifyBtn.classList.add('hidden');
        } else {
            try {
                feedback.textContent = 'Yapay Zeka Yükleniyor...';
                
                if (!CameraService.hands) {
                    await CameraService.init(video, canvas);
                    
                    CameraService.addResultCallback((results) => {
                        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                            feedback.textContent = 'El Algılandı! İşareti Yapın...';
                            verifyBtn.classList.remove('hidden');
                        } else {
                            feedback.textContent = 'El Bekleniyor...';
                            verifyBtn.classList.add('hidden');
                        }
                    });
                }

                await CameraService.start();
                btn.innerHTML = '<i class="fas fa-stop"></i> Kamerayı Durdur';
                
                verifyBtn.onclick = () => {
                    feedback.textContent = 'Görüntü alınıyor... Lütfen pozisyonu koru.';
                    setTimeout(() => {
                        const frame = CameraService.captureFrame();
                        const targetId = this.currentLesson.items[this.currentItemIndex].id;
                        if (window.TWH_API_URL && window.AIService && frame) {
                            feedback.textContent = 'Görüntü işleniyor...';
                            window.AIService.remoteClassify({
                                image: frame,
                                target: targetId
                            }).then(remote => {
                                if (remote && remote.isCorrect) {
                                    const accRemote = typeof remote.accuracy === 'number' ? ` (${remote.accuracy}%)` : '';
                                    feedback.textContent = (remote.message || 'Doğru') + accRemote + ' ✨';
                                    document.getElementById('feedback-box').classList.add('success');
                                    setTimeout(() => {
                                        document.getElementById('feedback-box').classList.remove('success');
                                        this.nextItem();
                                    }, 2000);
                                } else {
                                    const msg = (remote && remote.message) ? remote.message : 'Uygun değil. Parmak ve bilek pozisyonunu düzelt.';
                                    feedback.textContent = msg;
                                }
                            }).catch(() => {
                                const result = CameraService.verifySign(CameraService.latestResults, targetId);
                                const accTxt = typeof result.accuracy === 'number' ? ` (${result.accuracy}%)` : '';
                                if (result.success) {
                                    feedback.textContent = result.message + accTxt + ' ✨';
                                    document.getElementById('feedback-box').classList.add('success');
                                    setTimeout(() => {
                                        document.getElementById('feedback-box').classList.remove('success');
                                        this.nextItem();
                                    }, 2000);
                                } else {
                                    feedback.textContent = result.message || 'Tekrar dene, el pozisyonunu düzelt.';
                                }
                            });
                        } else {
                            const result = CameraService.verifySign(CameraService.latestResults, targetId);
                            const accTxt = typeof result.accuracy === 'number' ? ` (${result.accuracy}%)` : '';
                            if (result.success) {
                                feedback.textContent = result.message + accTxt + ' ✨';
                                document.getElementById('feedback-box').classList.add('success');
                                setTimeout(() => {
                                    document.getElementById('feedback-box').classList.remove('success');
                                    this.nextItem();
                                }, 2000);
                            } else {
                                feedback.textContent = result.message || 'Tekrar dene, el pozisyonunu düzelt.';
                            }
                        }
                    }, 1200);
                };

            } catch (err) {
                console.error("Kamera hatası:", err);
                feedback.textContent = 'Hata: Kameraya erişilemedi.';
                alert("Kameraya erişilemedi. Lütfen izin verdiğinizden emin olun.");
            }
        }
    }
}

// Initialize
new LessonManager();
