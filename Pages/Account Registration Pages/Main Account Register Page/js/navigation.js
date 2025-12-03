/**
 * =============================================================================
 * STEP NAVIGATION & ANIMATION MANAGEMENT
 * =============================================================================
 * Handles form section transitions, step indicators, and navigation flow
 */

/**
 * Updates the step indicator display
 * Removes active class from current step and adds it to the next/previous step
 * 
 * @param {string} action - 'next' to move forward, 'back' to move backward
 */
function manageSteps(action) {
    // Remove active styling from current step
    step_text[currentStep].classList.remove('left-active-text');
    step_icon[currentStep].classList.remove('left-active-icon');
    steps[currentStep].classList.remove('active-step');
    
    // Update step counter
    if (action == 'next') {
        currentStep++;
    } else {
        currentStep--;
    }
    
    // Add active styling to new current step
    steps[currentStep].classList.add('active-step');
    step_text[currentStep].classList.add('left-active-text');
    step_icon[currentStep].classList.add('left-active-icon');
}

/**
 * Handles animation when transitioning from first to second section
 * Shows second section and hides first section after slide animation completes
 */
firstInputs_Container.addEventListener('animationend', e => {
    if (e.animationName == 'slideRight') {
        // Hide first section
        firstInputs_Container.classList.remove('slide-right');
        firstInputs_Container.style.display = 'none';
        
        // Show second section
        secondInputs_Container.style.display = 'flex';
        secondInputs_Container.classList.add('slide-left');
        secondInputs_Container.classList.add('form-section');
        
        // Update title
        title.textContent = 'Display your Achievements';
    }
});

/**
 * Handles animation when transitioning between second and third sections
 * Also handles back button action from second section
 */
secondInputs_Container.addEventListener('animationend', e => {
    if (!secondBackButton_Action) {
        // Moving forward to third section
        if (e.animationName == 'slideRight') {
            // Hide second section
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            
            // Show third section
            thirdInputs_Container.style.display = 'flex';
            thirdInputs_Container.classList.add('slide-left');
            thirdInputs_Container.classList.add('form-section');
            
            // Update title
            title.textContent = 'Where do you see yourself?';
        }
    } else {
        // Moving backward to first section
        secondBackButton_Action = '';
        if (e.animationName == 'slideRight') {
            // Hide second section
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            
            // Show first section
            firstInputs_Container.style.display = 'flex';
            firstInputs_Container.classList.add('slide-left');
            firstInputs_Container.classList.add('form-section');
            
            // Update title
            title.textContent = 'Personalize your Profile';
        }
    }
});

/**
 * Handles animation when transitioning from third back to second section
 */
thirdInputs_Container.addEventListener('animationend', e => {
    if (e.animationName == 'slideRight') {
        // Hide third section
        thirdInputs_Container.classList.remove('slide-right');
        thirdInputs_Container.style.display = 'none';
        
        // Show second section
        secondInputs_Container.style.display = 'flex';
        secondInputs_Container.classList.add('slide-left');
        secondInputs_Container.classList.add('form-section');
        
        // Update title
        title.textContent = 'Display your Achievements';
    }
});

/**
 * Navigates to the previous form section with animation
 * Called when "Back" button is clicked
 * 
 * @param {HTMLElement} button - The back button element
 */
function goToPreviousSection(button) {
    const formSection = button.closest('.form-section');
    formSection.classList.remove('slide-left');
    formSection.classList.add('slide-right');
    secondBackButton_Action = button.textContent;
    manageSteps('back');
}

/**
 * Navigates back to landing page
 * Shows toast notification and redirects after delay
 */
function goBackToLandingPage() {
    ToastSystem.show("Redirecting to the landing page.", "info")
    ToastSystem.storeForNextPage('You\'ve returned to the landing page.', 'success');
    setTimeout(() => {
        window.location.href = '../../../../Pages/Landing%20Page/php/landing_page.php';
    }, 1500)
}
