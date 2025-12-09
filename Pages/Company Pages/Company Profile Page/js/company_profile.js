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

    // --- 1. Gather Data using Helper Functions ---
    const basicInfo = getCompanyBasicInfo();
    const stats = getCompanyStats();
    const details = getCompanyDetails();
    const locations = getLocationsList();
    const contacts = getContactsList();
    const perks = getPerksList(); // Optional

    // --- 2. Check for Changes & Validation Reverts ---

    // Validation: Company Name
    const originalCompanyName = document.getElementById('viewCompanyName').textContent;
    if (!basicInfo.name) {
        document.getElementById('editCompanyName').value = originalCompanyName;
        basicInfo.name = originalCompanyName; // Fix payload
    }
    if (basicInfo.name !== originalCompanyName) hasChanges = true;

    // Validation: Email
    const originalEmail = document.getElementById('viewContactEmail').textContent;
    if (!basicInfo.email || !EMAIL_REGEX.test(basicInfo.email)) {
        document.getElementById('editContactEmail').value = originalEmail;
        basicInfo.email = originalEmail; // Fix payload
    }
    if (basicInfo.email !== originalEmail) hasChanges = true;

    // Check other basic info changes
    if (basicInfo.industry !== document.getElementById('viewCompanyIndustry').textContent) hasChanges = true;
    if (basicInfo.address !== document.getElementById('viewContactLocation').textContent) hasChanges = true;

    // Check details changes
    if (details.tagline !== document.getElementById('viewCompanyTagline').textContent) hasChanges = true;

    const originalAbout = document.getElementById('viewAboutUsText').textContent;
    if ((details.aboutUs || "No about us provided") !== originalAbout) hasChanges = true;

    const originalWhy = document.getElementById('viewWhyJoinText').textContent;
    if ((details.whyJoinUs || "No why join us provided") !== originalWhy) hasChanges = true;

    const originalWebsite = document.getElementById('viewContactWebsite').getAttribute('href');
    const newWebsite = details.websiteUrl || "#";
    if (newWebsite !== (originalWebsite === "#" ? "" : originalWebsite) && newWebsite !== "#") hasChanges = true;


    // Check Lists & Images
    if (syncListToView('editPerksList', 'viewPerksList', 'perks')) hasChanges = true;
    if (syncListToView('editLocationsList', 'viewLocationsList', 'locations')) hasChanges = true;
    if (syncListToView('editContactsList', 'viewContactsList', 'contacts')) hasChanges = true;

    const currentBannerSrc = document.getElementById('viewCompanyBanner').src;
    const newBannerSrc = document.getElementById('editCompanyBanner').src;
    if (currentBannerSrc !== newBannerSrc) hasChanges = true;

    const currentIconSrc = document.getElementById('viewCompanyIcon').src;
    const newIconSrc = document.getElementById('editCompanyIcon').src;
    if (currentIconSrc !== newIconSrc) hasChanges = true;


    // --- 3. Backend Integration Point ---
    const payload = {
        company_id: document.getElementById('company_id').value,
        basic_info: basicInfo,
        details: details,
        lists: {
            locations: locations,
            contacts: contacts,
            perks: perks
        }
    };

    // Debugging
    console.log("Payload prepared for Backend:", payload);

    // Send to backend API
    fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/company_profile_update.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                console.log("✅ Profile updated successfully:", result.message);
                // Optionally show a success alert or redirect
            } else {
                console.error("❌ Update failed:", result.message);
                // Optionally show an error alert
            }
        })
        .catch(error => {
            console.error("⚠️ Network or server error:", error);
        });


    // --- 4. Update UI (View Mode) ---

    updateViewModeUI(basicInfo, details);

    // Images
    if (currentBannerSrc !== newBannerSrc) document.getElementById('viewCompanyBanner').src = newBannerSrc;
    if (currentIconSrc !== newIconSrc) document.getElementById('viewCompanyIcon').src = newIconSrc;

    if (hasChanges) {
        ToastSystem.show('Profile updated successfully!', 'success');
    }

    toggleEditMode(false);
}

/**
 * Updates the View Mode DOM elements with the gathered data.
 */
function updateViewModeUI(basicInfo, details) {
    document.getElementById('viewCompanyName').textContent = basicInfo.name;
    document.getElementById('viewCompanyIndustry').textContent = basicInfo.industry;
    document.getElementById('viewContactEmail').textContent = basicInfo.email;
    document.getElementById('viewContactLocation').textContent = basicInfo.address;

    document.getElementById('viewCompanyTagline').textContent = details.tagline || "No tagline provided";
    document.getElementById('viewAboutUsText').textContent = details.aboutUs || "No about us provided";
    document.getElementById('viewWhyJoinText').textContent = details.whyJoinUs || "No why join us provided";

    const websiteLink = document.getElementById('viewContactWebsite');
    websiteLink.textContent = details.websiteUrl || "Set Website Link";
    websiteLink.href = details.websiteUrl || "#";
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

    // Compare innerHTML to detect changes
    if (viewList.innerHTML !== clone.innerHTML) {
        viewList.parentNode.replaceChild(clone, viewList);
        return true;
    }

    return false;
}


