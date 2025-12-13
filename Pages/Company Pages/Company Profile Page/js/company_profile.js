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

    // Validation: Phone (Optional but if present must be valid)
    const originalPhone = document.getElementById('viewContactPhone').textContent;
    const currentPhoneVal = basicInfo.phoneNumber || "No phone number";
    if (basicInfo.phoneNumber && !PHONE_REGEX.test(basicInfo.phoneNumber)) {
        // If invalid, revert or warn? For now let's revert to original if invalid format
        // Ideally we show toast and stop, but fitting into existing pattern:
        document.getElementById('editContactPhone').value = originalPhone === "No phone number" ? "" : originalPhone;
        basicInfo.phoneNumber = originalPhone === "No phone number" ? "" : originalPhone;
        // Optionally alert user?
        ToastSystem.show('Invalid phone number format. Reverted to previous.', 'warning');
    }
    if (currentPhoneVal !== originalPhone) hasChanges = true;

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
    document.getElementById('viewContactPhone').textContent = basicInfo.phoneNumber || "No phone number";

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
        phoneNumber: document.getElementById('editContactPhone').value.trim()
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
        const position = item.querySelector('.contact-position').textContent.replace(/^Position:\s*/i, '').trim();
        const email = item.querySelector('.contact-email').textContent.replace(/^Email:\s*/i, '').trim();
        const phone = item.querySelector('.contact-phone').textContent.replace(/^Number:\s*/i, '').trim();

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
    const fileInput = document.getElementById('imageFileInput');
    const file = fileInput.files[0];
    const companyId = document.getElementById('company_id').value;

    if (!file) {
        ToastSystem.show('Please select an image first', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('uploaded_file', file);
    formData.append('company_id', companyId);
    formData.append('image_type', currentImageType); // 'banner' or 'icon'

    // Show loading state (optional)
    const saveBtn = document.querySelector('#imageUploadModal .btn-save');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Uploading...';
    saveBtn.disabled = true;

    fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/update_company_images.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const newUrl = data.data.image_url;

                // Appending timestamp to force reload image even if URL name is same
                const timestamp = new Date().getTime();
                const cacheBustedUrl = newUrl + '?t=' + timestamp;

                // Update both View and Edit images immediately
                if (currentImageType === 'banner') {
                    document.getElementById('editCompanyBanner').src = cacheBustedUrl;
                    document.getElementById('viewCompanyBanner').src = cacheBustedUrl;
                } else if (currentImageType === 'icon') {
                    document.getElementById('editCompanyIcon').src = cacheBustedUrl;
                    document.getElementById('viewCompanyIcon').src = cacheBustedUrl;
                }

                ToastSystem.show(data.message, 'success');
                closeImageUploadModal();
            } else {
                ToastSystem.show(data.message || 'Upload failed', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            ToastSystem.show('An error occurred during upload', 'error');
        })
        .finally(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        });
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
        const text = item.querySelector('span').textContent.trim();
        document.getElementById('perkModalTitle').textContent = 'Edit Perk';
        document.getElementById('perkText').value = text;
        showModal('perkModal');
    } else if (section === 'locations') {
        const name = item.querySelector('h4').textContent.trim();
        const description = item.querySelector('.location-description').textContent.trim();
        document.getElementById('locationModalTitle').textContent = 'Edit Office Location';
        document.getElementById('locationName').value = name;
        document.getElementById('locationDescription').value = description;
        showModal('locationModal');
    } else if (section === 'contacts') {
        const name = item.querySelector('h4').textContent;
        const position = item.querySelector('.contact-position').textContent.replace(/^Position:\s*/i, '').trim();
        const email = item.querySelector('.contact-email').textContent.replace(/^Email:\s*/i, '').trim();
        const phone = item.querySelector('.contact-phone').textContent.replace(/^Number:\s*/i, '').trim();

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

    // Clear previous file name displays
    const labels = ['docPhilJobNet', 'docDole', 'docBir', 'docMayor'];
    labels.forEach(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        const existingSpan = label.querySelector('.current-file');
        if (existingSpan) existingSpan.remove();

        // Clear input value to ensure change event fires if selecting same file again after error
        document.getElementById(id).value = '';
    });

    // Attach validation listeners if not already attached
    if (!window.hasAttachedDocValidators) {
        const fileInputs = ['docPhilJobNet', 'docDole', 'docBir', 'docMayor'];
        fileInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', function () {
                    if (this.files && this.files[0]) {
                        const file = this.files[0];
                        // Validate Size (Max 5MB)
                        const maxSize = 5 * 1024 * 1024;
                        if (file.size > maxSize) {
                            ToastSystem.show(`File "${file.name}" exceeds the 5MB limit.`, 'error');
                            this.value = ''; // Clear input
                            return;
                        }

                        // Validate Type
                        const allowedTypes = [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'image/jpeg',
                            'image/png',
                            'text/plain'
                        ];
                        // Also check extension as fallback
                        const ext = file.name.split('.').pop().toLowerCase();
                        const allowedExts = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt'];

                        if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
                            ToastSystem.show(`Invalid file type: "${file.name}". Allowed: PDF, DOC, DOCX, JPG, PNG, TXT.`, 'error');
                            this.value = '';
                            return;
                        }
                    }
                });
            }
        });
        window.hasAttachedDocValidators = true;
    }

    showModal('verifyAccountModal');

    // Fetch existing documents
    const companyId = document.getElementById('company_id').value;
    const companyEmail = document.getElementById('company_email').value;

    fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_documents.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company_id: companyId, email: companyEmail })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data) {
                const docs = data.data;
                // Track existing documents for validation logic
                let existingCount = 0;
                if (docs.philjobnet_path) existingCount++;
                if (docs.dole_path) existingCount++;
                if (docs.bir_path) existingCount++;
                if (docs.mayor_permit_path) existingCount++;

                window.existingDocCount = existingCount; // Store globally/on window for submit check

                // Helper to append file name
                const showFileName = (inputId, fileName) => {
                    if (!fileName) return; // fileName can be null
                    const label = document.querySelector(`label[for="${inputId}"]`);
                    if (label) {
                        let span = label.querySelector('.current-file');
                        if (!span) {
                            span = document.createElement('span');
                            span.className = 'current-file';
                            span.style.color = '#2ecc71';
                            span.style.fontSize = '0.85em';
                            span.style.marginLeft = '10px';
                            label.appendChild(span);
                        }
                        span.innerHTML = `<i class="fa-solid fa-file-check"></i> Current: ${fileName}`;
                    }
                };

                showFileName('docPhilJobNet', docs.philjobnet_path);
                showFileName('docDole', docs.dole_path); // DB column maps to 'dole_path'
                showFileName('docBir', docs.bir_path);
                showFileName('docMayor', docs.mayor_permit_path);
            } else {
                window.existingDocCount = 0; // No data means 0 docs
            }
        })
        .catch(err => {
            console.error("Error fetching docs:", err);
            window.existingDocCount = 0;
        });
}

