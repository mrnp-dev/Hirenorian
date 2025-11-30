/**
 * =============================================================================
 * LOGIN PANEL MANAGEMENT
 * =============================================================================
 * Handles sign-in/sign-up panel switching and login form validation
 */

// ============ DOM ELEMENTS FOR PANEL CONTROL ============
const signUp_Inputs = document.querySelectorAll('.sign-in-container input');

// ============ SIGN IN/SIGN UP PANEL TOGGLE ============

/**
 * Toggles between sign-in and sign-up panels
 * Animates form containers and toggle button states
 */
function panelSwap() {
    const form_container = document.querySelector('.form-container');
    const form_children = document.querySelectorAll('.form-container > div');
    const toggle_container = document.querySelector('.toggle-container');
    const toggle_children = document.querySelectorAll('.toggle > div');
    
    // Toggle container classes
    form_container.classList.toggle('signUp');
    form_container.classList.toggle('signIn');
    toggle_container.classList.toggle('signUp');
    toggle_container.classList.toggle('signIn');
    
    // Toggle child visibility states
    form_children.forEach(child => {
        child.classList.toggle('shift_active');
        child.classList.toggle('shift_inactive');
    });
    toggle_children.forEach(child => {
        child.classList.toggle('shift_active');
        child.classList.toggle('shift_inactive');
    });
}

// ============ LOGIN FORM VALIDATION ============

/**
 * Adds event listeners to login input fields
 * Shows/removes errors on focus, input, and blur
 */
signUp_Inputs.forEach(input => {
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        removeError(input);
    });
    input.addEventListener('blur', async () => {
        if (!checkIfEmpty_General(input)) {
            showError(input, `${input.name} cannot be empty.`);
        } else if (input.name == 'Student Email') {
            if (!checkLogged_Email(input)) 
                showError(input, `${input.name} is invalid.`);
        }
    });
})

/**
 * Validates login form and authenticates user
 * Email must be valid PSU school email
 * Calls backend login endpoint
 * On success: starts session and redirects to student dashboard
 * On failure: shows error toast
 */
async function check_LogIn_Fields() {
    let isValid = true;
    
    // Validate all login fields
    signUp_Inputs.forEach(input => {
        if (input.value.trim() == "") {
            isValid = showError(input, `${input.name} cannot be empty.`);
        } else if (input.name == "Student Email") {
            isValid = checkLogged_Email(input);
        } else {
            isValid = true;
        }
    });

    if (isValid) {
        const email = document.querySelector('#signup-email').value.trim();
        const password = document.querySelector('#signup-password').value.trim();
        
        try {
            // Send login credentials to backend
            const response = await fetch("http://158.69.205.176:8080/student_login_process.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.status === "success") {
                // Login successful - start session
                ToastSystem.show('Login Successfully', "success");
                setTimeout(() => {
                    ToastSystem.show("Redirecting to Student Dashboard", "info");
                    setTimeout(() => {
                        // Redirect to student dashboard
                        window.location.href = "/Hirenorian/Pages/Student%20Pages/Student%20Dashboard%20Page/php/student_dashboard.php";
                    }, 1500);
                }, 1500);
            } else {
                // Login failed
                ToastSystem.show('Login Failed', "error");
            }
        } catch (err) {
            console.error("Network error:", err);
            ToastSystem.show("Unable to connect to server", "error");
        }
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

/**
 * Validates if email is a valid PSU school email
 * Format: 20YYNTNNNNNN@pampangastateu.edu.ph
 * Where: YY = admission year, NT = NT code, NNNNNN = student number
 * 
 * @param {HTMLElement} input - The email input element
 * @returns {boolean} - True if valid PSU school email
 */
function checkLogged_Email(input) {
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;
    if (validSchoolEmail_RegEx.test(input.value.trim())) {
        return true;
    } else {
        return false;
    }
}

// ============ PANEL INITIALIZATION ============

/**
 * Initializes panel toggle buttons on page load
 * Called in DOMContentLoaded event
 */
function initializePanelToggle() {
    const signIn_Btn = document.getElementById('toggle-signIn-Btn');
    const signUp_Btn = document.getElementById('toggle-signUp-Btn');

    signUp_Btn.addEventListener('click', () => {
        panelSwap();
    });

    signIn_Btn.addEventListener('click', () => {
        panelSwap();
    });
}
