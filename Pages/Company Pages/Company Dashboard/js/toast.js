// Guard to prevent duplicate declaration
if (typeof ToastSystem !== 'undefined') {
    console.log('ToastSystem already loaded, skipping...');
} else {

    window.ToastSystem = {
        container: null,
        toasts: [],
        storageKey: 'pendingToast',

        init() {
            this.container = document.getElementById('toastContainer');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toastContainer';
                this.container.className = 'toast-container';
                // Inline styles matching toast.css
                const css = `
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        }
        .toast {
            background: white;
            padding: 16px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .toast::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
        }
        .toast.success::before { background: #10b981; }
        .toast.error::before { background: #ef4444; }
        .toast.warning::before { background: #f59e0b; }
        .toast.info::before { background: #3b82f6; }
        
        .toast-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        .toast.success .toast-icon { color: #10b981; }
        .toast.error .toast-icon { color: #ef4444; }
        .toast.warning .toast-icon { color: #f59e0b; }
        .toast.info .toast-icon { color: #3b82f6; }
        
        .toast-content {
            flex: 1;
            font-size: 14px;
            color: #333;
            line-height: 1.4;
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .toast-close:hover {
            background: #f3f4f6;
            color: #333;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .toast.removing {
            animation: slideOut 0.3s ease forwards;
        }
        @keyframes slideOut {
            to { transform: translateX(100%); opacity: 0; }
        }
      `;
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
                document.body.appendChild(this.container);
            }

            this.checkForPendingToast();
        },

        show(message, type = 'info', duration = 3000) {
            if (!this.container) this.init();

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" onclick="ToastSystem.remove(this.parentElement)">×</button>
    `;

            this.container.appendChild(toast);
            this.toasts.push(toast);

            if (duration > 0) {
                setTimeout(() => this.remove(toast), duration);
            }

            return toast;
        },

        remove(toast) {
            if (!toast || !toast.parentElement) return;
            toast.classList.add('removing');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                    this.toasts = this.toasts.filter(t => t !== toast);
                }
            }, 300);
        },

        storeForNextPage(message, type) {
            sessionStorage.setItem(this.storageKey, JSON.stringify({
                message,
                type,
                timestamp: Date.now()
            }));
        },

        checkForPendingToast() {
            const data = sessionStorage.getItem(this.storageKey);
            if (data) {
                try {
                    const toast = JSON.parse(data);
                    if (Date.now() - (toast.timestamp || 0) < 10000) {
                        setTimeout(() => this.show(toast.message, toast.type), 300);
                    }
                    sessionStorage.removeItem(this.storageKey);
                } catch (e) {
                    sessionStorage.removeItem(this.storageKey);
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ToastSystem.init());
    } else {
        ToastSystem.init();
    }

} // End of guard else block