// ========== DATA RETRIEVAL HELPERS ==========

function getCompanyBasicInfo() {
    return {
        name: document.getElementById('editCompanyName').value.trim(),
        industry: document.getElementById('editCompanyIndustry').value,
        email: document.getElementById('editContactEmail').value.trim(),
        address: document.getElementById('editContactLocation').value.trim(),
        phoneNumber: "" // Placeholder
    };
}

function getCompanyStats() {
    const employees = document.querySelector('.card.stats-card .stat-item:nth-child(1) .stat-value')?.textContent || 0;
    const accepted = document.querySelector('.card.stats-card .stat-item:nth-child(2) .stat-value')?.textContent || 0;
    const rejected = document.querySelector('.card.stats-card .stat-item:nth-child(3) .stat-value')?.textContent || 0;

    return {
        totalApplicants: parseInt(employees),
        accepted: parseInt(accepted),
        rejected: parseInt(rejected)
    };
}

function getCompanyDetails() {
    return {
        tagline: document.getElementById('editCompanyTagline').value.trim(),
        aboutUs: document.getElementById('editAboutUsText').value.trim(),
        whyJoinUs: document.getElementById('editWhyJoinText').value.trim(),
        websiteUrl: document.getElementById('editContactWebsite').value.trim()
    };
}

function getLocationsList() {
    const listItems = document.querySelectorAll('#editLocationsList .location-item');
    const locations = [];
    listItems.forEach(item => {
        locations.push({
            name: item.querySelector('h4').textContent.trim(),
            description: item.querySelector('.location-description').textContent.trim()
        });
    });
    return locations;
}

function getContactsList() {
    const listItems = document.querySelectorAll('#editContactsList .contact-person-item');
    const contacts = [];
    listItems.forEach(item => {
        const name = item.querySelector('h4').textContent.trim();
        const position = item.querySelector('.contact-position').textContent.replace('Position:', '').trim();
        const email = item.querySelector('.contact-email').textContent.replace('Email:', '').trim();
        const phone = item.querySelector('.contact-phone').textContent.replace('Number:', '').trim();

        contacts.push({
            name: name,
            position: position,
            email: email,
            phoneNumber: phone
        });
    });
    return contacts;
}

