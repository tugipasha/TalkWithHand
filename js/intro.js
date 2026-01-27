document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');

    // Eğer ana sayfadaysak ve bugün intro gösterilmediyse göster
    // (Opsiyonel: Her seferinde gösterilmesini istiyorsak sessionStorage kullanabiliriz)
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

    if (!hasSeenIntro) {
        document.body.classList.add('intro-active');
        
        // 3 saniye sonra introyu bitir
        setTimeout(() => {
            introOverlay.classList.add('fade-out');
            document.body.classList.remove('intro-active');
            
            if (mainContent) {
                mainContent.classList.add('active');
            }
            
            sessionStorage.setItem('hasSeenIntro', 'true');
        }, 3000);
    } else {
        // Zaten görüldüyse introyu hemen kaldır
        if (introOverlay) introOverlay.style.display = 'none';
        if (mainContent) mainContent.classList.add('active');
    }
});
