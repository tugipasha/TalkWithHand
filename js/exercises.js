import AuthService from './services/auth.js';

/**
 * TalkWithHand - Egzersiz Sayfası Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
    // Oturum Kontrolü
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'auth.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
        });
    }
});
