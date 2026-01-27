// Global Interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log('TalkWithHand initialized!');
    
    // Apply saved preferences
    applyPreferences();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting for sidebar
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.endsWith(href) || (href !== 'dashboard.html' && currentPath.includes(href)))) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
});

function applyPreferences() {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Font Family
    const savedFont = localStorage.getItem('font-family');
    if (savedFont) {
        document.body.style.fontFamily = savedFont;
    }

    // Font Size
    const savedSize = localStorage.getItem('font-size') || 'medium';
    document.body.classList.add(`font-${savedSize}`);
}
