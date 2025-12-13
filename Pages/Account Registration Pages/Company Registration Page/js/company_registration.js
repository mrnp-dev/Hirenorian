// ==================== STATE VARIABLES ====================
let emailVerificationState = {
    companyEmail: false
};

let currentVerifyingEmail = null;
let currentVerifyingEmailType = null;
let resendTimer = null;
let resendCountdown = 60;

let userInformation = {};
let currentStep = 0;

const form = document.querySelector('#signUp-Form');
const title = document.querySelector('#title');
const firstInputs = document.querySelectorAll('#firstInputs input');
const firstInputs_Container = document.querySelector('#firstInputs');
const first_nextBtn = document.querySelector('#first_nextBtn');

const secondInputs_Container = document.querySelector('#secondInputs');
const secondInputs = document.querySelectorAll('#secondInputs input');

const steps = document.querySelectorAll('.step');
const step_text = document.querySelectorAll('.step-text');
const step_icon = document.querySelectorAll('.step-icon');

let companyTypes = [];
let industries = [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const form_container = document.querySelector('.form-container');
    const toggle_container = document.querySelector('.toggle-container');
    const form_children = document.querySelectorAll('.form-container > div');
    const toggle_children = document.querySelectorAll('.toggle  > div');
    const signIn_Btn = document.getElementById('toggle-signIn-Btn');
    const signUp_Btn = document.getElementById('toggle-signUp-Btn');

    signUp_Btn.addEventListener('click', () => {
        panelSwap();
    });

    signIn_Btn.addEventListener('click', () => {
        panelSwap();
    });

    function panelSwap() {
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

        // Cancel Verification Process
        closeOTPModal();
        currentVerifyingEmail = null;
        currentVerifyingEmailType = null;
        const verifyBtn = document.querySelector('#verify-company-email-btn');
        if (verifyBtn && verifyBtn.disabled) {
            verifyBtn.innerHTML = '<i class="fa fa-shield-alt"></i> Verify';
            verifyBtn.disabled = false;
        }
    }

    setupEmailEditListeners();
    loadCompanyTypesAndIndustries();
});

// ==================== EMAIL EDIT LISTENERS ====================
function setupEmailEditListeners() {
    const companyEmailInput = document.querySelector('#email-input');

    companyEmailInput.addEventListener('input', () => {
        if (emailVerificationState.companyEmail) {
            emailVerificationState.companyEmail = false;
            document.querySelector('#verify-company-email-btn').style.display = 'flex';
            document.querySelector('#company-email-verified').style.display = 'none';
            delete userInformation['Company Email Verified'];
        }
    });
}

// ==================== SIGN IN VALIDATION ====================
const signInInputs = document.querySelectorAll('.sign-in-container input');

signInInputs.forEach(input => {
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        removeError(input);
    });
    input.addEventListener('blur', async () => {
        if (!checkIfEmpty_General(input)) {
            showError(input, `${input.name} cannot be empty.`);
        } else if (input.name == 'Company Email') {
            if (!checkEmail_Simple(input)) showError(input, `${input.name} is invalid.`);
        }
    });
});

// Enable Login Button on Input Change
const loginBtn = document.querySelector('#signIn_Btn');
const loginEmailInput = document.querySelector('#signin-email');
const loginPassInput = document.querySelector('#signin-password');

function enableLoginButton() {
    if (loginBtn.disabled) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
}

loginEmailInput.addEventListener('input', enableLoginButton);
loginPassInput.addEventListener('input', enableLoginButton);

