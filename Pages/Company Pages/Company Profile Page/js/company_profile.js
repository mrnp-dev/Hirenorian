/**
 * COMPANY PROFILE - Interactive JavaScript
 * Handles view/edit mode toggling, image uploads, and data synchronization.
 */

// ========== GLOBAL STATE ==========
let currentImageType = ''; // 'banner' or 'icon'
let currentEditItem = null;
let currentEditSection = '';
let itemCounter = {
    perks: 4, // Starting after initial 3
    locations: 3, // Starting after initial 2
    contacts: 2 // Starting after initial 1
};

// ========== VIEW / EDIT MODE TOGGLE ==========

/**
 * Toggles between View Mode and Edit Mode
 * @param {boolean} isEditMode - true to show Edit container, false to show View container
 */
function toggleEditMode(isEditMode) {
    const viewContainer = document.getElementById('view-profile-container');
    const editContainer = document.getElementById('edit-profile-container');

    if (isEditMode) {
        // Show Edit, Hide View
        viewContainer.style.display = 'none';
        editContainer.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Show View, Hide Edit
        editContainer.style.display = 'none';
        viewContainer.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Saves changes from Edit Mode to View Mode (and Backend)
 */
function saveProfileChanges() {
    // 1. Sync Header Information
    const companyName = document.getElementById('editCompanyName').value;
    const tagLine = document.getElementById('editCompanyTagline').value;
    const industry = document.getElementById('editCompanyIndustry').value;

    document.getElementById('viewCompanyName').textContent = companyName;
    document.getElementById('viewCompanyTagline').textContent = tagLine;
    document.getElementById('viewCompanyIndustry').textContent = industry;

    // 2. Sync Contact Info
    const email = document.getElementById('editContactEmail').value;
    const location = document.getElementById('editContactLocation').value;
    const website = document.getElementById('editContactWebsite').value;

    document.getElementById('viewContactEmail').textContent = email;
    document.getElementById('viewContactLocation').textContent = location;

    // Update link href and text
    const websiteLink = document.getElementById('viewContactWebsite');
    websiteLink.textContent = website;
    websiteLink.href = website;

    // 3. Sync Main Text Sections
    const aboutText = document.getElementById('editAboutUsText').value;
    const whyJoinText = document.getElementById('editWhyJoinText').value;

    document.getElementById('viewAboutUsText').textContent = aboutText;
    document.getElementById('viewWhyJoinText').textContent = whyJoinText;

    // 4. Sync Lists (Perks, Locations, Contacts)
    // Since lists are modified in real-time in the Edit container DOM, 
    // we need to copy the HTML structure to the View container 
    // AND strip out the edit buttons/actions.

    syncListToView('editPerksList', 'viewPerksList');
    syncListToView('editLocationsList', 'viewLocationsList');
    syncListToView('editContactsList', 'viewContactsList');

    // 5. Sync Images (Banner/Icon)
    // Images are updated in the edit container immediately via the modal.
    // We just need to copy the src to the view container.
    document.getElementById('viewCompanyBanner').src = document.getElementById('editCompanyBanner').src;
    document.getElementById('viewCompanyIcon').src = document.getElementById('editCompanyIcon').src;

    // TODO: Send all data to Backend API here
    // const payload = { ... };
    // fetch('/api/updateProfile', { ... });

    showNotification('Profile updated successfully!', 'success');
    toggleEditMode(false);
}

/**
 * Helper to sync a list from Edit container to View container
 * Removes 'item-actions' buttons from the cloned content.
 */
function syncListToView(editListId, viewListId) {
    const editList = document.getElementById(editListId);
    const viewList = document.getElementById(viewListId);

    // Clone the entire list
    const clone = editList.cloneNode(true);
    clone.id = viewListId; // Update ID

    // Remove all .item-actions divs
    const actionDivs = clone.querySelectorAll('.item-actions');
    actionDivs.forEach(div => div.remove());

    // Replace the view list with the cleaned clone
    viewList.parentNode.replaceChild(clone, viewList);
}


// ========== IMAGE UPLOAD MODAL ==========

function openImageUploadModal(type) {
    currentImageType = type;
    const modal = document.getElementById('imageUploadModal');
    const title = document.getElementById('imageModalTitle');

    title.textContent = type === 'banner' ? 'Update Company Banner' : 'Update Company Icon';
    resetImagePreview();

    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closeImageUploadModal() {
    const modal = document.getElementById('imageUploadModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        resetImagePreview();
    }, 300);
}

function resetImagePreview() {
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const fileInput = document.getElementById('imageFileInput');

    preview.style.display = 'none';
    preview.src = '';
    placeholder.style.display = 'block';
    fileInput.value = '';
}

// File Selection
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('imageFileInput');

    fileInput?.addEventListener('change', function (e) {
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
        }
    });
});

