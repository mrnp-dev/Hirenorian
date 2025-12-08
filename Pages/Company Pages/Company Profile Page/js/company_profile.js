/**
 * COMPANY PROFILE - Interactive JavaScript
 * Handles image uploads, edit modals, and list management
 * Backend integration points are stubbed for future implementation
 */

// ========== GLOBAL STATE ==========
let currentImageType = ''; // 'banner' or 'icon'
let currentEditItem = null;
let currentEditSection = '';
let itemCounter = {
    perks: 4,
    locations: 3,
    contacts: 2
};

// ========== IMAGE UPLOAD MODAL ==========

/**
 * Opens the image upload modal for banner or icon
 * @param {string} type - 'banner' or 'icon'
 */
function openImageUploadModal(type) {
    currentImageType = type;
    const modal = document.getElementById('imageUploadModal');
    const title = document.getElementById('imageModalTitle');

    title.textContent = type === 'banner' ? 'Update Company Banner' : 'Update Company Profile';

    // Reset preview
    resetImagePreview();

    modal.classList.add('show');
    modal.style.display = 'flex';
}

/**
 * Closes the image upload modal
 */
function closeImageUploadModal() {
    const modal = document.getElementById('imageUploadModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        resetImagePreview();
    }, 300);
}

/**
 * Resets the image preview to default state
 */
function resetImagePreview() {
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const fileInput = document.getElementById('imageFileInput');

    preview.style.display = 'none';
    preview.src = '';
    placeholder.style.display = 'block';
    fileInput.value = '';
}

/**
 * Handles image file selection and preview
 */
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('imageFileInput');

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const preview = document.getElementById('imagePreview');
                const placeholder = document.getElementById('uploadPlaceholder');

                preview.src = event.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file');
        }
    });
});

/**
 * Saves the uploaded image
 * TODO: Backend integration - upload file to server
 */
function saveImageChanges() {
    const fileInput = document.getElementById('imageFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first');
        return;
    }

    // Preview functionality - update the displayed image
    const reader = new FileReader();
    reader.onload = function (e) {
        if (currentImageType === 'banner') {
            document.getElementById('companyBanner').src = e.target.result;
        } else if (currentImageType === 'icon') {
            document.getElementById('companyIcon').src = e.target.result;
        }

        closeImageUploadModal();
        showNotification('Image updated successfully!', 'success');
    };
    reader.readAsDataURL(file);

    // TODO: Backend integration
    // uploadImageToServer(file, currentImageType);
}

// ========== EDIT CONTENT MODALS ==========

/**
 * Opens edit modal for a specific section
 * @param {string} section - 'contact', 'about', etc.
 */
function openEditModal(section) {
    currentEditSection = section;

    if (section === 'contact') {
        openEditContactModal();
    } else if (section === 'about') {
        openEditAboutModal();
    }
}

/**
 * Opens the contact information edit modal
 */
function openEditContactModal() {
    const modal = document.getElementById('editContactModal');

    // Pre-fill with current values
    const contactItems = document.querySelectorAll('#contactInfo .info-item');
    if (contactItems.length >= 3) {
        document.getElementById('contactEmail').value = contactItems[0].querySelector('span').textContent;
        document.getElementById('contactLocation').value = contactItems[1].querySelector('span').textContent;
        document.getElementById('contactWebsite').value = contactItems[2].querySelector('a').textContent;
    }

    modal.classList.add('show');
    modal.style.display = 'flex';
}

/**
 * Opens the about us edit modal
 */
function openEditAboutModal() {
    const modal = document.getElementById('editAboutModal');

    // Pre-fill with current text
    const aboutText = document.getElementById('aboutUsText').textContent.trim();
    document.getElementById('aboutText').value = aboutText;

    modal.classList.add('show');
    modal.style.display = 'flex';
}

/**
 * Closes edit modal for a specific section
 * @param {string} section - 'contact', 'about', etc.
 */
