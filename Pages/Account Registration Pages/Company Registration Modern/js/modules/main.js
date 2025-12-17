// Main Initialization Script (Debug Mode)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main.js: DOMContentLoaded fired");

    // --- 1. DOM Elements & Listeners Setup (Immediate) ---

    const signUp_Inputs = document.querySelectorAll('.sign-in-container input');
    const form = document.querySelector('#signUp-Form');
    const title = document.querySelector('#title');
    const firstInputs = document.querySelectorAll('#firstInputs input');
    const firstInputs_Container = document.querySelector('#firstInputs');
    const first_nextBtn = document.querySelector('#first_nextBtn');

    const secondInputs_Container = document.querySelector('#secondInputs');
    const secondInputs = document.querySelectorAll('#secondInputs input');

    // Toggle Buttons
    const signIn_Btn = document.getElementById('toggle-signIn-Btn');
    const signUp_Btn = document.getElementById('toggle-signUp-Btn');
    const suggestionsContainer = document.querySelectorAll('.suggestions');

    console.log("Buttons Found:", { signIn: !!signIn_Btn, signUp: !!signUp_Btn });

    // Sign In Inputs Listeners (Login)
    signUp_Inputs.forEach(input => {
        input.addEventListener('focus', () => removeError(input));
        input.addEventListener('input', () => removeError(input));
        input.addEventListener('blur', () => {
            if (!checkIfEmpty_General(input)) {
                showError(input, `${input.name} cannot be empty.`);
            }
        });
    });

    // Sign Up - Step 1 Inputs Listeners
    firstInputs.forEach(input => {
        input.addEventListener('blur', async () => {
            initialFirstInputs_Validations(input);
            if (input.name === "Password" && input.dataset.strength == "weak") {
                showError(input, `${input.name}'s strength must be atleast medium.`);
            }
        });
        input.addEventListener('focus', () => removeError(input));
        input.addEventListener('input', async () => {
            if (input.name == "Password") {
                const confirmPass_field = document.querySelector('#confirmPass-input');
                if (input.value.trim().length >= 12) {
                    if (confirmPass_field.value.trim()) confirmPassword(confirmPass_field);
                    checkPassword(input);
                } else {
                    removeError(confirmPass_field);
                    removeError(input);
                }
            } else if (input.name == "Confirm Password") {
                confirmPassword(input);
            } else {
                removeError(input);
            }
        });
    });

    // Sign Up - Step 2 Inputs Listeners (Company Details)
    secondInputs.forEach(input => {
        let list = [];
        input.addEventListener('focus', (e) => {
            switch (input.name) {
                case 'Company Type':
                    list = companyTypes; // Depends on loaded data
                    break;
                case 'Industry':
                    list = industries; // Depends on loaded data
                    break;
            }
            if (list.length > 0) {
                suggestionsContainer.forEach(container => container.classList.remove('active'));
                LoadList(e.target, list);
            }
        });

        input.addEventListener('blur', async () => {
            validateSecondInputs(input);
        });

        input.addEventListener('input', async (e) => {
            removeError(input);
            let list = [];
            switch (input.name) {
                case 'Company Type':
                    list = companyTypes;
                    break;
                case 'Industry':
                    list = industries;
                    break;
            }

            if (list.length > 0) {
                LoadList(e.target, list);
            } else {
                validateSecondInputs(input);
            }
        });
    });

    // Animation End Listeners
    if (firstInputs_Container) {
        firstInputs_Container.addEventListener('animationend', e => {
            if (e.animationName == 'slideRight') {
                firstInputs_Container.classList.remove('slide-right');
                firstInputs_Container.style.display = 'none';
                secondInputs_Container.style.display = 'flex';
                secondInputs_Container.classList.add('slide-left');
                secondInputs_Container.classList.add('form-section');
                title.textContent = 'Brief Background';
            }
        });
    }

    if (secondInputs_Container) {
        secondInputs_Container.addEventListener('animationend', e => {
            if (e.animationName == 'slideRight' && secondInputs_Container.style.display !== 'none') {
                // This event triggers when sliding OUT to the right (going back to step 1)
                secondInputs_Container.classList.remove('slide-right');
                secondInputs_Container.style.display = 'none';
                firstInputs_Container.style.display = 'flex';
                firstInputs_Container.classList.add('slide-left');
                firstInputs_Container.classList.add('form-section');
                title.textContent = 'Company Profile';
            }
        });
    }


    // Toggle Panel Buttons
    if (signUp_Btn) {
        signUp_Btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Sign Up Button Clicked");
            panelSwap();
        });
    } else {
        console.error("SignUp Button NOT found in DOM");
    }

    if (signIn_Btn) {
        signIn_Btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Sign In Button Clicked");
            panelSwap();
        });
    } else {
        console.error("SignIn Button NOT found in DOM");
    }

    // Global Click Listener for Suggestions closing
    document.addEventListener('click', (e) => {
        if (e.target.closest('#toggle-signUp-Btn') || e.target.closest('#toggle-signIn-Btn')) return; // Ignore toggle buttons
        if (!e.target.closest('.input-wrapper') && !e.target.closest('button')) {
            suggestionsContainer.forEach(c => c.classList.remove('active'));
        }
    });

    // Modal Listeners
    document.addEventListener('click', (e) => {
        const modal = document.querySelector('#otpModalOverlay');
        if (e.target === modal) closeOTPModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('#otpModalOverlay');
            if (modal && modal.style.display === 'flex') closeOTPModal();
        }
    });

    // Initialize Email Edit Listeners (from otp.js/utils.js helper if any)
    if (typeof setupEmailEditListeners === 'function') setupEmailEditListeners();

    // --- 2. Load Data (Async, non-blocking) ---
    loadCompanyTypesAndIndustries().then(() => {
        console.log("Dropdown data loaded");
    }).catch(err => {
        console.warn("Dropdown data load issue (may be handled in api.js)", err);
    });

});

