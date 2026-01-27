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

    // İstatistikleri Yükle (Örnek)
    loadUserStats(user);
});

function loadUserStats(user) {
    // Burada ileride progress bar ve diğer dinamik alanlar güncellenecek
    console.log('Kullanıcı verileri yüklendi:', user);
}