function closeEditModal(section) {
    let modalId = '';

    if (section === 'contact') {
        modalId = 'editContactModal';
    } else if (section === 'about') {
        modalId = 'editAboutModal';
    }

    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Saves changes from edit modals
 * TODO: Backend integration - save to database
 */
function saveContentChanges(section) {
    if (section === 'contact') {
        const email = document.getElementById('contactEmail').value;
        const location = document.getElementById('contactLocation').value;
        const website = document.getElementById('contactWebsite').value;

        if (!email || !location || !website) {
            alert('Please fill in all fields');
            return;
        }

        // Update UI
        const contactInfo = document.getElementById('contactInfo');
        contactInfo.innerHTML = `
            <div class="info-item">
                <i class="fa-solid fa-envelope"></i>
                <span>${email}</span>
            </div>
            <div class="info-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>${location}</span>
            </div>
            <div class="info-item">
                <i class="fa-solid fa-link"></i>
                <a href="${website}" target="_blank">${website}</a>
            </div>
        `;

        closeEditModal('contact');
        showNotification('Contact information updated!', 'success');

        // TODO: Backend integration
        // saveToBackend('contact', { email, location, website });

    } else if (section === 'about') {
        const aboutText = document.getElementById('aboutText').value;

        if (!aboutText) {
            alert('Please enter some text');
            return;
        }

        // Update UI
        document.getElementById('aboutUsText').textContent = aboutText;

        closeEditModal('about');
        showNotification('About Us updated!', 'success');

        // TODO: Backend integration
        // saveToBackend('about', { text: aboutText });
    }
}

// ========== ADD/EDIT LIST ITEMS ==========

/**
 * Opens add modal for list sections
 * @param {string} section - 'perks', 'locations', 'contacts'
 */
function openAddModal(section) {
    currentEditSection = section;
    currentEditItem = null;

    if (section === 'perks') {
        document.getElementById('perkModalTitle').textContent = 'Add Perk';
        document.getElementById('perkText').value = '';
        document.getElementById('perkModal').classList.add('show');
        document.getElementById('perkModal').style.display = 'flex';
    } else if (section === 'locations') {
        document.getElementById('locationModalTitle').textContent = 'Add Office Location';
        document.getElementById('locationName').value = '';
        document.getElementById('locationDescription').value = '';
        document.getElementById('locationModal').classList.add('show');
        document.getElementById('locationModal').style.display = 'flex';
    } else if (section === 'contacts') {
        document.getElementById('contactPersonModalTitle').textContent = 'Add Contact Person';
        document.getElementById('personName').value = '';
        document.getElementById('personPosition').value = '';
        document.getElementById('personEmail').value = '';
        document.getElementById('personPhone').value = '';
        document.getElementById('contactPersonModal').classList.add('show');
        document.getElementById('contactPersonModal').style.display = 'flex';
    }
}

/**
 * Edits an existing list item
 * @param {string} itemId - ID of the item to edit
 * @param {string} section - Section type
 */
function editListItem(itemId, section) {
    currentEditItem = itemId;
    currentEditSection = section;

    if (section === 'perks') {
        const item = document.querySelector(`[data-id="${itemId}"]`) ||
            document.querySelectorAll('.benefit-item')[parseInt(itemId.split('-')[1]) - 1];
        const text = item.querySelector('span').textContent;

        document.getElementById('perkModalTitle').textContent = 'Edit Perk';
        document.getElementById('perkText').value = text;
        document.getElementById('perkModal').classList.add('show');
        document.getElementById('perkModal').style.display = 'flex';
    } else if (section === 'locations') {
        const item = document.querySelector(`[data-id="${itemId}"]`);
        const name = item.querySelector('h4').textContent;
        const description = item.querySelector('.location-description').textContent;

        document.getElementById('locationModalTitle').textContent = 'Edit Office Location';
        document.getElementById('locationName').value = name;
        document.getElementById('locationDescription').value = description;
        document.getElementById('locationModal').classList.add('show');
        document.getElementById('locationModal').style.display = 'flex';
    } else if (section === 'contacts') {
        const item = document.querySelector(`[data-id="${itemId}"]`);
        const name = item.querySelector('h4').textContent;
        const position = item.querySelector('.contact-position').textContent.replace('Position: ', '');
        const email = item.querySelector('.contact-email').textContent.replace('Email: ', '');
        const phone = item.querySelector('.contact-phone').textContent.replace('Number: ', '');

        document.getElementById('contactPersonModalTitle').textContent = 'Edit Contact Person';
        document.getElementById('personName').value = name;
        document.getElementById('personPosition').value = position;
        document.getElementById('personEmail').value = email;
        document.getElementById('personPhone').value = phone;
        document.getElementById('contactPersonModal').classList.add('show');
        document.getElementById('contactPersonModal').style.display = 'flex';
    }
}

/**
 * Deletes a list item
 * @param {string} itemId - ID of the item to delete
 * @param {string} section - Section type
 */
function deleteListItem(itemId, section) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    if (section === 'perks') {
        const item = document.querySelector(`[data-id="${itemId}"]`) ||
            document.querySelectorAll('.benefit-item')[parseInt(itemId.split('-')[1]) - 1];
        item.remove();
    } else if (section === 'locations') {
        const item = document.querySelector(`[data-id="${itemId}"]`);
        item.remove();
    } else if (section === 'contacts') {
        const item = document.querySelector(`[data-id="${itemId}"]`);
        item.remove();
    }

    showNotification('Item deleted successfully!', 'success');

    // TODO: Backend integration
    // deleteFromBackend(section, itemId);
}

