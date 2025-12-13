// application_form.js - Handle application form step-by-step process

let currentStep = 1;
let applicationData = {
    jobId: null,
    jobInfo: null,
    profileInfo: null,
    resume: null,
    coverLetter: null,
    // Document requirements from job posting
    resumeRequired: true,  // Default to required
    coverLetterRequired: true  // Default to required
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ApplicationForm] Initializing application form');

    // Get job ID from sessionStorage
    applicationData.jobId = sessionStorage.getItem('applicationJobId');
    console.log('[ApplicationForm] Job ID:', applicationData.jobId);

    // Initialize event listeners
    initStepNavigation();
    console.log('[ApplicationForm] Step navigation initialized.');
    initFileUploads();
    console.log('[ApplicationForm] File uploads initialized.');
    initReviewStep();
    console.log('[ApplicationForm] Review step initialized.');
    loadJobInfo();
    console.log('[ApplicationForm] Job info loaded.');
    loadProfileInfo();
});

// Step Navigation
function initStepNavigation() {
    // Next step buttons
    document.querySelectorAll('.btn-next-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = parseInt(btn.dataset.next);
            if (validateCurrentStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    // Previous step buttons
    document.querySelectorAll('.btn-prev-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prevStep = parseInt(btn.dataset.prev);
            goToStep(prevStep);
        });
    });

    // Edit buttons in review step
    document.getElementById('editResumeBtn')?.addEventListener('click', () => {
        goToStep(3);
    });

    document.getElementById('editCoverLetterBtn')?.addEventListener('click', () => {
        goToStep(4);
    });

    // Submit button
    document.getElementById('submitApplicationBtn')?.addEventListener('click', () => {
        submitApplication();
    });
}

function goToStep(step) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');

    // Update progress indicator
    updateProgressIndicator(currentStep, step);

    // Show new step
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Load step-specific data
    if (step === 5) {
        populateReviewStep();
    }
}

function updateProgressIndicator(fromStep, toStep) {
    // Mark completed steps
    for (let i = 1; i < Math.max(fromStep, toStep); i++) {
        const stepEl = document.querySelector(`.progress-step[data-step="${i}"]`);
        if (stepEl && i < toStep) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        }
    }

    // Update active step
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active');
    });

    const activeStepEl = document.querySelector(`.progress-step[data-step="${toStep}"]`);
    if (activeStepEl) {
        activeStepEl.classList.add('active');
        activeStepEl.classList.remove('completed');
    }

    // Update progress lines
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        if (index < toStep - 1) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
}

function validateCurrentStep(step) {
    console.log('[ApplicationForm] Validating step:', step);

    switch (step) {
        case 3: // Resume step
            console.log('[ApplicationForm] Resume required:', applicationData.resumeRequired, 'Resume uploaded:', !!applicationData.resume);
            if (applicationData.resumeRequired && !applicationData.resume) {
                alert('Please upload your resume before continuing.');
                return false;
            }
            return true;
        case 4: // Cover letter step
            console.log('[ApplicationForm] Cover letter required:', applicationData.coverLetterRequired, 'Cover letter uploaded:', !!applicationData.coverLetter);
            if (applicationData.coverLetterRequired && !applicationData.coverLetter) {
                alert('Please upload your cover letter before continuing.');
                return false;
            }
            return true;
        default:
            return true;
    }
}

