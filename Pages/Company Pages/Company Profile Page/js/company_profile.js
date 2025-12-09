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

// ========== VALIDATION CONSTANTS ==========
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+63|0)9\d{9}$/;

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
    let hasChanges = false;

    // 1. Sync Header Information
    const companyNameInput = document.getElementById('editCompanyName');
    const originalCompanyName = document.getElementById('viewCompanyName').textContent;
    let companyName = companyNameInput.value.trim();

    // Validation: Company Name (Cannot be empty)
    if (!companyName) {
        companyName = originalCompanyName; // Revert to saved value
        companyNameInput.value = originalCompanyName; // Update input to reflect revert
    }

    if (companyName !== originalCompanyName) {
        document.getElementById('viewCompanyName').textContent = companyName;
        hasChanges = true;
    }

    const tagLineInput = document.getElementById('editCompanyTagline');
    const originalTagLineText = document.getElementById('viewCompanyTagline').textContent;
    const tagLine = tagLineInput.value;
    const resolvedTagLine = tagLine ? tagLine : "No tagline provided";

    if (resolvedTagLine !== originalTagLineText) {
        document.getElementById('viewCompanyTagline').textContent = resolvedTagLine;
        hasChanges = true;
    }

    const industryInput = document.getElementById('editCompanyIndustry');
    const originalIndustry = document.getElementById('viewCompanyIndustry').textContent;
    const industry = industryInput.value;

    if (industry !== originalIndustry) {
        document.getElementById('viewCompanyIndustry').textContent = industry;
        hasChanges = true;
    }

    // 2. Sync Contact Info
    const emailInput = document.getElementById('editContactEmail');
    const originalEmail = document.getElementById('viewContactEmail').textContent;
    let email = emailInput.value.trim();

    // Validation: Email (Cannot be empty and must be valid)
    if (!email || !EMAIL_REGEX.test(email)) {
        email = originalEmail; // Revert to saved value
        emailInput.value = originalEmail; // Update input to reflect revert
    }

    if (email !== originalEmail) {
        document.getElementById('viewContactEmail').textContent = email;
        hasChanges = true;
    }

    const locationInput = document.getElementById('editContactLocation');
    const originalLocation = document.getElementById('viewContactLocation').textContent;
    const location = locationInput.value;

    if (location !== originalLocation) {
        document.getElementById('viewContactLocation').textContent = location;
        hasChanges = true;
    }

    const websiteInput = document.getElementById('editContactWebsite');
    const websiteLinkElement = document.getElementById('viewContactWebsite');
    const originalWebsite = websiteLinkElement.getAttribute('href') !== '#' ? websiteLinkElement.getAttribute('href') : '';
    const website = websiteInput.value;

    // Determine what the text content should be
    const resolvedWebsiteText = website ? website : "Set Website Link";
    const resolvedWebsiteHref = website ? website : "#";

    // Check for changes (comparing href mostly as text might have placeholder)
    if (resolvedWebsiteHref !== websiteLinkElement.getAttribute('href')) {
        websiteLinkElement.textContent = resolvedWebsiteText;
        websiteLinkElement.href = resolvedWebsiteHref;
        hasChanges = true;
    }

    // 3. Sync Main Text Sections
    const aboutTextInput = document.getElementById('editAboutUsText');
    const originalAboutUs = document.getElementById('viewAboutUsText').textContent;
    const aboutText = aboutTextInput.value;
    const resolvedAboutText = aboutText ? aboutText : "No about us provided";

    if (resolvedAboutText !== originalAboutUs) {
        document.getElementById('viewAboutUsText').textContent = resolvedAboutText;
        hasChanges = true;
    }

    const whyJoinTextInput = document.getElementById('editWhyJoinText');
    const originalWhyJoin = document.getElementById('viewWhyJoinText').textContent;
    const whyJoinText = whyJoinTextInput.value;
    const resolvedWhyJoinText = whyJoinText ? whyJoinText : "No why join us provided";

    if (resolvedWhyJoinText !== originalWhyJoin) {
        document.getElementById('viewWhyJoinText').textContent = resolvedWhyJoinText;
        hasChanges = true;
    }

    // 4. Sync Lists (Perks, Locations, Contacts)
    // For lists, simplistic change detection is hard (order, content, ids). 
    // We will assume that if the edit list innerHTML differs at all from a 'virtual' sync, 
    // but honestly, since these are modified in real-time in the Edit container, 
    // any addition/deletion/edit there SHOULD count as a change already if we were tracking it.
    // However, the prompt says "if there's no changes on company profile, don't toast".
    // Since list edits (add/delete/edit items) happen immediately in the DOM of the *Edit List*,
    // but are only committed to the *View List* here.
    // We can detect if the View List HTML is effectively different from what we are about to put in.

    // A simpler heuristic for lists:
    // We'll proceed with syncing. If we want to be strict about "no changes" including lists, 
    // we would need to snapshot the lists before editing. 
    // Given the difficulty, we will assume true "No Changes" mostly applies to the main fields,
    // OR, we can flag 'hasChanges' = true whenever `savePerk/Location/Contact` or `deleteListItem` is called.
    // BUT those functions modify the Edit DOM immediately. 
    // Let's rely on checking if the generated HTML for view differs from current view HTML.

    if (syncListToView('editPerksList', 'viewPerksList', 'perks')) hasChanges = true;
    if (syncListToView('editLocationsList', 'viewLocationsList', 'locations')) hasChanges = true;
    if (syncListToView('editContactsList', 'viewContactsList', 'contacts')) hasChanges = true;


    // 5. Sync Images (Banner/Icon)
    const currentBannerSrc = document.getElementById('viewCompanyBanner').src;
    const newBannerSrc = document.getElementById('editCompanyBanner').src;
    if (currentBannerSrc !== newBannerSrc) {
        document.getElementById('viewCompanyBanner').src = newBannerSrc;
        hasChanges = true;
    }

    const currentIconSrc = document.getElementById('viewCompanyIcon').src;
    const newIconSrc = document.getElementById('editCompanyIcon').src;
    if (currentIconSrc !== newIconSrc) {
        document.getElementById('viewCompanyIcon').src = newIconSrc;
        hasChanges = true;
    }

    // TODO: Send all data to Backend API here
    // const payload = { ... };
    // fetch('/api/updateProfile', { ... });

    if (hasChanges) {
        ToastSystem.show('Profile updated successfully!', 'success');
    }

    toggleEditMode(false);
}

