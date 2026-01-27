import StorageService from './storage.js';
import AuthService from './auth.js';

/**
 * TalkWithHand - Başarımlar Servisi
 */

const ACHIEVEMENTS = [
    {
        id: 'first_lesson',
        title: 'İlk Adım',
        description: 'İlk dersini başarıyla tamamla.',
        icon: 'fa-shoe-prints',
        color: '#3b82f6',
        requirement: (user) => user.progress.completedLessons.length >= 1
    },
    {
        id: 'fast_learner',
        title: 'Hızlı Öğrenci',
        description: 'Toplam 5 ders tamamla.',
        icon: 'fa-bolt',
        color: '#f59e0b',
        requirement: (user) => user.progress.completedLessons.length >= 5
    },
    {
        id: 'master',
        title: 'İşaret Dili Ustası',
        description: 'Toplam 10 ders tamamla.',
        icon: 'fa-crown',
        color: '#8b5cf6',
        requirement: (user) => user.progress.completedLessons.length >= 10
    },
    {
        id: 'sharp_eye',
        title: 'Keskin Göz',
        description: '%90 üzerinde doğruluk oranına ulaş.',
        icon: 'fa-eye',
        color: '#10b981',
        requirement: (user) => user.progress.stats.accuracy >= 90
    },
    {
        id: 'steady',
        title: 'İstikrar Abidesi',
        description: '3 günlük seri yap.',
        icon: 'fa-calendar-check',
        color: '#ef4444',
        requirement: (user) => user.progress.stats.streak >= 3
    }
];

const AchievementService = {
    // Tüm başarımları getir
    getAllAchievements() {
        return ACHIEVEMENTS;
    },

    // Kullanıcının kazandığı başarımları getir
    getUserAchievements() {
        const user = AuthService.getCurrentUser();
        if (!user) return [];
        return user.progress.achievements || [];
    },

    // Yeni başarımları kontrol et ve ekle
    checkAchievements() {
        const user = AuthService.getCurrentUser();
        if (!user) return [];

        const currentAchievements = user.progress.achievements || [];
        const newAchievements = [];

        ACHIEVEMENTS.forEach(achievement => {
            // Zaten kazanılmamışsa ve şartları sağlıyorsa
            if (!currentAchievements.includes(achievement.id) && achievement.requirement(user)) {
                newAchievements.push(achievement.id);
            }
        });

        if (newAchievements.length > 0) {
            this.awardAchievements(newAchievements);
        }

        return newAchievements;
    },

    // Başarımları kullanıcıya ata
    awardAchievements(achievementIds) {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return;

        const users = StorageService.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            if (!users[userIndex].progress.achievements) {
                users[userIndex].progress.achievements = [];
            }
            
            achievementIds.forEach(id => {
                if (!users[userIndex].progress.achievements.includes(id)) {
                    users[userIndex].progress.achievements.push(id);
                }
            });

            StorageService.save('users', users);
            AuthService.setCurrentUser(users[userIndex]);
        }
    }
};

export default AchievementService;
