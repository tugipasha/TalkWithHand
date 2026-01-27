import AuthService from './services/auth.js';

/**
 * TalkWithHand - Profil Sayfası Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
    // Oturum Kontrolü
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'auth.html';
        return;
    }

    const user = AuthService.getCurrentUser();
    
    // UI Güncelleme
    const nameEl = document.getElementById('profile-name');
    const levelEl = document.getElementById('profile-level');
    const avatarEl = document.getElementById('profile-avatar');
    const streakEl = document.getElementById('profile-streak');
    const lessonsCountEl = document.getElementById('completed-lessons-count');
    const pointsEl = document.getElementById('total-points');
    const logoutBtn = document.getElementById('logout-btn');

    if (nameEl) nameEl.textContent = user.name;
    if (levelEl) levelEl.textContent = `Seviye ${user.progress.level}`;
    if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=128`;
    if (streakEl) streakEl.innerHTML = `<i class="fas fa-fire"></i> ${user.progress.stats.streak} Günlük Seri`;
    if (lessonsCountEl) lessonsCountEl.textContent = user.progress.completedLessons.length;
    if (pointsEl) pointsEl.textContent = user.progress.points;

    // Çıkış Yap
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
        });
    }
});
