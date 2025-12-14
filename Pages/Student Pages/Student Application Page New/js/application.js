/**
 * Application Page Logic
 * Handles the interactive application process for students.
 */

// State Management
const appState = {
    currentStep: 1,
    jobId: null,
    studentEmail: typeof USER_EMAIL !== 'undefined' ? USER_EMAIL : null,
    jobDetails: {},
    studentDetails: {},
    files: {
        resume: null,
        coverLetter: null
    },
    // Requirements (Fetched from API)
    requirements: {
        resume: true,        // Default to true for safety until loaded
        coverLetter: false
    }
};

// --- Modal Logic ---

const modalState = {
    onConfirm: null
};

function initModal() {
    const modal = document.getElementById('appModal');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const overlay = document.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.classList.remove('active');
        modalState.onConfirm = null;
    };

    [cancelBtn, overlay].forEach(el => el?.addEventListener('click', closeModal));

    confirmBtn?.addEventListener('click', () => {
        if (modalState.onConfirm) modalState.onConfirm();
        closeModal();
    });
}

function showModal(title, message, type = 'info', onConfirm = null) {
    const modal = document.getElementById('appModal');
    const titleEl = document.getElementById('modalTitle');
    const msgEl = document.getElementById('modalMessage');
    const iconEl = document.getElementById('modalIcon');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const confirmBtn = document.getElementById('modalConfirmBtn');

    titleEl.textContent = title;
    msgEl.innerHTML = message; // Allow HTML in message

    // Config based on type
    if (type === 'confirm') {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-question"></i>';
        iconEl.style.color = 'var(--primary-maroon)';
        iconEl.style.backgroundColor = '#eef2ff';
        cancelBtn.style.display = 'block';
        confirmBtn.textContent = 'Confirm';
        modalState.onConfirm = onConfirm;
    } else if (type === 'error') {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
        iconEl.style.color = '#dc2626';
        iconEl.style.backgroundColor = '#fef2f2';
        cancelBtn.style.display = 'none';
        confirmBtn.textContent = 'OK';
        modalState.onConfirm = onConfirm; // Can define action on OK too
    } else { // info/success
        iconEl.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
        iconEl.style.color = 'var(--primary-maroon)';
        iconEl.style.backgroundColor = '#eef2ff';
        cancelBtn.style.display = 'none';
        confirmBtn.textContent = 'OK';
        modalState.onConfirm = onConfirm;
    }

    modal.classList.add('active');
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', async () => {
    console.log("[Application Debug] App initialized");

    initModal(); // Init modal listeners

    // 1. Get Job ID from URL or Session
    const urlParams = new URLSearchParams(window.location.search);
    appState.jobId = urlParams.get('job_id') || sessionStorage.getItem('applicationJobId');

    if (!appState.jobId) {
        showModal("Error", "No Job ID found. Redirecting to search.", "error", () => {
            window.location.href = '../../Student Internship Search Page New/php/internship_search.php';
        });
        return;
    }

    console.log(`[Application Debug] Job ID: ${appState.jobId}`);

    // 2. Load Data
    await Promise.all([
        fetchJobDetails(appState.jobId),
        fetchStudentProfile(appState.studentEmail)
    ]);

    // 3. Initialize UI
    initNavigation();
    initFileUploads();
    updateUI();
});

// --- API Calls ---

async function fetchJobDetails(id) {
    try {
        console.log(`[Application Debug] Fetching details for Job ${id}...`);
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_job_details.php', {
            method: 'POST',
            body: JSON.stringify({ job_id: id })
        });
        const result = await response.json();

        if (result.status === 'success') {
            appState.jobDetails = result.data;
            // Update Requirements from DB
            appState.requirements.resume = result.data.resume === true;
            appState.requirements.coverLetter = result.data.coverLetter === true;

            console.log("[Application Debug] Job Details Loaded:", appState.jobDetails);
            console.log("[Application Debug] Requirements:", appState.requirements);
        } else {
            console.error("[Application Debug] Failed to fetch job details:", result.message);
        }
    } catch (e) {
        console.error("[Application Debug] Error fetching job details:", e);
    }
}

async function fetchStudentProfile(email) {
    if (!email) return;
    try {
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            body: JSON.stringify({ student_email: email })
        });
        const result = await response.json();

        if (result.status === 'success') {
            appState.studentDetails = result.data;
            console.log("[Application Debug] Student Profile Loaded");
        }
    } catch (e) {
        console.error("[Application Debug] Error fetching student profile:", e);
    }
}