async function check_LogIn_Fields() {
    let isValid = true;
    const emailInput = document.querySelector('#signin-email');
    const passwordInput = document.querySelector('#signin-password');

    // Validate email
    if (emailInput.value.trim() === "") {
        showError(emailInput, `${emailInput.name} cannot be empty.`);
        isValid = false;
    } else if (!checkEmail_Simple(emailInput)) {
        showError(emailInput, `Please enter a valid email.`);
        isValid = false;
    } else {
        removeError(emailInput);
    }

    // Validate password
    if (passwordInput.value.trim() === "") {
        showError(passwordInput, `${passwordInput.name} cannot be empty.`);
        isValid = false;
    } else {
        removeError(passwordInput);
    }

    if (isValid) {
        const company_email = document.querySelector('#signin-email').value.trim();
        const company_password = document.querySelector('#signin-password').value.trim();

        const loginBtn = document.querySelector('#signIn_Btn');
        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/company_login_process.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_email,
                    company_password
                })
            });
            if (response.ok && data.status === "success") {
                ToastSystem.show('Login Successfully', "success");
                const response = await fetch("company_session.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            company_email
                        })
                    }
                );
                const data = await response.json();
                if (response.ok && data.status === "success") {
                    console.log(data.debug);
                    ToastSystem.show('Session stored successfully', "success");
                    setTimeout(() => {
                        ToastSystem.show("Redirecting to Company Dashboard", "info");
                        setTimeout(() => {
                            window.location.href = "../../../Company%20Pages/Company%20Dashboard/php/company_dashboard.php";
                        }, 1500);
                    }, 1500);
                } else {
                    ToastSystem.show('Session storage failed', "error");
                    const loginBtn = document.querySelector('#signIn_Btn');
                    loginBtn.disabled = true;
                    loginBtn.textContent = "Session Failed";
                }
            } else {
                ToastSystem.show('Login Failed', "error");
                const loginBtn = document.querySelector('#signIn_Btn');
                loginBtn.disabled = true;
                loginBtn.textContent = "Login Failed";
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Unable to connect to server");
            const loginBtn = document.querySelector('#signIn_Btn');
            loginBtn.disabled = true;
            loginBtn.textContent = "Connection Error";
        }
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

function checkIfEmpty_General(input) {
    return input.value.trim() !== '';
}

function checkEmail_Simple(input) {
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validEmail_RegEx.test(input.value.trim());
}

