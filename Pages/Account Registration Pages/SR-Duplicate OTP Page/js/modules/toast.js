const ToastSystem = {
  container: null,
  toasts: [],
  storageKey: 'pendingToast',

  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
    
    this.checkForPendingToast();
  },

  show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
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
        const age = Date.now() - (toast.timestamp || 0);
        
        if (age < 10000) {
          setTimeout(() => {
            this.show(toast.message, toast.type);
          }, 300);
        }
        
        sessionStorage.removeItem(this.storageKey);
      } catch (e) {
        console.error('Error parsing toast data:', e);
        sessionStorage.removeItem(this.storageKey);
      }
    }
  },

  // NEW METHOD: Show toast and navigate after delay
  showAndNavigate(message, type, url, delay = 1500) {
    this.show(message, type, delay);
    setTimeout(() => {
      this.storeForNextPage(message, type);
      window.location.href = url;
    }, delay);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ToastSystem.init());
} else {
  ToastSystem.init();
}