// File Uploads
function initFileUploads() {
    // Resume upload
    const resumeFileInput = document.getElementById('resumeFile');
    const resumeUploadArea = document.getElementById('resumeUploadArea');
    const resumeUploadLink = document.getElementById('resumeUploadLink');
    const resumeNextBtn = document.getElementById('resumeNextBtn');

    resumeUploadLink?.addEventListener('click', (e) => {
        e.preventDefault();
        resumeFileInput?.click();
    });

    resumeUploadArea?.addEventListener('click', () => {
        resumeFileInput?.click();
    });

    resumeFileInput?.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0], 'resume');
    });

    // Drag and drop for resume
    setupDragAndDrop(resumeUploadArea, resumeFileInput, 'resume');

    // Remove resume
    document.getElementById('removeResume')?.addEventListener('click', () => {
        removeFile('resume');
    });

    // Cover letter upload
    const coverLetterFileInput = document.getElementById('coverLetterFile');
    const coverLetterUploadArea = document.getElementById('coverLetterUploadArea');
    const coverLetterUploadLink = document.getElementById('coverLetterUploadLink');
    const coverLetterNextBtn = document.getElementById('coverLetterNextBtn');

    coverLetterUploadLink?.addEventListener('click', (e) => {
        e.preventDefault();
        coverLetterFileInput?.click();
    });

    coverLetterUploadArea?.addEventListener('click', () => {
        coverLetterFileInput?.click();
    });

    coverLetterFileInput?.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0], 'coverLetter');
    });

    // Drag and drop for cover letter
    setupDragAndDrop(coverLetterUploadArea, coverLetterFileInput, 'coverLetter');

    // Remove cover letter
    document.getElementById('removeCoverLetter')?.addEventListener('click', () => {
        removeFile('coverLetter');
    });
}

function setupDragAndDrop(uploadArea, fileInput, type) {
    if (!uploadArea) return;

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0], type);
        }
    });
}

function handleFileUpload(file, type) {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        return;
    }

    // Store file
    applicationData[type] = file;

    // Display file info
    displayFileInfo(file, type);

    // Enable next button
    const nextBtn = type === 'resume' ? document.getElementById('resumeNextBtn') :
        document.getElementById('coverLetterNextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function displayFileInfo(file, type) {
    const fileInfoEl = document.getElementById(`${type}FileInfo`);
    const fileNameEl = document.getElementById(`${type}FileName`);
    const fileSizeEl = document.getElementById(`${type}FileSize`);
    const uploadArea = document.getElementById(`${type}UploadArea`);

    if (fileInfoEl && fileNameEl && fileSizeEl) {
        fileNameEl.textContent = file.name;
        fileSizeEl.textContent = formatFileSize(file.size);
        fileInfoEl.style.display = 'block';
        if (uploadArea) {
            uploadArea.style.display = 'none';
        }
    }
}