// --- UI Logic ---

function updateUI() {
    // Header Info
    const titleEl = document.getElementById('jobTitleDisplay');
    const companyEl = document.getElementById('companyNameDisplay');

    if (appState.jobDetails.jobTitle) {
        titleEl.textContent = appState.jobDetails.jobTitle;
        companyEl.textContent = appState.jobDetails.companyName;
    }

    // Profile Preview
    const profileContainer = document.getElementById('profilePreview');
    if (appState.studentDetails.basic_info) {
        const basic = appState.studentDetails.basic_info;
        const profile = appState.studentDetails.profile || {};

        profileContainer.innerHTML = `
            <div class="profile-field">
                <span class="profile-label">Full Name</span>
                <span class="profile-value">${basic.first_name} ${basic.last_name}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Email</span>
                <span class="profile-value">${basic.student_email}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Phone</span>
                <span class="profile-value">${basic.phone_number || 'N/A'}</span>
            </div>
             <div class="profile-field">
                <span class="profile-label">Location</span>
                <span class="profile-value">${profile.location || 'N/A'}</span>
            </div>
        `;
    }

    // Dynamic Requirement Text
    const resumeText = document.getElementById('resumeRequirementText');
    resumeText.textContent = appState.requirements.resume
        ? "Please upload your resume (PDF/DOCX). *Required"
        : "Upload your resume (Optional).";

    const clText = document.getElementById('coverLetterRequirementText');
    clText.textContent = appState.requirements.coverLetter
        ? "Add a cover letter to stand out. *Required"
        : "Add a cover letter (Optional).";
}

function initNavigation() {
    // Next Buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            if (validateStep(appState.currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    // Prev Buttons
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            goToStep(prevStep);
        });
    });

    // Sidebar Cancel
    document.getElementById('cancelAppBtn').addEventListener('click', () => {
        showModal("Cancel Application?", "Are you sure you want to cancel? Any unsaved progress will be lost.", "confirm", () => {
            window.location.href = '../../Student Internship Search Page New/php/internship_search.php';
        });
    });

    // Submit Button
    document.getElementById('submitAppBtn').addEventListener('click', submitApplication);
}

function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.app-step').forEach(el => el.classList.remove('active'));
    // Show target step
    document.getElementById(`step-${stepNumber}`).classList.add('active');

    // Update Sidebar
    document.querySelectorAll('.progress-step').forEach(el => {
        el.classList.remove('active');
        const s = parseInt(el.dataset.step);
        if (s === stepNumber) el.classList.add('active');
        if (s < stepNumber) el.classList.add('completed');
        else el.classList.remove('completed');
    });

    appState.currentStep = stepNumber;

    // Final Review Population
    if (stepNumber === 5) populateReview();
}

function validateStep(step) {
    if (step === 3) { // Resume Step
        if (appState.requirements.resume && !appState.files.resume) {
            showModal("Required Document", "Please upload your <strong>Resume</strong> to proceed.", "error");
            return false;
        }
    }
    if (step === 4) { // Cover Letter
        if (appState.requirements.coverLetter && !appState.files.coverLetter) {
            showModal("Required Document", "Please upload your <strong>Cover Letter</strong> to proceed.", "error");
            return false;
        }
    }
    return true;
}

// --- File Handling ---

function initFileUploads() {
    setupUploadZone('resume');
    setupUploadZone('coverLetter'); // Using internal ID logic mapping
}

function setupUploadZone(type) {
    // Map 'coverLetter' to DOM IDs which use 'cl' or 'coverLetter'
    const idPrefix = type === 'coverLetter' ? 'cl' : 'resume';
    const fileInputId = type === 'coverLetter' ? 'coverLetterFile' : 'resumeFile';

    const dropZone = document.getElementById(`${idPrefix}UploadZone`);
    const fileInput = document.getElementById(fileInputId);

    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-maroon)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        handleFiles(e.dataTransfer.files, type);
    });

    // Input Change
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files, type));

    // Remove Button
    document.getElementById(`remove${type === 'coverLetter' ? 'Cl' : 'Resume'}`).addEventListener('click', () => {
        appState.files[type] = null;
        fileInput.value = '';
        updateFilePreview(type);
    });
}