function closeVerifyAccountModal() {
    closeModal('verifyAccountModal');
}

function submitVerifyDocuments() {
    const doc1 = document.getElementById('docPhilJobNet').files[0];
    const doc2 = document.getElementById('docDole').files[0];
    const doc3 = document.getElementById('docBir').files[0];
    const doc4 = document.getElementById('docMayor').files[0];
    const companyId = document.getElementById('company_id').value;
    const companyEmail = document.getElementById('company_email').value;

    // Optional: Check if at least one file is selected OR if files already exist? 
    // User requirement: "submit 4 documents". Strictly speaking, for initial submit, all 4 might be needed.
    // But for updates, maybe not all? 
    // Let's assume for now we validate that at least one file is being uploaded OR enforce all if it's strictly "first time".
    // The prompt says "submit/change", so likely partial updates allowed or re-uploading all.
    // Let's validate that at least one file is selected to trigger an upload.



    // Validation Logic:
    // 1. If company DOES NOT have all 4 documents existing, they MUST upload ALL 4.
    // 2. If company ALREADY has 4 documents, they can upload AT LEAST 1 to update.

    // Default to 0 if undefined (e.g. fetch failed)
    const existingCount = window.existingDocCount || 0;

    if (existingCount < 4) {
        // Must upload ALL missing or just simply ALL 4 if it's considered "first time / incomplete"
        // Prompt implies: if they don't have "existing documents that been submitted for 4 documents" -> require 4.
        if (!doc1 || !doc2 || !doc3 || !doc4) {
            return ToastSystem.show('You must upload ALL 4 documents to proceed with verification.', 'warning');
        }
    } else {
        // Already has 4 docs, just updating. At least 1 is required.
        if (!doc1 && !doc2 && !doc3 && !doc4) {
            return ToastSystem.show('Please select at least one document to update.', 'warning');
        }
    }

    const formData = new FormData();
    formData.append('company_id', companyId);
    formData.append('email', companyEmail); // Fallback
    if (doc1) formData.append('docPhilJobNet', doc1);
    if (doc2) formData.append('docDole', doc2);
    if (doc3) formData.append('docBir', doc3);
    if (doc4) formData.append('docMayor', doc4);

    const submitBtn = document.querySelector('#verifyAccountModal .btn-save');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/upload_company_documents.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                ToastSystem.show(data.message, 'success');
                closeVerifyAccountModal();
                // Optionally refresh the "verified" status on UI if the logical business rule implies manual verification by admin later.
            } else {
                ToastSystem.show(data.message || "Upload failed", 'error');
                if (data.errors) {
                    console.error("Upload errors:", data.errors);
                }
            }
        })
        .catch(err => {
            console.error("Upload error:", err);
            ToastSystem.show("Network error during upload", 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

function handleImageUpload(fileInput, targetImageId, uploadUrl, type, labelId) {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // Assuming the backend expects 'image' as the file field name
    formData.append('company_id', document.getElementById('company_id').value);
    formData.append('email', document.getElementById('company_email').value); // Fallback

    const targetImage = document.getElementById(targetImageId);
    const label = document.getElementById(labelId);

    // Show Loading State
    const originalLabel = label.innerHTML;
    label.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
    label.style.pointerEvents = 'none';

    fetch(uploadUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Update the image source with a timestamp to force refresh
                const newSrc = data.url + '?t=' + new Date().getTime();
                targetImage.src = newSrc;

                // Sync Header Icon if we just updated the Company Icon
                if (type === 'icon') {
                    // Try to find header avatar in Dashboard/Profile layouts
                    const headerAvatar = document.querySelector('.user-avatar img');
                    if (headerAvatar) {
                        headerAvatar.src = newSrc;
                        // Ensure the default-icon class is removed if it was there
                        headerAvatar.classList.remove('default-icon');
                    }
                    // Also update the hidden input or state if necessary
                }

                if (typeof ToastSystem !== 'undefined') {
                    ToastSystem.show('Image updated successfully!', 'success');
                } else {
                    alert('Image updated successfully!');
                }
            } else {
                if (typeof ToastSystem !== 'undefined') {
                    ToastSystem.show('Upload failed: ' + data.message, 'error');
                } else {
                    alert('Upload failed: ' + data.message);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (typeof ToastSystem !== 'undefined') {
                ToastSystem.show('An error occurred during upload.', 'error');
            } else {
                alert('An error occurred during upload.');
            }
        })
        .finally(() => {
            // Restore Label
            label.innerHTML = originalLabel;
            label.style.pointerEvents = 'auto';
        });
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

// ========== STATISTICS FETCHING ==========

/**
 * Fetches and updates company statistics from the backend
 */
async function fetchCompanyStatistics() {
    try {
        const emailInput = document.getElementById('company_email');
        if (!emailInput) {
            console.warn('Company email input not found.');
            return;
        }

        const companyEmail = emailInput.value;
        if (!companyEmail) return;

        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_statistics.php", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_email: companyEmail })
        });

        const result = await response.json();

        if (result.status === "success") {
            const stats = result.data;

            // Update UI elements if they exist
            const viewTotal = document.getElementById('viewTotalApplicants');
            const viewAccepted = document.getElementById('viewAccepted');
            const viewRejected = document.getElementById('viewRejected');

            if (viewTotal) viewTotal.textContent = stats.totalApplicants;
            if (viewAccepted) viewAccepted.textContent = stats.accepted;
            if (viewRejected) viewRejected.textContent = stats.rejected;
        } else {
            console.error('Failed to fetch statistics:', result.message);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch of statistics
    fetchCompanyStatistics();

    // Sign Out Handler
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/logout.php', {
                    method: 'POST',
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.status === 'success') {
                    window.location.href = '../../../Landing Page/php/landing_page.php';
                }
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '../../../Landing Page/php/landing_page.php';
            }
        });
    }
});
