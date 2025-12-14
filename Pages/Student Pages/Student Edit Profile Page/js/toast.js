/**
 * Toast Notification System
 * Handles toast notifications across the application
 */

const ToastSystem = {
    container: null,

    init() {
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    },

    show(message, type = 'info', duration = 3000) {
        if (!this.container) {
            this.init();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Define icons based on type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';

        toast.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid ${icon} toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
            <span class="toast-close" onclick="this.parentElement.remove()">&times;</span>
        `;

        // Apply animation duration to the progress bar via inline style if needed, 
        // but here we just append it.
        // We'll use style property for the pseudo-element animation duration if possible,
        // but pseudo-elements are hard to style inline. 
        // Instead, we can just rely on the timeout to remove it.

        this.container.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.style.animation = 'fadeOut 0.3s forwards';
                toast.addEventListener('animationend', () => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                });
            }
        }, duration);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    ToastSystem.init();
});

// Export globally
window.ToastSystem = ToastSystem;
