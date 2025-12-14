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
            // Remove active from others
            typeCards.forEach(c => c.classList.remove('selected'));
            // Add to current
            card.classList.add('selected');
            studentType = card.dataset.type;

            // Enable Next Button
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
            isValid = tor && diploma;
        } else if (studentType === 'undergraduate') {
            const id = document.getElementById('idFile').files.length > 0;
            const cor = document.getElementById('corFile').files.length > 0;
            isValid = id && cor;
        }

        if (nextBtn) nextBtn.disabled = !isValid;

        // Also enable submit button if we treat Step 4 as just success
        // But actually the Submit button is ON Step 3 in this flow or Step 4?
        // Let's assume Submit is clicked after Uploads.
        if (submitBtn) submitBtn.disabled = !isValid;
    }

    // Submit Logic
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            // Simulate API Call
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Mock delay
            setTimeout(() => {
                showStep(4); // Success Step
            }, 1500);
        });
    }
});