function removeFile(type) {
    applicationData[type] = null;

    const fileInfoEl = document.getElementById(`${type}FileInfo`);
    const uploadArea = document.getElementById(`${type}UploadArea`);
    const fileInput = document.getElementById(`${type}File`);
    const nextBtn = type === 'resume' ? document.getElementById('resumeNextBtn') :
        document.getElementById('coverLetterNextBtn');

    if (fileInfoEl) fileInfoEl.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
    if (fileInput) fileInput.value = '';
    if (nextBtn) nextBtn.disabled = true;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Load Job Information
async function loadJobInfo() {
    const jobId = applicationData.jobId;

    if (!jobId) {
        console.warn('[ApplicationForm] No job ID found');
        return;
    }

    console.log('[ApplicationForm] Loading job information for job ID:', jobId);

    try {
        // Fetch job details from API to get document requirements
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_job_details.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: jobId
            })
        });

        const result = await response.json();
        console.log('[ApplicationForm] Job details API response:', result);

        if (result.status === 'success' && result.data) {
            const jobData = result.data;

            // Store job information
            applicationData.jobInfo = {
                id: jobId,
                title: jobData.title || 'Job Title',
                company: jobData.company_name || 'Company Name',
                location: `${jobData.city || ''}, ${jobData.province || ''}`.trim() || 'Location',
                workType: jobData.work_type || 'Full Time',
                category: jobData.category || 'Category'
            };

            // Set document requirements (1 = required, 0 = optional)
            applicationData.resumeRequired = jobData.resume === 1 || jobData.resume === '1' || jobData.resume === true;
            applicationData.coverLetterRequired = jobData.cover_letter === 1 || jobData.cover_letter === '1' || jobData.cover_letter === true;

            console.log('[ApplicationForm] Document requirements - Resume:', applicationData.resumeRequired, 'Cover Letter:', applicationData.coverLetterRequired);

            // Update UI to reflect requirements
            updateDocumentRequirementsUI();

            return;
        }
    } catch (error) {
        console.error('[ApplicationForm] Error loading job details:', error);
    }

    // Fallback: Try sessionStorage
    const jobDataStr = sessionStorage.getItem('applicationJobData');
    if (jobDataStr) {
        try {
            const jobData = JSON.parse(jobDataStr);
            applicationData.jobInfo = {
                id: jobId,
                title: jobData.title || 'Job Title',
                company: jobData.company_name || 'Company Name',
                location: `${jobData.city || ''}, ${jobData.city || ''}, ${jobData.province || ''}`.trim() || 'Location',
                workType: jobData.work_type || 'Full Time',
                category: jobData.category || 'Category'
            };

            // Try to get requirements from sessionStorage data
            if ('resume' in jobData) {
                applicationData.resumeRequired = jobData.resume === 1 || jobData.resume === '1' || jobData.resume === true;
            }
            if ('cover_letter' in jobData) {
                applicationData.coverLetterRequired = jobData.cover_letter === 1 || jobData.cover_letter === '1' || jobData.cover_letter === true;
            }

            console.log('[ApplicationForm] Using sessionStorage job data');
            console.log('[ApplicationForm] Document requirements - Resume:', applicationData.resumeRequired, 'Cover Letter:', applicationData.coverLetterRequired);

            updateDocumentRequirementsUI();
            return;
        } catch (e) {
            console.error('[ApplicationForm] Error parsing job data from sessionStorage:', e);
        }
    }

    // Default fallback
    console.warn('[ApplicationForm] Using default job data and requirements');
    applicationData.jobInfo = {
        id: jobId,
        title: 'Job Title',
        company: 'Company Name',
        location: 'City, Province',
        workType: 'Full Time',
        category: 'Category'
    };
}

// Update UI to show required/optional status for documents
function updateDocumentRequirementsUI() {
    console.log('[ApplicationForm] Updating document requirements UI');

    // Update resume step
    const resumeStepDesc = document.querySelector('#step-3 .step-description');
    if (resumeStepDesc) {
        const maxSize = '10MB'; // Updated from 5MB to match API
        if (applicationData.resumeRequired) {
            resumeStepDesc.textContent = `Please upload your resume in PDF format. Maximum file size: ${maxSize}`;
        } else {
            resumeStepDesc.textContent = `Upload your resume (Optional). PDF format. Maximum file size: ${maxSize}`;
        }
    }

    // Update cover letter step  
    const coverLetterStepDesc = document.querySelector('#step-4 .step-description');
    if (coverLetterStepDesc) {
        const maxSize = '10MB'; // Updated from 5MB to match API
        if (applicationData.coverLetterRequired) {
            coverLetterStepDesc.textContent = `Please upload your cover letter in PDF format. Maximum file size: ${maxSize}`;
        } else {
            coverLetterStepDesc.textContent = `Upload your cover letter (Optional). PDF format. Maximum file size: ${maxSize}`;
        }
    }

    // Enable next button for optional documents if no file uploaded
    const resumeNextBtn = document.getElementById('resumeNextBtn');
    if (resumeNextBtn && !applicationData.resumeRequired) {
        resumeNextBtn.disabled = false;
        console.log('[ApplicationForm] Resume is optional, next button enabled');
    }

    const coverLetterNextBtn = document.getElementById('coverLetterNextBtn');
    if (coverLetterNextBtn && !applicationData.coverLetterRequired) {
        coverLetterNextBtn.disabled = false;
        console.log('[ApplicationForm] Cover letter is optional, next button enabled');
    }
}


