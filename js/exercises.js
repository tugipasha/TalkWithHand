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
        const btn = document.getElementById('start-camera');
        const feedback = document.getElementById('feedback-text');

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            video.srcObject = null;
            btn.innerHTML = '<i class="fas fa-camera"></i> Kamerayı Başlat';
            feedback.textContent = 'Kamera Bekleniyor...';
        } else {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = this.stream;
                btn.innerHTML = '<i class="fas fa-stop"></i> Kamerayı Durdur';
                feedback.textContent = 'Yapay Zeka Hazırlanıyor...';
                
                // Simulate AI recognition after 2 seconds
                setTimeout(() => {
                    if (this.stream) {
                        feedback.textContent = 'Doğru Hareket! Harikasın ✨';
                        document.getElementById('feedback-box').classList.add('success');
                        document.getElementById('verify-action').classList.remove('hidden');
                    }
                }, 2000);
            } catch (err) {
                console.error("Kamera hatası:", err);
                alert("Kameraya erişilemedi. Lütfen izin verdiğinizden emin olun.");
            }
        }
    }
}

// Initialize
new LessonManager();