/**
 * Updates the image in the EDIT container.
 * Changes are only finalized to View container on "Save Profile".
 */
function saveImageChanges() {
    const preview = document.getElementById('imagePreview');

    if (preview.style.display === 'none') {
        alert('Please select an image first');
        return;
    }

    if (currentImageType === 'banner') {
        document.getElementById('editCompanyBanner').src = preview.src;
    } else if (currentImageType === 'icon') {
        document.getElementById('editCompanyIcon').src = preview.src;
    }

    closeImageUploadModal();
}


// ========== ADD/EDIT LIST ITEMS (PERKS, LOCATIONS, CONTACTS) ==========
// These operate on the EDIT Container lists.

function openAddModal(section) {
    currentEditSection = section;
    currentEditItem = null;

    if (section === 'perks') {
        document.getElementById('perkModalTitle').textContent = 'Add Perk';
        document.getElementById('perkText').value = '';
        showModal('perkModal');
    } else if (section === 'locations') {
        document.getElementById('locationModalTitle').textContent = 'Add Office Location';
        document.getElementById('locationName').value = '';
        document.getElementById('locationDescription').value = '';
        showModal('locationModal');
    } else if (section === 'contacts') {
        document.getElementById('contactPersonModalTitle').textContent = 'Add Contact Person';
        document.getElementById('personName').value = '';
        document.getElementById('personPosition').value = '';
        document.getElementById('personEmail').value = '';
        document.getElementById('personPhone').value = '';
        showModal('contactPersonModal');
    }
}

function editListItem(itemId, section) {
    currentEditItem = itemId;
    currentEditSection = section;

    // Use currentEditItem to find the element in the EDIT list
    const item = document.querySelector(`#edit-profile-container [data-id="${itemId}"]`);
    if (!item) return;

    if (section === 'perks') {
        const text = item.querySelector('span').textContent;
        document.getElementById('perkModalTitle').textContent = 'Edit Perk';
        document.getElementById('perkText').value = text;
        showModal('perkModal');
    } else if (section === 'locations') {
        const name = item.querySelector('h4').textContent;
        const description = item.querySelector('.location-description').textContent;
        document.getElementById('locationModalTitle').textContent = 'Edit Office Location';
        document.getElementById('locationName').value = name;
        document.getElementById('locationDescription').value = description;
        showModal('locationModal');
    } else if (section === 'contacts') {
        const name = item.querySelector('h4').textContent;
        const position = item.querySelector('.contact-position').textContent.replace('Position: ', '');
        const email = item.querySelector('.contact-email').textContent.replace('Email: ', '');
        const phone = item.querySelector('.contact-phone').textContent.replace('Number: ', '');

        document.getElementById('contactPersonModalTitle').textContent = 'Edit Contact Person';
        document.getElementById('personName').value = name;
        document.getElementById('personPosition').value = position;
        document.getElementById('personEmail').value = email;
        document.getElementById('personPhone').value = phone;
        showModal('contactPersonModal');
    }
}

function deleteListItem(itemId, section) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    // Find item to delete in Edit Container
    const item = document.querySelector(`#edit-profile-container [data-id="${itemId}"]`);
    if (item) {
        item.remove();
        // showNotification('Item deleted (unsaved)', 'success');
    }
}