// Load Profile Information
async function loadProfileInfo() {
    const email = sessionStorage.getItem('email');

    if (!email) {
        console.warn('[ApplicationForm] No email found in session');
        return;
    }

    try {
        // TODO: Replace with actual API endpoint
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_email: email
            })
        });

        const result = await response.json();

        if (result.status === 'success' && result.data) {
            const basic = result.data.basic_info || {};
            const profile = result.data.profile || {};

            applicationData.profileInfo = {
                name: `${basic.first_name || ''} ${basic.middle_initial || ''} ${basic.last_name || ''} ${basic.suffix || ''}`.trim(),
                email: basic.student_email || email,
                personalEmail: basic.personal_email || 'Not provided',
                phone: basic.phone_number || 'Not provided',
                location: profile.location || 'Not provided',
                about: profile.about_me || 'Not provided'
            };

            // Populate profile preview in step 2
            populateProfilePreview();
        }
    } catch (error) {
        console.error('[ApplicationForm] Error loading profile:', error);
    }
}

function populateProfilePreview() {
    const previewEl = document.getElementById('profilePreview');
    if (!previewEl || !applicationData.profileInfo) return;

    const profile = applicationData.profileInfo;

    previewEl.innerHTML = `
        <div class="profile-field">
            <span class="profile-field-label">Full Name</span>
            <span class="profile-field-value">${profile.name || 'Not provided'}</span>
        </div>
        <div class="profile-field">
            <span class="profile-field-label">Email</span>
            <span class="profile-field-value">${profile.email || 'Not provided'}</span>
        </div>
        <div class="profile-field">
            <span class="profile-field-label">Personal Email</span>
            <span class="profile-field-value">${profile.personalEmail || 'Not provided'}</span>
        </div>
        <div class="profile-field">
            <span class="profile-field-label">Phone Number</span>
            <span class="profile-field-value">${profile.phone || 'Not provided'}</span>
        </div>
        <div class="profile-field">
            <span class="profile-field-label">Location</span>
            <span class="profile-field-value">${profile.location || 'Not provided'}</span>
        </div>
    `;
}

// Review Step
function initReviewStep() {
    // This will be populated when step 5 is reached
}

function populateReviewStep() {
    // Populate job info
    const jobInfoEl = document.getElementById('jobInfoReview');
    if (jobInfoEl && applicationData.jobInfo) {
        const job = applicationData.jobInfo;
        jobInfoEl.innerHTML = `
            <div class="review-item">
                <span class="review-item-label">Job Title</span>
                <span class="review-item-value">${job.title || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Company</span>
                <span class="review-item-value">${job.company || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Location</span>
                <span class="review-item-value">${job.location || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Work Type</span>
                <span class="review-item-value">${job.workType || 'N/A'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Category</span>
                <span class="review-item-value">${job.category || 'N/A'}</span>
            </div>
        `;
    }

    // Populate profile info
    const profileInfoEl = document.getElementById('profileInfoReview');
    if (profileInfoEl && applicationData.profileInfo) {
        const profile = applicationData.profileInfo;
        profileInfoEl.innerHTML = `
            <div class="review-item">
                <span class="review-item-label">Full Name</span>
                <span class="review-item-value">${profile.name || 'Not provided'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Email</span>
                <span class="review-item-value">${profile.email || 'Not provided'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Phone Number</span>
                <span class="review-item-value">${profile.phone || 'Not provided'}</span>
            </div>
            <div class="review-item">
                <span class="review-item-label">Location</span>
                <span class="review-item-value">${profile.location || 'Not provided'}</span>
            </div>
        `;
    }

    // Populate resume info
    const resumeReviewEl = document.getElementById('resumeReview');
    if (resumeReviewEl && applicationData.resume) {
        resumeReviewEl.innerHTML = `
            <div class="review-file-item">
                <i class="fa-solid fa-file-pdf file-icon"></i>
                <div class="file-details">
                    <span class="file-name">${applicationData.resume.name}</span>
                    <span class="file-size">${formatFileSize(applicationData.resume.size)}</span>
                </div>
            </div>
        `;
    }

    // Populate cover letter info
    const coverLetterReviewEl = document.getElementById('coverLetterReview');
    if (coverLetterReviewEl && applicationData.coverLetter) {
        coverLetterReviewEl.innerHTML = `
            <div class="review-file-item">
                <i class="fa-solid fa-file-pdf file-icon"></i>
                <div class="file-details">
                    <span class="file-name">${applicationData.coverLetter.name}</span>
                    <span class="file-size">${formatFileSize(applicationData.coverLetter.size)}</span>
                </div>
            </div>
        `;
    }
}

