// Main Initialization Script

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Data
    const dropdownData = await loadCompanyTypesAndIndustries();
    // dropdownData.types and dropdownData.industries are now in globals but we might use local references?
    // Globals are updated by loadCompanyTypesAndIndustries

    // DOM Elements
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
                    list = companyTypes;
                    break;
                case 'Industry':
                    list = industries;
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
                // Optional: validate selection immediately? Usually wait for click or blur.
                // inputValidation_SecondSection(input);
            } else {
                // If no list (Company Name, Address), just ensure non-empty
                validateSecondInputs(input);
            }
        });
    });

    // Animation End Listeners
    let isGoingBack = false;

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


    // Toggle Panel Buttons
    signUp_Btn.addEventListener('click', () => panelSwap());
    signIn_Btn.addEventListener('click', () => panelSwap());

    // Global Click Listener for Suggestions closing
    document.addEventListener('click', (e) => {
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
    setupEmailEditListeners();
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
        // Only show no results if there was supposed to be a list
        // const noItems = document.createElement('div');
        // noItems.className = 'no-results';
        // noItems.textContent = 'No matches found';
        // suggestionsContainer.append(noItems);
        // suggestionsContainer.classList.add('active');
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
    if (await firstInputsValidation()) {
        // Check if company email is verified
        if (!emailVerificationState.companyEmail) {
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
        if (typeof ToastSystem !== 'undefined') ToastSystem.show("Please correct the highlighted fields.", "error");
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
        if (typeof ToastSystem !== 'undefined') ToastSystem.show('Registration form is ready!', 'success');
        Register_Company(button);
    } else {
        if (typeof ToastSystem !== 'undefined') ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

// Steps Management
let currentStep = 0;
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
    const form_container = document.querySelector('.form-container');
    const toggle_container = document.querySelector('.toggle-container');
    const form_children = document.querySelectorAll('.form-container > div');
    const toggle_children = document.querySelectorAll('.toggle > div');

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

    closeOTPModal();
}

function goBackToLandingPage() {
    if (typeof ToastSystem !== 'undefined') ToastSystem.show("Redirecting to the landing page.", "info");
    setTimeout(() => {
        window.location.href = '../../../Landing Page Tailwind/php/landing_page.php';
    }, 1500);
}
