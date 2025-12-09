/**
 * Custom Confirmation System
 * Replaces native browser confirm dialogs
 */

const ConfirmSystem = {
    modal: null,
    overlay: null,
    onConfirm: null,

    init() {
        if (document.getElementById('customConfirmModal')) {
            this.modal = document.getElementById('customConfirmModal');
            this.overlay = document.getElementById('modalOverlay');
            // Note: We reuse the existing modalOverlay from ui-controls.js
            return;
        }

        // Create modal structure if it doesn't exist (though ideally we should add it to HTML)
        // For now, we'll generate it dynamically to be self-contained

        const modalHtml = `
            <div class="modal" id="customConfirmModal" style="max-width: 400px; text-align: center;">
                <div class="modal-body" style="padding: 30px 20px;">
                    <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: #dc3545; margin-bottom: 15px; display: block;"></i>
                    <h3 id="confirmTitle" style="margin-bottom: 10px; color: #333;">Are you sure?</h3>
                    <p id="confirmMessage" style="color: #666; margin-bottom: 25px;">This action cannot be undone.</p>
                    <div style="display: flex; justify-content: center; gap: 15px;">
                        <button id="confirmCancelBtn" class="btn-secondary">Cancel</button>
                        <button id="confirmProceedBtn" class="btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        this.modal = document.getElementById('customConfirmModal');
        // Ensure overlay exists
        if (!document.getElementById('modalOverlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = 'modalOverlay';
            document.body.appendChild(overlay);
        }
        this.overlay = document.getElementById('modalOverlay');

        // Bind events
        document.getElementById('confirmCancelBtn').addEventListener('click', () => this.hide());
        document.getElementById('confirmProceedBtn').addEventListener('click', () => {
            if (this.onConfirm) this.onConfirm();
            this.hide();
        });
    },

    show(message, onConfirmCallback, type = 'danger', title = 'Are you sure?') {
        if (!this.modal) this.init();

        this.onConfirm = onConfirmCallback;

        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmTitle').textContent = title;

        const proceedBtn = document.getElementById('confirmProceedBtn');
        const icon = this.modal.querySelector('i');

        if (type === 'danger') {
            proceedBtn.className = 'btn-danger';
            proceedBtn.textContent = 'Delete';
            icon.className = 'fa-solid fa-circle-exclamation';
            icon.style.color = '#dc3545';
        } else {
            proceedBtn.className = 'btn-primary';
            proceedBtn.textContent = 'Confirm';
            icon.className = 'fa-solid fa-circle-check'; // or question
            icon.style.color = 'var(--primary-maroon)';
        }

        // Use global openModal function if available, or manual class toggle
        if (window.openModal) {
            window.openModal(this.modal);
        } else {
            this.modal.classList.add('active');
            this.overlay.classList.add('active');
        }
    },

    hide() {
        if (window.closeModal) {
            window.closeModal(this.modal);
        } else {
            this.modal.classList.remove('active');
            this.overlay.classList.remove('active');
        }
    }
};

window.ConfirmSystem = ConfirmSystem;
