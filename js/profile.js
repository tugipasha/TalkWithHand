import AuthService from './services/auth.js';
import AchievementService from './services/achievements.js';

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
    const levelBadgeEl = document.getElementById('profile-level-badge');
    const levelTextEl = document.getElementById('profile-level-text');
    const avatarEl = document.getElementById('profile-avatar');
    const streakNumEl = document.getElementById('profile-streak-num');
    const lessonsCountEl = document.getElementById('completed-lessons-count');
    const pointsEl = document.getElementById('total-points');
    const progressFillEl = document.getElementById('level-progress-fill');
    const progressPercentEl = document.getElementById('next-level-percent');
    const logoutBtn = document.getElementById('logout-btn');

    if (nameEl) nameEl.textContent = user.name;
    if (levelBadgeEl) levelBadgeEl.textContent = user.progress.level;
    if (levelTextEl) levelTextEl.textContent = `Seviye ${user.progress.level}`;
    if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=128`;
    if (streakNumEl) streakNumEl.textContent = user.progress.stats.streak;
    if (lessonsCountEl) lessonsCountEl.textContent = user.progress.completedLessons.length;
    if (pointsEl) pointsEl.textContent = user.progress.points;

    // Seviye ilerlemesini hesapla (Basit bir mantık: her seviye 1000 puan)
    const currentPoints = user.progress.points;
    const levelPoints = 1000;
    const nextLevelXP = levelPoints - (currentPoints % levelPoints);
    const progressPercent = Math.min(((currentPoints % levelPoints) / levelPoints) * 100, 100);
    
    if (progressFillEl) progressFillEl.style.width = `${progressPercent}%`;
    if (progressPercentEl) progressPercentEl.textContent = `${Math.round(progressPercent)}%`;
    
    const hintEl = document.querySelector('.next-level-hint');
    if (hintEl) hintEl.textContent = `Sonraki seviyeye ${nextLevelXP} XP kaldı`;

    // Unvan güncelleme
    const titleEl = document.getElementById('profile-title');
    if (titleEl) {
        if (user.progress.level >= 10) titleEl.textContent = 'İşaret Dili Ustası';
        else if (user.progress.level >= 5) titleEl.textContent = 'Deneyimli Öğrenci';
        else titleEl.textContent = 'İşaret Dili Öğrencisi';
    }

    // Başarımları Yükle
    loadAchievements(user);

    // Üst Rozetleri Güncelle (badges div)
    updateTopBadges(user);

    // Çıkış Yap
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
        });
    }
});

function loadAchievements(user) {
    const achievementsList = document.getElementById('achievements-list');
    const achievementCount = document.getElementById('achievement-count');
    
    if (!achievementsList) return;

    const allAchievements = AchievementService.getAllAchievements();
    const userAchievements = AchievementService.getUserAchievements();
    
    if (achievementCount) {
        achievementCount.textContent = `${userAchievements.length}/${allAchievements.length}`;
    }

    achievementsList.innerHTML = allAchievements.map(achievement => {
        const isUnlocked = userAchievements.includes(achievement.id);
        return `
            <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon" style="color: ${achievement.color}">
                    <i class="fas ${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
    }).join('');
}

function updateTopBadges(user) {
    const badgesDiv = document.getElementById('profile-badges-container');
    if (!badgesDiv) return;

    const userAchievements = AchievementService.getUserAchievements();
    const allAchievements = AchievementService.getAllAchievements();
    
    // Sadece kazanılanları göster
    const earned = allAchievements.filter(a => userAchievements.includes(a.id));
    
    if (earned.length === 0) {
        badgesDiv.innerHTML = '<span class="badge"><i class="fas fa-info-circle"></i> Henüz başarım yok</span>';
    } else {
        badgesDiv.innerHTML = earned.map(a => `
            <span class="badge" title="${a.description}">
                <i class="fas ${a.icon}"></i> ${a.title}
            </span>
        `).join('');
    }
}