// ==================== FIRST INPUTS VALIDATION ====================
firstInputs.forEach(input => {
    input.addEventListener('blur', async () => {
        initialFirstInputs_Validations(input);
        if (input.name === "Password" && input.dataset.strength == "weak") {
            showError(input, `${input.name}'s strength must be at least medium.`);
        }
    });
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        if (input.name == "Password") {
            const confirmPass_field = document.querySelector('#confirmPass-input');
            if (input.value.trim().length >= 12) {
                if (confirmPass_field.value.trim()) {
                    confirmPassword(confirmPass_field);
                }
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

async function initialFirstInputs_Validations(input) {
    return checkIfEmpty(input);
}

async function goNext() {
    if (await firstInputsValidation()) {
        // Check if company email is verified
        if (!emailVerificationState.companyEmail) {
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

async function firstInputsValidation() {
    const validations = await Promise.all(
        Array.from(firstInputs).map(input => {
            if (input.name == "Password" && input.dataset.strength == "weak") {
                showError(input, `${input.name}'s strength must be at least medium.`);
                return false;
            } else {
                return checkIfEmpty(input);
            }
        })
    );
    return validations.every(Boolean);
}

async function checkIfEmpty(input) {
    const trimmedValue = input.value.trim();
    if (trimmedValue == '') {
        showError(input, `${input.name} cannot be empty`);
        return false;
    } else {
        return await checkIfValid(input);
    }
}

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

async function checkIfValid(input) {
    let isValid = true;
    switch (input.name.trim().toLowerCase()) {
        case 'company email':
            isValid = await checkEmail(input);
            break;
        case 'phone number':
            isValid = checkPhoneNumber(input);
            break;
        case 'password':
            isValid = await checkPassword(input);
            break;
        case 'confirm password':
            isValid = confirmPassword(input);
            break;
        case 'company name':
            isValid = checkCompanyName(input);
            break;
        case 'company type':
            isValid = checkCompanyType(input);
            break;
        case 'industry':
            isValid = checkIndustry(input);
            break;
        case 'company address':
            isValid = checkCompanyAddress(input);
            break;
    }
    return isValid;
}

async function checkEmail(input) {
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail_RegEx.test(input.value.trim())) {
        showError(input, `Invalid Email`);
        return false;
    }

    // Check for duplicates in backend
    try {
        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/check_company_email.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: input.value.trim() })
        });

        const result = await response.json();

        if (result.status === "exists") {
            showError(input, "Email is already in use.");
            return false;
        } else if (result.status === "error") {
            console.error("Email check error:", result.message);
            // Optional: Fail open or show generic error? For now, prevent blocking but log it.
            // But allowing registration might cause issues later. 
            // Let's assume server error shouldn't block validation unless critical.
            // Better UX: Show generic error
            // showError(input, "Unable to verify email availability.");
            // return false; 
        }

    } catch (error) {
        console.error("Network error checking email:", error);
    }

    userInformation[input.name] = input.value;
    return true;
}

function checkPhoneNumber(input) {
    const validPhoneNo_regex = /^(?:\+639\d{9}|09\d{9})$/;
    if (!validPhoneNo_regex.test(input.value.trim())) {
        showError(input, `Invalid Philippine phone number.`);
        return false;
    } else {
        userInformation[input.name] = input.value;
        return true;
    }
}

async function checkPassword(input) {
    const password_minLength = 12,
        password_maxLength = 64;
    if (input.value.length < password_minLength) {
        showError(input, `${input.name} must contain at least 12 characters.`);
        return false;
    } else if (input.value.length > password_maxLength) {
        showError(input, `${input.name} must not exceed 64 characters.`);
        return false;
    } else {
        return checkPasswordStrength(input);
    }
}

function checkPasswordStrength(input) {
    const password = input.value;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecials = /[^a-zA-Z0-9]/.test(password);

    const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;
    return changePasswordStrength_text(input, typesCount);
}

function changePasswordStrength_text(element, strength) {
    let valid = true;
    const section = element.closest(".input-wrapper");
    const strength_P = section.querySelector("p");
    const span = document.createElement('span');
    strength_P.textContent = "strength: ";
    strength_P.style.color = "white";

    switch (strength) {
        case 1:
            span.textContent = "weak";
            span.style.color = "red";
            element.dataset.strength = "weak";
            valid = false;
            break;
        case 2:
            span.textContent = "medium";
            span.style.color = "orange";
            element.dataset.strength = "medium";
            break;
        case 3:
            span.textContent = "strong";
            span.style.color = "green";
            element.dataset.strength = "strong";
            break;
    }

    strength_P.append(span);
    strength_P.style.visibility = 'visible';

    return valid;
}

function confirmPassword(input) {
    const password = document.querySelector('#password-input').value;
    if (input.value !== password) {
        showError(input, `Passwords do not match.`);
        return false;
    } else {
        input.classList.remove('input_InvalidInput');
        const section = input.closest(".input-wrapper");
        const p = section.querySelector("p");
        p.textContent = "Passwords matched";
        p.style.color = "green";
        p.style.visibility = 'visible';
        userInformation[`Password`] = input.value;
        return true;
    }
}

// Password toggle function
function toggleShow_Hide_Password(button) {
    const buttonId = button.id;

    // Check if this is a Registration section toggle (Password or Confirm Password)
    if (buttonId === 'togglePassword' || buttonId === 'toggleConfirmPassword') {
        // Toggle both Password and Confirm Password fields together
        const passwordWrapper = document.querySelector('#togglePassword').closest('.input-wrapper');
        const confirmPasswordWrapper = document.querySelector('#toggleConfirmPassword').closest('.input-wrapper');

        const passwordField = passwordWrapper.querySelector('input');
        const confirmPasswordField = confirmPasswordWrapper.querySelector('input');
        const passwordEye = passwordWrapper.querySelector('i');
        const confirmPasswordEye = confirmPasswordWrapper.querySelector('i');

        // Toggle both fields
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            confirmPasswordField.type = 'text';
        } else {
            passwordField.type = 'password';
            confirmPasswordField.type = 'password';
        }

        // Toggle both eye icons
        passwordEye.classList.toggle('fa-eye');
        passwordEye.classList.toggle('fa-eye-slash');
        confirmPasswordEye.classList.toggle('fa-eye');
        confirmPasswordEye.classList.toggle('fa-eye-slash');
    } else {
        // Sign In toggle - works independently
        const input_wrapper = button.closest('.input-wrapper');
        const eye = input_wrapper.querySelector('i');
        const passwordField = input_wrapper.querySelector('input');

        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
        eye.classList.toggle('fa-eye');
        eye.classList.toggle('fa-eye-slash');
    }
}

// ==================== SECOND INPUTS VALIDATION ====================
secondInputs.forEach(input => {
    input.addEventListener('blur', async () => {
        checkIfEmpty(input);
    });
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        removeError(input);
    });
});