// ========== SAVE LIST ITEMS (INTERNAL TO EDIT CONTAINER) ==========

function savePerk() {
    const text = document.getElementById('perkText').value.trim();
    if (!text) return alert('Please enter text');

    if (currentEditItem) {
        // Edit existing
        const item = document.querySelector(`#edit-profile-container [data-id="${currentEditItem}"]`);
        if (item) item.querySelector('span').textContent = text;
    } else {
        // Add new
        const newId = `perk-${itemCounter.perks++}`;
        const list = document.getElementById('editPerksList');
        const li = document.createElement('li');
        li.className = 'benefit-item';
        li.setAttribute('data-id', newId);
        li.innerHTML = `
            <span>${text}</span>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editListItem('${newId}', 'perks')"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" onclick="deleteListItem('${newId}', 'perks')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    }
    closePerkModal();
}

function saveLocation() {
    const name = document.getElementById('locationName').value.trim();
    const desc = document.getElementById('locationDescription').value.trim();
    if (!name || !desc) return alert('Fill all fields');

    if (currentEditItem) {
        const item = document.querySelector(`#edit-profile-container [data-id="${currentEditItem}"]`);
        if (item) {
            item.querySelector('h4').textContent = name;
            item.querySelector('.location-description').textContent = desc;
        }
    } else {
        const newId = `loc-${itemCounter.locations++}`;
        const list = document.getElementById('editLocationsList');
        const div = document.createElement('div');
        div.className = 'location-item';
        div.setAttribute('data-id', newId);
        div.innerHTML = `
            <div class="location-icon"><i class="fa-solid fa-map-marker-alt"></i></div>
            <div class="location-content">
                <h4>${name}</h4>
                <p class="location-description">${desc}</p>
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editListItem('${newId}', 'locations')"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" onclick="deleteListItem('${newId}', 'locations')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    }
    closeLocationModal();
}

function saveContactPerson() {
    const name = document.getElementById('personName').value.trim();
    const pos = document.getElementById('personPosition').value.trim();
    const email = document.getElementById('personEmail').value.trim();
    const phone = document.getElementById('personPhone').value.trim();
    if (!name || !pos || !email || !phone) return alert('Fill all fields');

    if (currentEditItem) {
        const item = document.querySelector(`#edit-profile-container [data-id="${currentEditItem}"]`);
        if (item) {
            item.querySelector('h4').textContent = name;
            item.querySelector('.contact-position').textContent = `Position: ${pos}`;
            item.querySelector('.contact-email').textContent = `Email: ${email}`;
            item.querySelector('.contact-phone').textContent = `Number: ${phone}`;
        }
    } else {
        const newId = `contact-${itemCounter.contacts++}`;
        const list = document.getElementById('editContactsList');
        const div = document.createElement('div');
        div.className = 'contact-person-item';
        div.setAttribute('data-id', newId);
        div.innerHTML = `
            <div class="contact-info">
                <h4>${name}</h4>
                <p class="contact-position">Position: ${pos}</p>
                <p class="contact-email">Email: ${email}</p>
                <p class="contact-phone">Number: ${phone}</p>
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editListItem('${newId}', 'contacts')"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" onclick="deleteListItem('${newId}', 'contacts')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    }
    closeContactPersonModal();
}


// ========== UTILITY ==========

function showModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closePerkModal() { closeModal('perkModal'); }
function closeLocationModal() { closeModal('locationModal'); }
function closeContactPersonModal() { closeModal('contactPersonModal'); }

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    // Inline styles for notification
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; padding: 16px 24px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000;
        animation: slideInRight 0.3s ease; font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes if not present
if (!document.getElementById('notif-styles')) {
    const s = document.createElement('style');
    s.id = 'notif-styles';
    s.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(s);
}

// Close modals on outside click
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        setTimeout(() => { e.target.style.display = 'none'; }, 300);
    }
});
