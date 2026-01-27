import StorageService from './storage.js';

/**
 * TalkWithHand - Kimlik Doğrulama Servisi
 */

const AuthService = {
    // Kayıt ol
    register(name, email, password) {
        const users = StorageService.getUsers();
        
        // E-posta kontrolü
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Bu e-posta adresi zaten kullanımda.' };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // Gerçek projede hashlenmelidir
            createdAt: new Date().toISOString(),
            progress: {
                level: 1,
                points: 0,
                completedLessons: [],
                stats: {
                    accuracy: 0,
                    practiceTime: 0,
                    streak: 0
                }
            }
        };

        StorageService.saveUser(newUser);
        this.setCurrentUser(newUser);
        
        return { success: true, user: newUser };
    },

    // Giriş yap
    login(email, password) {
        const users = StorageService.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.setCurrentUser(user);
            return { success: true, user };
        }

        return { success: false, message: 'E-posta veya şifre hatalı.' };
    },

    // Çıkış yap
    logout() {
        StorageService.remove('current_user');
        window.location.href = '../index.html';
    },

    // Mevcut kullanıcıyı ayarla
    setCurrentUser(user) {
        // Şifreyi güvenlik için saklamıyoruz (simülasyon olsa da iyi uygulama)
        const { password, ...safeUser } = user;
        StorageService.save('current_user', safeUser);
    },

    // Mevcut kullanıcıyı getir
    getCurrentUser() {
        return StorageService.get('current_user');
    },

    // Oturum kontrolü
    isAuthenticated() {
        return !!this.getCurrentUser();
    }
};

export default AuthService;