function getPerksList() {
    const listItems = document.querySelectorAll('#editPerksList .benefit-item');
    const perks = [];
    listItems.forEach(item => {
        perks.push({
            description: item.querySelector('span').textContent.trim()
        });
    });
    return perks;
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

// ========== ACCOUNT MANAGER LOGIC ==========

document.addEventListener('DOMContentLoaded', function () {
    // 1. Password Visibility Toggles
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // 2. Real-time Password Strength (New Password)
    const newPassInput = document.getElementById('newPassword');
    const strengthHint = document.getElementById('passwordStrengthHint');
    const newPassError = document.getElementById('newPasswordError');

    // Hide hint initially
    if (strengthHint) strengthHint.style.display = 'none';

    if (newPassInput) {
        newPassInput.addEventListener('input', function () {
            // Clear error message on typing
            newPassError.classList.remove('show');

            const val = this.value;
            const length = val.length;

            if (length < 12) {
                // Hide strength meter if length < 12
                strengthHint.style.display = 'none';
                return;
            }

            // Show strength meter if length >= 12
            strengthHint.style.display = 'block';

            // Logic from company_registration.js
            const hasLetters = /[a-zA-Z]/.test(val);
            const hasNumbers = /[0-9]/.test(val);
            const hasSpecials = /[^a-zA-Z0-9]/.test(val);
            const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;

            let strengthText = "";
            let color = "";

            switch (typesCount) {
                case 1:
                    strengthText = "Weak";
                    color = "#dc3545"; // Red
                    break;
                case 2:
                    strengthText = "Medium";
                    color = "#fd7e14"; // Orange
                    break;
                case 3:
                    strengthText = "Strong";
                    color = "#28a745"; // Green
                    break;
                default:
                    // Should not happen if length >= 12 and input has chars, but fallback
                    strengthText = "Weak";
                    color = "#dc3545";
            }

            strengthHint.innerHTML = `Strength: <span style="color: ${color}">${strengthText}</span>`;
            strengthHint.style.color = "black";
        });

        // 3. On-Blur Validation (Min Length)
        newPassInput.addEventListener('blur', function () {
            if (this.value.length > 0 && this.value.length < 12) {
                newPassError.textContent = "Password must be at least 12 characters.";
                newPassError.classList.add('show');
            } else {
                newPassError.classList.remove('show');
            }
        });
    }

    // 4. On-Blur Validation (Confirm Password Match)
    const confirmPassInput = document.getElementById('confirmPassword');
    const confirmPassError = document.getElementById('confirmPasswordError');

    if (confirmPassInput) {
        confirmPassInput.addEventListener('blur', function () {
            const password = document.getElementById('newPassword').value;
            if (this.value.length > 0 && this.value !== password) {
                confirmPassError.textContent = "Passwords do not match.";
                confirmPassError.classList.add('show');
            } else {
                confirmPassError.classList.remove('show');
            }
        });
    }

    // 5. Current Password Logic (Mock)
    const currentPassInput = document.getElementById('currentPassword');
    const currentPassError = document.getElementById('currentPasswordError');
    if (currentPassInput) {
        currentPassInput.addEventListener('input', function () {
            currentPassError.classList.remove('show');
        });
    }

    // 6. Verification Icon Placeholder Logic
    loadVerificationStatus();
});

// --- Change Password Modal ---
function openChangePasswordModal() {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    // Reset errors/hints
    document.querySelectorAll('.error-text').forEach(el => el.classList.remove('show'));
    const strengthHint = document.getElementById('passwordStrengthHint');
    strengthHint.textContent = "Min 12 chars, Medium strength required.";
    strengthHint.style.color = "#666";
    strengthHint.style.display = "block"; // Ensure it is visible initially
    // Reset visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    });
    document.querySelectorAll('.password-wrapper input').forEach(inp => inp.type = 'password');

    showModal('changePasswordModal');
}

function closeChangePasswordModal() {
    closeModal('changePasswordModal');
}

function savePassword() {
    const email = document.getElementById('viewContactEmail').textContent
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const currentPassError = document.getElementById('currentPasswordError');
    console.log(currentPass);

    if (!currentPass || !newPass || !confirmPass) {
        return ToastSystem.show('Please fill in all fields', 'warning');
    }

    if (newPass.length < 12) {
        return ToastSystem.show('Password too short', 'warning');
    }
    if (newPass !== confirmPass) {
        return ToastSystem.show('Passwords do not match', 'warning');
    }

    // Step 1: Verify current password
    fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/check_current_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, current_password: currentPass })
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {

                // Step 2: If verified, update password
                return fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/reset_password.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, new_password: newPass })
                });
            } else {
                if (currentPassError) {
                    currentPassError.textContent = "Incorrect current password.";
                    currentPassError.classList.add('show');
                } else {
                    ToastSystem.show('Incorrect current password', 'error');
                }
                throw new Error("Password verification failed");
            }
        })
        .then(response => response.json())
        .then(updateResult => {
            if (updateResult.status === "success") {
                ToastSystem.show('Password changed successfully!', 'success');
                closeChangePasswordModal();
            } else {
                ToastSystem.show('Failed to change password: ' + updateResult.message, 'error');
            }
        })
        .catch(error => {
            console.error("⚠️ Error:", error);
            ToastSystem.show('An error occurred while changing password', 'error');
        });
}


// --- Verify Account Modal ---
function openVerifyAccountModal() {
    document.getElementById('docPhilJobNet').value = '';
    document.getElementById('docDole').value = '';
    document.getElementById('docBir').value = '';
    document.getElementById('docMayor').value = '';
    showModal('verifyAccountModal');
}

function closeVerifyAccountModal() {
    closeModal('verifyAccountModal');
}

function submitVerifyDocuments() {
    const doc1 = document.getElementById('docPhilJobNet').files[0];
    const doc2 = document.getElementById('docDole').files[0];
    const doc3 = document.getElementById('docBir').files[0];
    const doc4 = document.getElementById('docMayor').files[0];

    if (!doc1 || !doc2 || !doc3 || !doc4) {
        return ToastSystem.show('Please attach all 4 required documents', 'warning');
    }

    // Backend Logic Placeholder
    console.log("Verify Account Documents:", { doc1, doc2, doc3, doc4 });
    // TODO: Implement backend call here (FormData upload)

    ToastSystem.show('Documents submitted for verification', 'success');
    closeVerifyAccountModal();
}

/**
 * Placeholder for fetching/checking verification status
 */
function loadVerificationStatus() {
    // In a real scenario, this might come from the PHP session variable injected into JS 
    // or a separate API call.
    // For now, we will leave the icon empty or set a test state.

    const badge = document.getElementById('verificationBadge');
    if (!badge) return;

    // TODO: Connect to actual backend status
    // Example:
    // const status = "verified"; // or "unverified"
    // if (status === "verified") {
    //     badge.innerHTML = '<i class="fa-solid fa-circle-check verification-icon verified"></i>';
    //     badge.title = "Verified Account";
    // } else {
    //     badge.innerHTML = '<i class="fa-solid fa-shield-halved verification-icon unverified"></i>';
    //     badge.title = "Unverified Account";
    // }
}

