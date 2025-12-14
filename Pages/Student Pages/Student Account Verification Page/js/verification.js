// verification.js

document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentStep = 1;
    let studentType = null; // 'graduate' or 'undergraduate'
    const totalSteps = 4;

    // Elements
    const steps = document.querySelectorAll('.verification-step');
    const nextBtns = document.querySelectorAll('.btn-next-step');
    const backBtns = document.querySelectorAll('.btn-back-step');
    const typeCards = document.querySelectorAll('.type-card');
    const submitBtn = document.getElementById('submitVerificationBtn');

    // File Inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');

    // Student ID
    const studentIdInput = document.getElementById('studentId');
    const studentId = studentIdInput ? studentIdInput.value : '';

    // --- Navigation Logic ---

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        document.querySelector(`.verification-step[data-step="${stepNumber}"]`).classList.add('active');
        currentStep = stepNumber;
        updateButtons();
    }

    function updateButtons() {
        // Step 2 Validation (Type Selection)
        if (currentStep === 2) {
            const nextBtn = document.querySelector('.step-2-next');
            if (nextBtn) nextBtn.disabled = !studentType;
        }
        // Step 3 Validation (File Uploads)
        if (currentStep === 3) {
            validateUploads();
        }
    }

    // --- Event Listeners ---

    // Next / Back Buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            if (nextStep === 3) {
                setupUploadStep();
            }
            showStep(nextStep);
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            showStep(prevStep);
        });
    });

    // Type Selection (Step 2)
    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            typeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            studentType = card.dataset.type;
            updateButtons();
        });
    });

    // File Upload Handling
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const area = input.closest('.upload-area');
            const nameDisplay = area.querySelector('.file-name-display');
            const uploadText = area.querySelector('.upload-text');

            if (file) {
                area.classList.add('has-file');
                nameDisplay.textContent = `Selected: ${file.name}`;
                uploadText.style.display = 'none';
            } else {
                area.classList.remove('has-file');
                nameDisplay.textContent = '';
                uploadText.style.display = 'block';
            }

            updateButtons();
        });
    });

    // --- Specific Logic ---

    function setupUploadStep() {
        const gradSection = document.getElementById('graduate-uploads');
        const undergradSection = document.getElementById('undergraduate-uploads');

        if (studentType === 'graduate') {
            gradSection.style.display = 'block';
            undergradSection.style.display = 'none';
        } else {
            gradSection.style.display = 'none';
            undergradSection.style.display = 'block';
        }
    }

    function validateUploads() {
        const nextBtn = document.querySelector('.step-3-next');
        let isValid = false;

        if (studentType === 'graduate') {
            const tor = document.getElementById('torFile').files.length > 0;
            const diploma = document.getElementById('diplomaFile').files.length > 0;
            isValid = tor || diploma;
        } else if (studentType === 'undergraduate') {
            const id = document.getElementById('idFile').files.length > 0;
            const cor = document.getElementById('corFile').files.length > 0;
            isValid = id && cor;
        }

        if (nextBtn) nextBtn.disabled = !isValid;
        if (submitBtn) submitBtn.disabled = !isValid;
    }

    // Submit Logic
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            if (!studentId) {
                alert("Error: Student ID not found. Please relogin.");
                return;
            }

            // UI Loading State
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Prepare Data
            const formData = new FormData();
            formData.append('student_id', studentId);
            formData.append('student_type', studentType); // 'graduate' or 'undergraduate' (lowercase match with API)

            if (studentType === 'graduate') {
                const torFile = document.getElementById('torFile').files[0];
                const diplomaFile = document.getElementById('diplomaFile').files[0];
                if (torFile) formData.append('tor_file', torFile);
                if (diplomaFile) formData.append('diploma_file', diplomaFile);
            } else {
                const idFile = document.getElementById('idFile').files[0];
                const corFile = document.getElementById('corFile').files[0];
                if (idFile) formData.append('student_id_file', idFile); // API expects student_id_file
                if (corFile) formData.append('cor_file', corFile);
            }

            try {
                const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/upload_verification_docs.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.status === 'success') {
                    showStep(4); // Success Step
                } else {
                    alert('Submission Failed: ' + (result.message || 'Unknown error'));
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('An error occurred while submitting your documents. Please try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
