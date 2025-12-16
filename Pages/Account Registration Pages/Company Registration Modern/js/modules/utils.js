// Utility Functions

function showError(input, errorMessage) {
    input.classList.add('input_InvalidInput');
    const section = input.closest(".input-wrapper");
    const errorElement = section.querySelector("p");
    errorElement.textContent = errorMessage;
    errorElement.style.color = 'red';
    errorElement.style.visibility = 'visible';
}

function removeError(input) {
    input.classList.remove('input_InvalidInput');
    const section = input.closest(".input-wrapper");
    const errorElement = section.querySelector("p");
    errorElement.style.visibility = 'hidden';
}

function capitalizeFirstLetter(input) {
    const parts = input.value.trim().split(" ");
    if (!parts.includes('')) {
        return parts.map(part => {
            return part[0].toUpperCase() + part.slice(1).toLowerCase();
        }).join(' ');
    }
}

function toggleShow_Hide_Password() {
    const toggleButtons = document.querySelectorAll('.toggle_show_hide');
    toggleButtons.forEach(button => {
        const input_wrapper = button.closest('.input-wrapper');
        const eye = input_wrapper.querySelector('i');
        const passwordField = input_wrapper.querySelector('input');
        if (passwordField.type == 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
        eye.classList.toggle('fa-eye');
        eye.classList.toggle('fa-eye-slash');
    });
}

function resetFormState() {
    // 1. Reset Input Values
    const firstInputs = document.querySelectorAll('#firstInputs input');
    const secondInputs = document.querySelectorAll('#secondInputs input');
    const idealLocation_Input = document.querySelector('#location-input');

    firstInputs.forEach(input => input.value = "");
    secondInputs.forEach(input => input.value = "");
    if (idealLocation_Input) idealLocation_Input.value = "";

    // 2. Reset Global State
    userInformation = {};
    selectedTags = [];
    updateSelectedCount();
    idealLocation_Valid = false;
    currentStep = 0; // Reset step counter

    // 3. Reset Tags Container
    const tagsContainer = document.querySelector('.tags-container');
    if (tagsContainer) tagsContainer.innerHTML = '';

    // 4. Reset Section Visibility
    const firstInputs_Container = document.querySelector('#firstInputs');
    const secondInputs_Container = document.querySelector('#secondInputs');
    const thirdInputs_Container = document.querySelector('#thirdInputs');

    // Hide all sections first
    firstInputs_Container.style.display = 'flex'; // Show first section
    secondInputs_Container.style.display = 'none';
    thirdInputs_Container.style.display = 'none';

    // Remove any slide classes
    firstInputs_Container.classList.remove('slide-left', 'slide-right');
    secondInputs_Container.classList.remove('slide-left', 'slide-right');
    thirdInputs_Container.classList.remove('slide-left', 'slide-right');

    // Ensure first section has necessary classes
    firstInputs_Container.classList.add('form-section');

    // 5. Reset Steps Indicator
    const steps = document.querySelectorAll('.step');
    const step_text = document.querySelectorAll('.step-text');
    const step_icon = document.querySelectorAll('.step-icon');

    // Remove active classes from all steps
    steps.forEach(step => step.classList.remove('active-step'));
    step_text.forEach(text => text.classList.remove('left-active-text'));
    step_icon.forEach(icon => icon.classList.remove('left-active-icon'));

    // Activate first step
    if (steps[0]) steps[0].classList.add('active-step');
    if (step_text[0]) step_text[0].classList.add('left-active-text');
    if (step_icon[0]) step_icon[0].classList.add('left-active-icon');

    // 6. Reset Title
    const title = document.querySelector('#title');
    if (title) title.textContent = 'Personalize your Profile';

    // 7. Reset Error Messages
    const errorMessages = document.querySelectorAll('.input-wrapper p');
    errorMessages.forEach(p => {
        p.style.visibility = 'hidden';
        p.textContent = 'error';
        p.style.color = '';
    });

    // Remove invalid input classes
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => input.classList.remove('input_InvalidInput'));
}
