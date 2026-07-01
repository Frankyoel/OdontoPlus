/* ============================================================
   OdontoPlus — Toast Notifications (toast.js)
   ============================================================ */

const Toast = {
    container: null,

    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        this.container = document.getElementById('toast-container');
    },

    /** Muestra un toast */
    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.init();

        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 20px;">${icons[type] || icons.info}</span>
            <span style="flex: 1; font-size: 14px;">${message}</span>
            <button style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px;" onclick="this.closest('.toast').remove()">
                <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
            </button>
        `;

        this.container.appendChild(toast);

        // Auto-remove
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

window.Toast = Toast;
