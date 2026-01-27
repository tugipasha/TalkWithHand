import AuthService from './services/auth.js';
import UserService from './services/user.js';

/**
 * TalkWithHand - Dashboard Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
    // Oturum Kontrolü
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'auth.html';
        return;
    }

    const user = AuthService.getCurrentUser();
    
    // UI Güncelleme
    const greeting = document.getElementById('user-greeting');
    const streak = document.getElementById('user-streak');
    const avatar = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');

    if (greeting) greeting.textContent = `Hoş Geldin, ${user.name.split(' ')[0]}! 👋`;
    if (streak) streak.textContent = `${user.progress.stats.streak} Günlük Seri`;
    if (avatar) avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;

    // Çıkış Yap
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
        });
    }

    // İstatistikleri Yükle
    loadUserStats(user);
});

function loadUserStats(user) {
    const stats = user.progress.stats;
    const progressPercent = user.progress.overall;

    // Elementleri bul
    const progressCircle = document.getElementById('dashboard-progress-circle');
    const progressText = document.getElementById('dashboard-progress-text');
    const learnedText = document.getElementById('stats-learned');
    const timeText = document.getElementById('stats-time');
    const accuracyText = document.getElementById('stats-accuracy');

    // Progress circle güncelle (stroke-dasharray="75, 100")
    if (progressCircle) {
        progressCircle.setAttribute('stroke-dasharray', `${progressPercent}, 100`);
    }
    if (progressText) {
        progressText.textContent = `${progressPercent}%`;
    }

    // Alt istatistikleri güncelle
    if (learnedText) learnedText.textContent = `${stats.learnedWords} Kelime`;
    if (timeText) timeText.textContent = `${stats.practiceHours} Saat`;
    if (accuracyText) accuracyText.textContent = `%${stats.accuracy}`;
}
