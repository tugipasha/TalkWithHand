import AuthService from './services/auth.js';

/**
 * TalkWithHand - Kimlik Doğrulama UI Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toRegisterBtn = document.getElementById('to-register');
    const toLoginBtn = document.getElementById('to-login');
    
    const loginFormElement = document.getElementById('login-form-element');
    const registerFormElement = document.getElementById('register-form-element');

    // Form Değiştirme
    const toggleAuth = () => {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    };

    if (toRegisterBtn) toRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); toggleAuth(); });
    if (toLoginBtn) toLoginBtn.addEventListener('click', (e) => { e.preventDefault(); toggleAuth(); });

    // URL parametresine göre başlangıç formu
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }

    // Giriş Yap İşlemi
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');

            const result = AuthService.login(email, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = result.message;
                errorDiv.classList.remove('hidden');
            }
        });
    }

    // Kayıt Ol İşlemi
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const errorDiv = document.getElementById('register-error');

            const result = AuthService.register(name, email, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = result.message;
                errorDiv.classList.remove('hidden');
            }
        });
    }
});