function checkCompanyName(input) {
    if (input.value.trim() === '') {
        showError(input, 'Company Name cannot be empty');
        return false;
    }
    userInformation[input.name] = input.value;
    return true;
}

function checkCompanyType(input) {
    if (input.value.trim() === '') {
        showError(input, 'Company Type cannot be empty');
        return false;
    }
    // Check if value exists in company types
    const isValid = companyTypes.includes(input.value.trim());
    if (!isValid) {
        showError(input, 'Please select a valid company type from the dropdown');
        return false;
    }
    userInformation[input.name] = input.value;
    return true;
}

function checkIndustry(input) {
    if (input.value.trim() === '') {
        showError(input, 'Industry cannot be empty');
        return false;
    }
    // Check if value exists in industries
    const isValid = industries.includes(input.value.trim());
    if (!isValid) {
        showError(input, 'Please select a valid industry from the dropdown');
        return false;
    }
    userInformation[input.name] = input.value;
    return true;
}

function checkCompanyAddress(input) {
    if (input.value.trim() === '') {
        showError(input, 'Company Address cannot be empty');
        return false;
    }
    userInformation[input.name] = input.value;
    return true;
}

// ==================== DROPDOWN FUNCTIONALITY ====================
async function loadCompanyTypesAndIndustries() {
    try {
        const [typesResponse, industriesResponse] = await Promise.all([
            fetch('../json/CompanyType.json'),
            fetch('../json/industry.json')
        ]);

        const typesData = await typesResponse.json();
        const industriesData = await industriesResponse.json();

        companyTypes = typesData.typesOfCompanies;
        industries = industriesData.industries;

        setupCompanyTypeDropdown();
        setupIndustryDropdown();
    } catch (error) {
        console.error('Failed to load dropdown data:', error);
        ToastSystem.show('Failed to load dropdown options', 'error');
    }
}

function setupCompanyTypeDropdown() {
    const input = document.querySelector('#companyType-input');
    const dropdown = input.nextElementSibling;

    input.addEventListener('input', () => {
        const searchTerm = input.value.toLowerCase();
        dropdown.innerHTML = '';

        const filtered = companyTypes.filter(type =>
            type.toLowerCase().includes(searchTerm)
        );

        if (filtered.length > 0) {
            filtered.forEach(type => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = type;
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    input.value = type;
                    dropdown.classList.remove('active');
                    removeError(input);
                });
                dropdown.appendChild(item);
            });
            dropdown.classList.add('active');
        } else {
            dropdown.classList.remove('active');
        }
    });

    input.addEventListener('focus', () => {
        const searchTerm = input.value.toLowerCase();
        dropdown.innerHTML = '';

        const filtered = companyTypes.filter(type =>
            type.toLowerCase().includes(searchTerm)
        );

        if (filtered.length > 0) {
            filtered.forEach(type => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = type;
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    input.value = type;
                    dropdown.classList.remove('active');
                    removeError(input);
                });
                dropdown.appendChild(item);
            });
            dropdown.classList.add('active');
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.classList.remove('active');
        }, 200);
    });
}

function setupIndustryDropdown() {
    const input = document.querySelector('#industry-input');
    const dropdown = input.nextElementSibling;

    input.addEventListener('input', () => {
        const searchTerm = input.value.toLowerCase();
        dropdown.innerHTML = '';

        const filtered = industries.filter(industry =>
            industry.toLowerCase().includes(searchTerm)
        );

        if (filtered.length > 0) {
            filtered.forEach(industry => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = industry;
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    input.value = industry;
                    dropdown.classList.remove('active');
                    removeError(input);
                });
                dropdown.appendChild(item);
            });
            dropdown.classList.add('active');
        } else {
            dropdown.classList.remove('active');
        }
    });

    input.addEventListener('focus', () => {
        const searchTerm = input.value.toLowerCase();
        dropdown.innerHTML = '';

        const filtered = industries.filter(industry =>
            industry.toLowerCase().includes(searchTerm)
        );

        if (filtered.length > 0) {
            filtered.forEach(industry => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = industry;
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    input.value = industry;
                    dropdown.classList.remove('active');
                    removeError(input);
                });
                dropdown.appendChild(item);
            });
            dropdown.classList.add('active');
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.classList.remove('active');
        }, 200);
    });
}