// Submit Application
async function submitApplication() {
    console.log('[ApplicationForm] Submit application called');
    console.log('[ApplicationForm] Current application data:', {
        jobId: applicationData.jobId,
        resumeRequired: applicationData.resumeRequired,
        coverLetterRequired: applicationData.coverLetterRequired,
        hasResume: !!applicationData.resume,
        hasCoverLetter: !!applicationData.coverLetter
    });

    // Validate required fields based on job requirements
    if (applicationData.resumeRequired && !applicationData.resume) {
        alert('Please upload your resume.');
        console.error('[ApplicationForm] Resume is required but not uploaded');
        return;
    }

    if (applicationData.coverLetterRequired && !applicationData.coverLetter) {
        alert('Please upload your cover letter.');
        console.error('[ApplicationForm] Cover letter is required but not uploaded');
        return;
    }

    if (!applicationData.jobId) {
        alert('Job information is missing. Please go back and try again.');
        console.error('[ApplicationForm] Job ID is missing');
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitApplicationBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    try {
        // Step 1: Get student_id from email
        const email = sessionStorage.getItem('email');
        if (!email) {
            throw new Error('Email not found in session. Please log in again.');
        }

        console.log('[ApplicationForm] Fetching student information for email:', email);

        // Fetch student information to get student_id
        const profileResponse = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_email: email
            })
        });

        const profileResult = await profileResponse.json();
        console.log('[ApplicationForm] Profile API response:', profileResult);

        if (profileResult.status !== 'success' || !profileResult.data || !profileResult.data.basic_info) {
            throw new Error('Failed to retrieve student information.');
        }

        const studentId = profileResult.data.basic_info.student_id;

        if (!studentId) {
            throw new Error('Student ID not found.');
        }

        console.log('[ApplicationForm] Student ID:', studentId);

        // Step 2: Prepare form data for application submission
        const formData = new FormData();
        formData.append('post_id', applicationData.jobId);
        formData.append('student_id', studentId);
        formData.append('document_type', 'Standard Application');

        // Only append files if they exist
        if (applicationData.resume) {
            formData.append('resume', applicationData.resume);
            console.log('[ApplicationForm] Resume attached:', applicationData.resume.name);
        } else {
            console.log('[ApplicationForm] No resume attached (optional)');
        }

        if (applicationData.coverLetter) {
            formData.append('cover_letter', applicationData.coverLetter);
            console.log('[ApplicationForm] Cover letter attached:', applicationData.coverLetter.name);
        } else {
            console.log('[ApplicationForm] No cover letter attached (optional)');
        }

        console.log('[ApplicationForm] Calling submit_application API...');

        // Step 3: Submit application to API
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/submit_application.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log('[ApplicationForm] Application submitted successfully:', result.data);

            // Store application details for reference
            sessionStorage.setItem('lastApplicationId', result.data.applicant_id);
            sessionStorage.setItem('lastApplicationDate', new Date().toISOString());

            // Move to completion step
            goToStep(6);
        } else {
            // Handle error from API
            throw new Error(result.message || 'Failed to submit application.');
        }

    } catch (error) {
        console.error('[ApplicationForm] Error submitting application:', error);
        alert('Failed to submit application: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

