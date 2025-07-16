document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check localStorage for theme preference
    if (localStorage.getItem('dark-mode') === 'true') {
        body.classList.add('dark-mode');
        themeIcon.src = 'images/moon.png';
        themeIcon.alt = 'Mode Clair';
        toggleDarkModeElements(true);
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');
        themeIcon.src = isDarkMode ? 'images/moon.png' : 'images/sun.png';
        themeIcon.alt = isDarkMode ? 'Mode Clair' : 'Mode Sombre';
        localStorage.setItem('dark-mode', isDarkMode);
        toggleDarkModeElements(isDarkMode);
    });

    function toggleDarkModeElements(isDarkMode) {
        document.querySelectorAll('header, footer, nav ul li a, .team-member, .article-item, .boutique-item, .video-item, .offer-item, .modal-content, .modal-right, .discord-button, .nationsglory-button, .profile-button').forEach(element => {
            element.classList.toggle('dark-mode', isDarkMode);
        });
    }
});