// ==================== STEP MANAGEMENT ====================
function manageSteps(action) {
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

function goToPreviousSection(button) {
    const formSection = button.closest('.form-section');
    formSection.classList.remove('slide-left');
    formSection.classList.add('slide-right');
    secondBackButton_Action = 'back';  // Set flag to trigger back animation
    manageSteps('back');
}

let secondBackButton_Action = '';
secondInputs_Container.addEventListener('animationend', e => {
    if (secondBackButton_Action) {
        secondBackButton_Action = '';
        if (e.animationName == 'slideRight') {
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            firstInputs_Container.style.display = 'flex';
            firstInputs_Container.classList.add('slide-left');
            firstInputs_Container.classList.add('form-section');
            title.textContent = 'Company Profile';
        }
    }
});

function goBackToLandingPage() {
    ToastSystem.show("Redirecting to the landing page.", "info");
    ToastSystem.storeForNextPage('You\'ve returned to the landing page.', 'success');
    setTimeout(() => {
        window.location.href = '/Hirenorian/Pages/Landing%20Page/php/landing_page.php';
    }, 1500);
}

async function submitTheForm(button) {
    // Validate all second inputs
    const allValid = await Promise.all(
        Array.from(secondInputs).map(input => checkIfEmpty(input))
    );

    if (allValid.every(Boolean)) {
        ToastSystem.show('Registration form is ready for backend integration!', 'success');
        console.log('User Information:', userInformation);
        // TODO: Implement backend submission
        Register_Company();
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

async function Register_Company() {
    console.log(userInformation);
    fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/company_registration_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInformation)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
            if (data.status === "success") {
                ToastSystem.show("Company has been registered successfully", "success");
                setTimeout(() => {
                    ToastSystem.show("Redirecting to the landing page", "info");
                    setTimeout(() => {
                        window.location.href = "../../../Company%20Pages/Company%20Dashboard/php/company_dashboard.php";
                    }, 2000);
                }, 1500);
            } else {
                ToastSystem.show("Something went wrong, try again later.", "error");
                console.log(data.message);
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
        });
}
// ==================== EMAIL VERIFICATION ====================
async function initiateEmailVerification(emailType) {
    if (emailType === 'company') {
        const emailInput = document.querySelector('#email-input');
        const email = emailInput.value.trim();

        // Validate email format first
        const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showError(emailInput, 'Please enter an email address');
            return;
        }
        if (!validEmail_RegEx.test(email)) {
            showError(emailInput, 'Invalid email format');
            return;
        }

        currentVerifyingEmail = email;
        currentVerifyingEmailType = emailType;

        // Call Backend to Send OTP
        const btn = document.querySelector('#verify-company-email-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fa fa-spinner fa-spin"></i>';
        btn.disabled = true;

        fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/send_registration_otp.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    openOTPModal();
                    ToastSystem.show(`OTP sent to ${email}`, "success");
                } else {
                    ToastSystem.show(data.message || "Failed to send OTP", "error");
                }
            })
            .catch(err => {
                console.error("Error sending OTP:", err);
                ToastSystem.show("Network error sending OTP", "error");
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    }
}

function openOTPModal() {
    const modal = document.querySelector('#otpModalOverlay');
    const emailDisplay = document.querySelector('#verifying-email-display');

    emailDisplay.textContent = currentVerifyingEmail;
    modal.style.display = 'flex';

    // Reset OTP inputs
    resetOTPInputs();

    // Focus first input
    setTimeout(() => {
        document.querySelector('#otp-1').focus();
    }, 100);

    // Setup OTP input handlers
    setupOTPInputHandlers();
}

function closeOTPModal() {
    const modal = document.querySelector('#otpModalOverlay');
    modal.classList.add('closing');

    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
        resetOTPInputs();
        hideOTPError();
    }, 300);

    currentVerifyingEmail = null;
    currentVerifyingEmailType = null;
}