// ========== SAVE LIST ITEMS ==========

/**
 * Saves a perk (add or edit)
 */
function savePerk() {
    const text = document.getElementById('perkText').value.trim();

    if (!text) {
        alert('Please enter a perk description');
        return;
    }

    if (currentEditItem) {
        // Edit existing
        const item = document.querySelector(`[data-id="${currentEditItem}"]`) ||
            document.querySelectorAll('.benefit-item')[parseInt(currentEditItem.split('-')[1]) - 1];
        item.querySelector('span').textContent = text;
        showNotification('Perk updated!', 'success');
    } else {
        // Add new
        const newId = `perk-${itemCounter.perks++}`;
        const list = document.getElementById('perksList');

        const newItem = document.createElement('li');
        newItem.className = 'benefit-item';
        newItem.setAttribute('data-id', newId);
        newItem.innerHTML = `
            <span>${text}</span>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editListItem('${newId}', 'perks')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn delete" onclick="deleteListItem('${newId}', 'perks')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        list.appendChild(newItem);
        showNotification('Perk added!', 'success');
    }

    closePerkModal();

    // TODO: Backend integration
    // saveToBackend('perks', { text });
}

/**
 * Saves a location (add or edit)
 */
function saveLocation() {
    const name = document.getElementById('locationName').value.trim();
    const description = document.getElementById('locationDescription').value.trim();

    if (!name || !description) {
        alert('Please fill in all fields');
        return;
    }

    if (currentEditItem) {
        // Edit existing
        const item = document.querySelector(`[data-id="${currentEditItem}"]`);
        item.querySelector('h4').textContent = name;
        item.querySelector('.location-description').textContent = description;
        showNotification('Location updated!', 'success');
    } else {
        // Add new
        const newId = `loc-${itemCounter.locations++}`;
        const list = document.getElementById('locationsList');

        const newItem = document.createElement('div');
        newItem.className = 'location-item';
        newItem.setAttribute('data-id', newId);
        newItem.innerHTML = `
            <div class="location-icon">
                <i class="fa-solid fa-map-marker-alt"></i>
            </div>
            <div class="location-content">
                <h4>${name}</h4>
                <p class="location-description">${description}</p>
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editListItem('${newId}', 'locations')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn delete" onclick="deleteListItem('${newId}', 'locations')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        list.appendChild(newItem);
        showNotification('Location added!', 'success');
    }

    closeLocationModal();

    // TODO: Backend integration
    // saveToBackend('locations', { name, description });
}

/**
 * Saves a contact person (add or edit)
 */
function saveContactPerson() {
    const name = document.getElementById('personName').value.trim();
    const position = document.getElementById('personPosition').value.trim();
    const email = document.getElementById('personEmail').value.trim();
    const phone = document.getElementById('personPhone').value.trim();

    if (!name || !position || !email || !phone) {
        alert('Please fill in all fields');
        return;
    }

    if (currentEditItem) {
        // Edit existing
        const item = document.querySelector(`[data-id="${currentEditItem}"]`);
        item.querySelector('h4').textContent = name;
        item.querySelector('.contact-position').textContent = `Position: ${position}`;
        item.querySelector('.contact-email').textContent = `Email: ${email}`;
        item.querySelector('.contact-phone').textContent = `Number: ${phone}`;
        showNotification('Contact person updated!', 'success');
    } else {
        // Add new
        const newId = `contact-${itemCounter.contacts++}`;
        const list = document.getElementById('contactsList');

        const newItem = document.createElement('div');
        newItem.className = 'contact-person-item';
        newItem.setAttribute('data-id', newId);
        newItem.innerHTML = `
            <div class="contact-info">
                <h4>${name}</h4>
                <p class="contact-position">Position: ${position}</p>
                <p class="contact-email">Email: ${email}</p>
                <p class="contact-phone">Number: ${phone}</p>
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editListItem('${newId}', 'contacts')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn delete" onclick="deleteListItem('${newId}', 'contacts')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        list.appendChild(newItem);
        showNotification('Contact person added!', 'success');
    }

    closeContactPersonModal();

    // TODO: Backend integration
    // saveToBackend('contacts', { name, position, email, phone });
}

// ========== CLOSE SPECIFIC MODALS ==========

function closePerkModal() {
    const modal = document.getElementById('perkModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function closeContactPersonModal() {
    const modal = document.getElementById('contactPersonModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Shows a notification message
 * @param {string} message - Notification text
 * @param {string} type - 'success' or 'error'
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== CLOSE MODALS ON OUTSIDE CLICK ==========
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 300);
    }
});

console.log('Company Profile JS loaded successfully');
