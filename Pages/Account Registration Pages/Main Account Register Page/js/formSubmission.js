/**
 * =============================================================================
 * FORM SUBMISSION & RESET
 * =============================================================================
 * Handles final form submission to database and state reset
 */

/**
 * Submits the registration form to the backend server
 * Sends all collected user information as JSON
 * Handles success and error responses with toast notifications
 * Redirects to landing page on successful registration
 */
async function Register_Student() {
    console.log(userInformation);
    fetch("http://158.69.205.176:8080/add_student_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInformation)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
            if (data.status === "success") {
                // Registration successful
                ToastSystem.show("You've been registered successfully", "success");
                setTimeout(() => {
                    ToastSystem.show("Redirecting to the landing page", "info");
                    setTimeout(() => {
                        resetFormState();
                        window.location.href = "/Hirenorian/Pages/Landing%20Page/php/landing_page.php";
                    }, 2000);
                }, 1500);
            } else {
                // Registration failed
                ToastSystem.show("Something went wrong, try again later.", "error");
                console.log(data.message);
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            ToastSystem.show("Network error. Please try again.", "error");
        });
}

/**
 * Resets the entire form to initial state
 * Called after successful registration or when navigating away
 * Clears all inputs, validates states, and resets UI
 */
function resetFormState() {
    console.log("Resetting form state...");
    
    // ========== 1. CLEAR ALL INPUT VALUES ==========
    firstInputs.forEach(input => input.value = "");
    secondInputs.forEach(input => input.value = "");
    if (idealLocation_Input) idealLocation_Input.value = "";

    // ========== 2. RESET GLOBAL STATE VARIABLES ==========
    userInformation = {};
    selectedTags = [];
    updateSelectedCount();
    idealLocation_Valid = false;
    currentStep = 0;
    secondBackButton_Action = '';

    // ========== 3. RESET TAGS CONTAINER ==========
    const tagsContainer = document.querySelector('.tags-container');
    if (tagsContainer) tagsContainer.innerHTML = '';

    // ========== 4. RESET SECTION VISIBILITY ==========
    // Show first section, hide others
    firstInputs_Container.style.display = 'flex';
    secondInputs_Container.style.display = 'none';
    thirdInputs_Container.style.display = 'none';

    // Remove animation classes
    firstInputs_Container.classList.remove('slide-left', 'slide-right');
    secondInputs_Container.classList.remove('slide-left', 'slide-right');
    thirdInputs_Container.classList.remove('slide-left', 'slide-right');

    // Ensure first section has necessary classes
    firstInputs_Container.classList.add('form-section');

    // ========== 5. RESET STEP INDICATORS ==========
    // Remove active classes from all steps
    steps.forEach(step => step.classList.remove('active-step'));
    step_text.forEach(text => text.classList.remove('left-active-text'));
    step_icon.forEach(icon => icon.classList.remove('left-active-icon'));

    // Activate first step
    if (steps[0]) steps[0].classList.add('active-step');
    if (step_text[0]) step_text[0].classList.add('left-active-text');
    if (step_icon[0]) step_icon[0].classList.add('left-active-icon');

    // ========== 6. RESET FORM TITLE ==========
    if (title) title.textContent = 'Personalize your Profile';

    // ========== 7. CLEAR ALL ERROR MESSAGES ==========
    const errorMessages = document.querySelectorAll('.input-wrapper p');
    errorMessages.forEach(p => {
        p.style.visibility = 'hidden';
        p.textContent = 'error';
        p.style.color = '';
    });

    // ========== 8. REMOVE INVALID INPUT STYLING ==========
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => input.classList.remove('input_InvalidInput'));
    
    console.log("Form state reset completed");
}
