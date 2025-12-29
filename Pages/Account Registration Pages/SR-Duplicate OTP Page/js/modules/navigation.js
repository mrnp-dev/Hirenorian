// Navigation and Step Management Functions

function goBackToLandingPage() {
    ToastSystem.show("Redirecting to the landing page.", "info")
    ToastSystem.storeForNextPage('You’ve returned to the landing page.', 'success');
    setTimeout(() => {
        window.location.href = '/Hirenorian/Pages/Landing%20Page/php/index.php';
    }, 1500)
}

function manageSteps(action) {
    const steps = document.querySelectorAll('.step');
    const step_text = document.querySelectorAll('.step-text');
    const step_icon = document.querySelectorAll('.step-icon');

    step_text[currentStep].classList.remove('left-active-text');
    step_icon[currentStep].classList.remove('left-active-icon');
    steps[currentStep].classList.remove('active-step');
    if (action == 'next') {
        currentStep++;
    } else {
        currentStep--;
    }
    steps[currentStep].classList.add('active-step');
    step_text[currentStep].classList.add('left-active-text');
    step_icon[currentStep].classList.add('left-active-icon');
}

async function goNext() {
    const firstInputs_Container = document.querySelector('#firstInputs');
    if (await firstInputsValidation()) {
        // Check if personal email is verified
        if (!emailVerificationState.personalEmail) {
            const emailInput = document.querySelector('#email-input');
            showError(emailInput, 'Please verify your email address');
            return;
        }

        firstInputs_Container.classList.remove('slide-left');
        firstInputs_Container.classList.add('slide-right');
        manageSteps('next');
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

function goToPreviousSection(button) {
    const formSection = button.closest('.form-section');
    formSection.classList.remove('slide-left');
    formSection.classList.add('slide-right');
    secondBackButton_Action = button.textContent;
    manageSteps('back');
}

function goToLast(button) {
    const secondInputs = document.querySelectorAll('#secondInputs input');
    const secondInputs_Container = document.querySelector('#secondInputs');

    secondInputs.forEach(input => {
        validateSecondInputs(input);
    });
    if (Object.values(secondInputs_Validation).every(Boolean)) {
        // Check if school email is verified
        if (!emailVerificationState.schoolEmail) {
            const schoolEmailInput = document.querySelector('#schoolEmail-input');
            showError(schoolEmailInput, 'Please verify your school email address');
            return;
        }

        secondInputs_Container.classList.remove('slide-left');
        secondInputs_Container.classList.add('slide-right');
        updateTagsForSelectedCourse();
        manageSteps('next');
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

function submitTheForm(button) {
    const idealLocation_Input = document.querySelector('#location-input');

    if (idealLocation_Valid) userInformation['Ideal Location'] = idealLocation_Input.value.trim();
    if (selectedTags) userInformation['Tags'] = [...selectedTags];
    console.log(userInformation);
    Register_Student();
}

function panelSwap() {
    const form_container = document.querySelector('.form-container');
    const form_children = document.querySelectorAll('.form-container  > div');
    const toggle_container = document.querySelector('.toggle-container');
    const toggle_children = document.querySelectorAll('.toggle  > div');

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
}