// Helper for suggestions loading
function LoadList(input, list) {
    const value = input.value.trim().toLowerCase();

    if (value === '') {
        LoadSuggestions(input, list);
    } else {
        const filteredList = list.filter(item => item.toLowerCase().includes(value));
        LoadSuggestions(input, filteredList);
    }
}

function LoadSuggestions(input, list) {
    const suggestionsContainer = input.nextElementSibling;
    if (!suggestionsContainer || !suggestionsContainer.classList.contains('suggestions')) return;

    suggestionsContainer.innerHTML = '';

    if (list.length === 0 || !list) {
        suggestionsContainer.classList.remove('active');
    } else {
        list.forEach(item => {
            const itemObj = document.createElement('div');
            itemObj.className = 'suggestion-item';
            itemObj.textContent = item;

            itemObj.addEventListener('click', async () => {
                input.value = item;
                suggestionsContainer.classList.remove('active');
                removeError(input);
                userInformation[input.name] = item;
            });

            suggestionsContainer.append(itemObj);
        });
        suggestionsContainer.classList.add('active');
    }
}

// Navigation Functions
async function goNext(button) {
    console.log("goNext Triggered");
    try {
        if (await firstInputsValidation()) {
            console.log("Validation Passed");

            // Check if company email is verified
            if (!emailVerificationState.companyEmail) {
                console.warn("Email not verified");
                const emailInput = document.querySelector('#email-input');
                showError(emailInput, 'Please verify your email address');
                if (typeof ToastSystem !== 'undefined') ToastSystem.show("Please verify your email first", "error");
                return;
            }

            const firstInputs_Container = document.querySelector('#firstInputs');
            firstInputs_Container.classList.remove('slide-left');
            firstInputs_Container.classList.add('slide-right');

            manageSteps('next');
        } else {
            console.warn("Validation Failed (goNext)");
            if (typeof ToastSystem !== 'undefined') ToastSystem.show("Please correct the highlighted fields.", "error");
        }
    } catch (err) {
        console.error("goNext Critical Error:", err);
        if (typeof ToastSystem !== 'undefined') ToastSystem.show("An internal error occurred. Check console.", "error");
    }
}

function goToPreviousSection(button) {
    const secondInputs_Container = document.querySelector('#secondInputs');
    secondInputs_Container.classList.remove('slide-left');
    secondInputs_Container.classList.add('slide-right');
    manageSteps('back');
}

async function submitTheForm(button) {
    const secondInputs = document.querySelectorAll('#secondInputs input');

    // Explicitly validate all second inputs
    const validations = await Promise.all(
        Array.from(secondInputs).map(input => checkIfValid(input))
    );

    if (validations.every(Boolean)) {
        Register_Company(button);
    } else {
        if (typeof ToastSystem !== 'undefined') ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

// Steps Management
// currentStep is defined in globals.js
function manageSteps(action) {
    const steps = document.querySelectorAll('.step');
    const step_text = document.querySelectorAll('.step-text');
    const step_icon = document.querySelectorAll('.step-icon');

    // Deactivate current
    if (step_text[currentStep]) step_text[currentStep].classList.remove('left-active-text');
    if (step_icon[currentStep]) step_icon[currentStep].classList.remove('left-active-icon');
    if (steps[currentStep]) steps[currentStep].classList.remove('active-step');

    if (action == 'next') {
        currentStep++;
    } else {
        currentStep--;
    }

    // Activate new
    if (steps[currentStep]) steps[currentStep].classList.add('active-step');
    if (step_text[currentStep]) step_text[currentStep].classList.add('left-active-text');
    if (step_icon[currentStep]) step_icon[currentStep].classList.add('left-active-icon');
}

function panelSwap() {
    console.log("Executing panelSwap");
    const form_container = document.querySelector('.form-container');
    const toggle_container = document.querySelector('.toggle-container');
    const form_children = document.querySelectorAll('.form-container > div');
    const toggle_children = document.querySelectorAll('.toggle > div');

    if (!form_container || !toggle_container) {
        console.error("Containers not found in panelSwap");
        return;
    }

    form_container.classList.toggle('signUp');
    form_container.classList.toggle('signIn');
    toggle_container.classList.toggle('signUp');
    toggle_container.classList.toggle('signIn');

    form_children.forEach(child => {
        child.classList.toggle('shift_active');
        child.classList.toggle('shift_inactive');
    });
    toggle_children.forEach(child => {
        child.classList.toggle('shift_active');
        child.classList.toggle('shift_inactive');
    });

    if (typeof closeOTPModal === 'function') closeOTPModal();
}

function goBackToLandingPage() {
    if (typeof ToastSystem !== 'undefined') ToastSystem.show("Redirecting to the landing page.", "info");
    setTimeout(() => {
        window.location.href = '../../../Landing Page Tailwind/php/landing_page.php';
    }, 1500);
}