function handleFiles(files, type) {
    if (files.length === 0) return;
    const file = files[0];

    // Basic Validation
    if (file.size > 10 * 1024 * 1024) { // 10MB
        showModal("File Too Large", "The selected file exceeds the 10MB limit. Please choose a smaller file.", "error");
        return;
    }

    appState.files[type] = file;
    console.log(`[Application Debug] File selected for ${type}:`, file.name);
    updateFilePreview(type);
}

function updateFilePreview(type) {
    const idPrefix = type === 'coverLetter' ? 'cl' : 'resume';
    const zone = document.getElementById(`${idPrefix}UploadZone`);
    const preview = document.getElementById(`${idPrefix}Preview`);
    const nameEl = document.getElementById(`${idPrefix}Name`);
    const sizeEl = document.getElementById(`${idPrefix}Size`);

    if (appState.files[type]) {
        zone.style.display = 'none';
        preview.style.display = 'flex';
        nameEl.textContent = appState.files[type].name;
        sizeEl.textContent = (appState.files[type].size / 1024).toFixed(1) + ' KB';
    } else {
        zone.style.display = 'block';
        preview.style.display = 'none';
    }
}

function populateReview() {
    const detailsContainer = document.getElementById('reviewJobDetails');
    detailsContainer.innerHTML = `
        <div class="review-card">
            <h3>Position Details</h3>
            <div class="review-grid">
                <div class="review-item">
                    <span class="review-label">Position</span>
                    <span class="review-value">${appState.jobDetails.jobTitle}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Company</span>
                    <span class="review-value">${appState.jobDetails.companyName}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Location</span>
                    <span class="review-value">${appState.jobDetails.city}, ${appState.jobDetails.province}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Work Type</span>
                    <span class="review-value">${appState.jobDetails.workType}</span>
                </div>
            </div>
        </div>
    `;

    const docsContainer = document.getElementById('reviewDocuments');

    // Helper to generate file card HTML
    const getFileCard = (type, file, required) => {
        const icon = type === 'resume' ? 'fa-file-pdf' : 'fa-file-lines';
        const label = type === 'resume' ? 'Resume' : 'Cover Letter';

        let statusClass = 'missing';
        let statusText = required ? 'Missing (Required)' : 'Not provided (Optional)';
        let fileName = 'No file selected';

        if (file) {
            statusClass = 'attached';
            statusText = 'Ready for submission';
            fileName = file.name;
        }

        return `
            <div class="doc-review-card">
                <div class="doc-review-icon">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="doc-review-info">
                    <span class="doc-review-name">${label}: ${fileName}</span>
                    <span class="doc-review-status ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    };

    docsContainer.innerHTML = `
        <div class="review-card">
            <h3>Attached Documents</h3>
            <div class="review-documents-list">
                ${getFileCard('resume', appState.files.resume, appState.requirements.resume)}
                ${getFileCard('coverLetter', appState.files.coverLetter, appState.requirements.coverLetter)}
            </div>
        </div>
    `;
}

// --- Submission ---

async function submitApplication() {
    const btn = document.getElementById('submitAppBtn');
    const originalText = btn.innerHTML; // Save text
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    console.log("[Application Debug] Submitting application...");
    console.log("[Application Debug] Student ID Check:", appState.studentDetails?.basic_info?.student_id);
    console.log("[Application Debug] Job ID Check:", appState.jobId);

    const formData = new FormData();
    formData.append('post_id', appState.jobId);

    // Safety check for student ID
    if (appState.studentDetails?.basic_info?.student_id) {
        formData.append('student_id', appState.studentDetails.basic_info.student_id);
    } else {
        console.error("[Application Debug] MISSING STUDENT ID in State!");
    }

    formData.append('document_type', 'Standard Application'); // Default type

    if (appState.files.resume) {
        formData.append('resume', appState.files.resume);
    }
    if (appState.files.coverLetter) {
        formData.append('cover_letter', appState.files.coverLetter);
    }

    // Debug FormData content
    for (var pair of formData.entries()) {
        console.log(`[Application Debug] Form Data: ${pair[0]} = ${pair[1]}`);
    }

    try {
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/submit_application.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        console.log("[Application Debug] Submit Result:", result);

        if (result.status === 'success') {
            goToStep(6); // Success Step
        } else {
            showModal("Application Failed", result.message, "error");
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (e) {
        console.error("[Application Debug] Submit Error:", e);
        showModal("System Error", "An error occurred while submitting your application. Please try again later.", "error");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
