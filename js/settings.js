import AuthService from './services/auth.js';

/**
 * TalkWithHand - Ayarlar ve Tercihler Yönetimi
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

    // --- Tema ve Görünüm Ayarları ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontSizeBtns = document.querySelectorAll('.font-size-btn');

    // Mevcut değerleri yükle
    if (darkModeToggle) {
        darkModeToggle.checked = localStorage.getItem('theme') === 'dark';
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    if (fontFamilySelect) {
        fontFamilySelect.value = localStorage.getItem('font-family') || "'Inter', sans-serif";
        fontFamilySelect.addEventListener('change', (e) => {
            const font = e.target.value;
            document.body.style.fontFamily = font;
            localStorage.setItem('font-family', font);
        });
    }

    fontSizeBtns.forEach(btn => {
        const size = btn.dataset.size;
        if (localStorage.getItem('font-size') === size) btn.classList.add('active');
        
        btn.addEventListener('click', () => {
            fontSizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${size}`);
            localStorage.setItem('font-size', size);
        });
    });
});
