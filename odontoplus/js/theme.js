/* ============================================================
   OdontoPlus — Theme Manager (theme.js)
   ============================================================ */

const Theme = {
    init() {
        const savedTheme = localStorage.getItem('odontoplus_theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = current === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('odontoplus_theme', theme);
        
        // Actualizar el icono si el botón ya está renderizado
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
};

// Inicializar de inmediato para evitar el parpadeo de temas
Theme.init();
window.Theme = Theme;