/**
 * Helper to sync a list from Edit container to View container
 * Removes 'item-actions' buttons from the cloned content.
 * Returns true if changes were made.
 */
function syncListToView(editListId, viewListId, type) {
    const editList = document.getElementById(editListId);
    const viewList = document.getElementById(viewListId);

    // Clone the entire list
    const clone = editList.cloneNode(true);
    clone.id = viewListId; // Update ID

    // Remove all .item-actions divs
    const actionDivs = clone.querySelectorAll('.item-actions');
    actionDivs.forEach(div => div.remove());

    // If list is empty (no items left), inject empty state HTML
    if (clone.children.length === 0) {
        let emptyHTML = '';
        if (type === 'perks') {
            emptyHTML = `<li class="benefit-item no-perks"><span>No perks listed</span></li>`;
        } else if (type === 'locations') {
            emptyHTML = `
                <div class="location-item no-locations">
                    <div class="location-icon"><i class="fa-solid fa-map-marker-alt"></i></div>
                    <div class="location-content">
                        <h4>No office locations listed</h4>
                    </div>
                </div>`;
        } else if (type === 'contacts') {
            emptyHTML = `
                <div class="contact-person-item no-contacts">
                    <div class="contact-info">
                        <h4>No contact persons listed</h4>
                    </div>
                </div>`;
        }
        clone.innerHTML = emptyHTML;
    }

    // Compare innerHTML to detect changes (normalization might be needed but usually consistent)
    // Note: This is a rough check. Attributes order might differ but here we cloned from DOM so should be consistent.
    if (viewList.innerHTML !== clone.innerHTML) {
        viewList.parentNode.replaceChild(clone, viewList);
        return true;
    }

    return false;
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
        ToastSystem.show('Please select an image first', 'warning');
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
        ToastSystem.show('Item deleted', 'info');
    }
}

// ========== SAVE LIST ITEMS (INTERNAL TO EDIT CONTAINER) ==========

function savePerk() {
    const text = document.getElementById('perkText').value.trim();
    if (!text) return ToastSystem.show('Please enter text', 'warning');

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
    if (!name || !desc) return ToastSystem.show('Fill all fields', 'warning');

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

    // Basic empty check
    if (!name || !pos || !email || !phone) return ToastSystem.show('Fill all fields', 'warning');

    // Validation: Email
    if (!EMAIL_REGEX.test(email)) {
        return ToastSystem.show('Please enter a valid email address', 'warning');
    }

    // Validation: Phone (+63 or 09)
    if (!PHONE_REGEX.test(phone)) {
        return ToastSystem.show('Invalid phone number. Use +639... or 09...', 'warning');
    }

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
    modal.style.display = 'flex';
    // Force reflow to enable transition
    void modal.offsetWidth;
    modal.classList.add('show');
}

function closePerkModal() { closeModal('perkModal'); }
function closeLocationModal() { closeModal('locationModal'); }
function closeContactPersonModal() { closeModal('contactPersonModal'); }

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

// Close modals on outside click
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        setTimeout(() => { e.target.style.display = 'none'; }, 300);
    }
});