function resetOTPInputs() {
    for (let i = 1; i <= 6; i++) {
        const input = document.querySelector(`#otp-${i}`);
        input.value = '';
        input.classList.remove('filled', 'error');
    }
}

function setupOTPInputHandlers() {
    const otpInputs = document.querySelectorAll('.otp-modal-content .otp-input');

    otpInputs.forEach((input, index) => {
        // Remove existing event listeners by cloning
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });

    // Re-select after cloning
    const freshInputs = document.querySelectorAll('.otp-modal-content .otp-input');

    freshInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Only allow digits
            e.target.value = value.replace(/[^0-9]/g, '');

            if (e.target.value) {
                e.target.classList.add('filled');
                e.target.classList.remove('error');

                // Auto-focus next input
                if (index < 5) {
                    freshInputs[index + 1].focus();
                }

                // Auto-verify when all filled
                if (index === 5) {
                    setTimeout(() => verifyOTP(), 300);
                }
            } else {
                e.target.classList.remove('filled');
            }

            hideOTPError();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                freshInputs[index - 1].focus();
            }

            if (e.key === 'ArrowLeft' && index > 0) {
                freshInputs[index - 1].focus();
            }

            if (e.key === 'ArrowRight' && index < 5) {
                freshInputs[index + 1].focus();
            }
        });

        // Paste support
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6);

            digits.split('').forEach((digit, i) => {
                if (i < 6) {
                    freshInputs[i].value = digit;
                    freshInputs[i].classList.add('filled');
                }
            });

            if (digits.length === 6) {
                setTimeout(() => verifyOTP(), 300);
            }
        });
    });
}

function verifyOTP() {
    const otpInputs = document.querySelectorAll('.otp-modal-content .otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');

    if (otp.length !== 6) {
        showOTPError('Please enter all 6 digits');
        otpInputs.forEach(input => input.classList.add('error'));
        return;
    }

    // Verify OTP via Backend
    const email = document.querySelector('#verifying-email-display').textContent;

    otpInputs.forEach(input => input.disabled = true);

    fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/verify_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Success
                ToastSystem.show('Email verified successfully!', 'success');

                if (currentVerifyingEmailType === 'company') {
                    emailVerificationState.companyEmail = true;
                    document.querySelector('#verify-company-email-btn').style.display = 'none';
                    document.querySelector('#company-email-verified').style.display = 'flex';
                    userInformation['Company Email Verified'] = true;

                    const emailInput = document.querySelector('#email-input');
                    removeError(emailInput);
                }

                closeOTPModal();
            } else {
                showOTPError(data.message || 'Invalid OTP');
                otpInputs.forEach(input => {
                    input.classList.add('error');
                    input.disabled = false;
                });
            }
        })
        .catch(err => {
            console.error("Error verifying OTP:", err);
            showOTPError("Network error verifying OTP");
            otpInputs.forEach(input => {
                input.disabled = false;
            });
        });
}

function resendOTP() {
    if (resendTimer) {
        return; // Already counting down
    }

    const email = document.querySelector('#verifying-email-display').textContent;

    fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/send_registration_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                ToastSystem.show('OTP resent!', 'success');
            } else {
                ToastSystem.show('Failed to resend OTP', 'error');
            }
        })
        .catch(err => ToastSystem.show('Network error', 'error'));

    // Start countdown
    const resendBtn = document.querySelector('#resendOtpBtn');
    const resendText = document.querySelector('#resendText');
    resendBtn.disabled = true;
    resendCountdown = 60;

    resendTimer = setInterval(() => {
        resendCountdown--;
        resendText.textContent = `Resend Code (${resendCountdown}s)`;

        if (resendCountdown <= 0) {
            clearInterval(resendTimer);
            resendTimer = null;
            resendBtn.disabled = false;
            resendText.textContent = 'Resend Code';
        }
    }, 1000);
}

function showOTPError(message) {
    const errorElement = document.querySelector('#otpErrorMessage');
    const errorText = document.querySelector('#otpErrorText');
    errorText.textContent = message;
    errorElement.style.display = 'block';
}

function hideOTPError() {
    const errorElement = document.querySelector('#otpErrorMessage');
    errorElement.style.display = 'none';
}
