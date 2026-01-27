import StorageService from './storage.js';
import AuthService from './auth.js';
import AchievementService from './achievements.js';

/**
 * TalkWithHand - Kullanıcı Veri ve İlerleme Servisi
 */

const UserService = {
    // Kullanıcı ilerlemesini güncelle
    updateProgress(newStats) {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return;

        const users = StorageService.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].progress = {
                ...users[userIndex].progress,
                ...newStats
            };
            
            StorageService.save('users', users);
            AuthService.setCurrentUser(users[userIndex]); // Session güncelle

            // Başarımları kontrol et
            AchievementService.checkAchievements();
        }
    },

    // Tamamlanan dersi ekle
    completeLesson(lessonId) {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return;

        const progress = currentUser.progress;
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            progress.points += 50; // Her ders 50 puan
            
            this.updateProgress(progress);
        }
    },

    // İstatistikleri getir
    getStats() {
        const user = AuthService.getCurrentUser();
        return user ? user.progress : null;
    }
};

export default UserService;
