let selectedTags = [];
const maxSelection = 3;
let courseTagsData = {};

// ==================== EMAIL VERIFICATION STATE ====================
let emailVerificationState = {
    personalEmail: false,
    schoolEmail: false
};

let currentVerifyingEmail = null;
let currentVerifyingEmailType = null;
let resendTimer = null;
let resendCountdown = 60;


const tagsContainer = document.querySelector('.tags-container');
const selectedCount = document.querySelector('.selected-count');

async function fetchCourseTags() {
    try {
        const response = await fetch('../JSON/courses_tags.json');
        const data = await response.json();
        courseTagsData = data.tags;
    } catch (error) {
        console.error('Error fetching course tags:', error);
    }
}

fetchCourseTags();

function renderTags(tags) {
    tagsContainer.innerHTML = '';

    if (!tags || tags.length === 0) {
        tagsContainer.innerHTML = '<p>No tags available for this course.</p>';
        return;
    }

    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTag(tag, tagElement));
        tagsContainer.appendChild(tagElement);
    });
}
function toggleTag(tag, element) {
    const index = selectedTags.indexOf(tag);

    if (index > -1) {
        selectedTags.splice(index, 1);
        element.classList.remove('chosen');
    } else {
        if (selectedTags.length < maxSelection) {
            selectedTags.push(tag);
            element.classList.add('chosen');
        } else {
            selectedCount.classList.add("shake");
            setTimeout(() => {
                selectedCount.classList.remove("shake");
            }, 500);
        }
    }
    updateSelectedCount();
}
function updateSelectedCount() {
    selectedCount.textContent = `Selected: ${selectedTags.length}/${maxSelection}`;
}

function updateTagsForSelectedCourse() {
    const courseInput = document.querySelector('#course-input');
    const selectedCourse = courseInput.value.trim();

    // Clear previous selection when course changes
    selectedTags = [];
    updateSelectedCount();

    if (courseTagsData[selectedCourse]) {
        renderTags(courseTagsData[selectedCourse]);
    } else {
        renderTags([]); // Or handle default/fallback tags
    }
}

/////////////////////////////////////////////////////////////////////////////////////
const signUp_Inputs = document.querySelectorAll('.sign-in-container input');

signUp_Inputs.forEach(input => {
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        removeError(input);
    });
    input.addEventListener('blur', async () => {
        if (!checkIfEmpty_General(input)) {
            showError(input, `${input.name} cannot empty.`);
        } else if (input.name == 'Student Email') {
            if (!checkLogged_Email(input)) showError(input, `${input.name} is invalid.`);
        }
    });
})

async function check_LogIn_Fields() {
    let isValid = true;
    signUp_Inputs.forEach(input => {
        if (input.value.trim() == "") {
            isValid = showError(input, `${input.name} cannot empty.`);
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
                ToastSystem.show('Login Successfully', "success");
            } else {
                ToastSystem.show('Login Failed', "error");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Unable to connect to server");
        }
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

function checkLogged_Email(input) {
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;
    if (validSchoolEmail_RegEx.test(input.value.trim())) {
        return true;
    } else {
        return false;
    }
}




const form = document.querySelector('#signUp-Form');
const title = document.querySelector('#title');
const firstInputs = document.querySelectorAll('#firstInputs input');
const firstInputs_Container = document.querySelector('#firstInputs');
const first_nextBtn = document.querySelector('#first_nextBtn');

const secondInputs_Container = document.querySelector('#secondInputs');
const secondInputs = document.querySelectorAll('#secondInputs input');
const studentNumber_Input = document.querySelector('#studNum-input');
let campuses = [];
let departments = [];
let courses = [];
let organizations = [];
let organizations_defaul = [];
let organizations_byDepartment = [];
let organizations_byCampus = [];
let lastFocusedElement = null;
let secondInputs_Validation = [];

let thirdInputs_Container = document.querySelector('#thirdInputs');
// const thirdInputs = document.querySelectorAll('#thirdInputs input');
const idealLocation_Input = document.querySelector('#location-input');
let jobclassifications = [];
let jobclassifications_before = [];
let locations = [];
// let thirdInputs_Validation = [];
let idealLocation_Valid = false;


let userInformation = {};

const steps = document.querySelectorAll('.step');
const step_text = document.querySelectorAll('.step-text');
const step_icon = document.querySelectorAll('.step-icon');
let currentStep = 0;

function goBackToLandingPage() {
    ToastSystem.show("Redirecting to the landing page.", "info")
    ToastSystem.storeForNextPage('You’ve returned to the landing page.', 'success');
    setTimeout(() => {
        window.location.href = '/Hirenorian/Pages/Landing%20Page/php/landing_page.php';
    }, 1500)
}

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
        title.textContent = 'Display your Achievements';
    }

});

firstInputs.forEach(input => {
    input.addEventListener('blur', async () => {
        initialFirstInputs_Validations(input);
        if (input.name === "Password" && input.dataset.strength == "weak") {
            showError(input, `${input.name}'s strength must be atleast medium.`);
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
    if (input.name !== 'Suffix') {
        return checkIfEmpty(input);
    } else {
        return checkIfValid(input);
    }

}

async function goNext() {
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

async function firstInputsValidation() {
    const validations = await Promise.all(
        Array.from(firstInputs).map(input => {
            if (input.name !== 'Suffix') {
                if (input.name == "Password" && input.dataset.strength == "weak") {
                    showError(input, `${input.name}'s strength must be atleast medium.`);
                    return false;
                } else {
                    return checkIfEmpty(input);
                }

            } else {
                return checkIfValid(input);
            }
        })
    );
    if (validations.every(Boolean)) {
        return true;
    } else {
        return false;
    }
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
        case 'first name':
            isValid = checkFirst_Last_Name(input);
            break;
        case 'last name':
            isValid = checkFirst_Last_Name(input);
            break;
        case 'middle initial':
            isValid = validateMiddleInitial(input);
            break;
        case 'suffix':
            isValid = checkSuffix(input);
            if (input.value.trim() == "") userInformation[input.name] = "";
            break;
        case 'email':
            isValid = checkEmail(input);
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
    }
    return isValid;
}

function checkFirst_Last_Name(input) {
    if (!checkNameLength(input)) {
        return false;
    } else {
        return true;
    }
}

function capitalizeFirstLetter(input) {
    const parts = input.value.trim().split(" ");
    if (!parts.includes('')) {
        return parts.map(part => {
            return part[0].toUpperCase() + part.slice(1).toLowerCase();
        }).join(' ');
    }
}

function checkNameLength(input) {
    const trimmedName = input.value.trim();
    if (trimmedName.length < 2 && trimmedName.length > 50) {
        switch (input.name.trim().toLowerCase()) {
            case 'first name':
                showError(input, `${input.name} must be between 2 and 50 characters.`);
                break;
            case 'last name':
                showError(input, `${input.name} must be between 2 and 50 characters.`);
                break;
        }
        return false;

    } else {
        if (checkWhiteSpaces(input)) return validateFirst_Last_Name(input);
    }
}

function validateFirst_Last_Name(input) {
    const first_last_Name_regex = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s\-]{2,50}$/;

    if (!first_last_Name_regex.test(input.value)) {
        showError(input, `${input.name} contains invalid characters.`);
        return false;
    } else {
        userInformation[input.name] = capitalizeFirstLetter(input);
        return true;
    }
}

function validateMiddleInitial(input) {
    const middleInitial_regex = /^[A-Za-z]\.?$/
    if (!middleInitial_regex.test(input.value)) {
        showError(input, `Invalid ${input.name}.`);
        return false;
    } else {
        userInformation[input.name] = input.value.includes(".") ?
            input.value.toUpperCase() :
            input.value.toUpperCase() + ".";
        return true;
    }
}

function checkSuffix(input) {
    const suffix_regex = /^(Jr\.?|Sr\.?|[A-Za-z]\.?|II|III|IV|V|VI|VII|VIII|IX|X)$/i;
    let valid = true;
    if (input.value.trim() !== '') {
        if (!suffix_regex.test(input.value)) {
            showError(input, `Invalid ${input.name}.`);
            valid = false;
        } else {
            userInformation[input.name] = input.value.toUpperCase();
        }
    }
    return valid;
}

function checkEmail(input) {
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.name == 'Email') {
        if (!validEmail_RegEx.test(input.value.trim())) {
            showError(input, `Invalid Email`);
            return false;
        } else {
            if (validSchoolEmail_RegEx.test(input.value.trim().toLowerCase())) {
                showError(input, `Not your School Email`);
                return false;
            }
            userInformation[input.name] = input.value;
            return true;
        }
    } else {
        if (!validSchoolEmail_RegEx.test(input.value.trim().toLowerCase())) {
            showError(input, `Invalid ${input.name}`);
            return false;
        } else {
            const year = parseInt(input.value.substring(0, 4), 10);
            const currentYear = new Date().getFullYear();

            if (year < currentYear - 15 || year > currentYear) {
                showError(input, `Invalid ${input.name}`);
                return false;
            }


            const studentNumber_substr = input.value.trim().toLowerCase().slice(0, 10);
            if (studentNumber_Input.value.trim()) {
                if (studentNumber_Input.value.trim() == studentNumber_substr) {
                    userInformation[input.name] = input.value.toLowerCase();
                    return true;
                } else {
                    showError(input, `Use your own school email address`);
                    return false;
                }
            }
        }
    }
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
        showError(input, `${input.name} must contain atleast 12 characters.`);
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

function checkWhiteSpaces(input) {
    const regExSpaces = /\s{2,}/;
    if (regExSpaces.test(input.value.trim())) {
        showError(input, `${input.name} contains to much spaces.`);
        return false;
    } else {
        return true;
    }
}

function goToPreviousSection(button) {
    const formSection = button.closest('.form-section');
    formSection.classList.remove('slide-left');
    formSection.classList.add('slide-right');
    secondBackButton_Action = button.textContent;
    manageSteps('back');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-wrapper' || !e.target.closest('button'))) {
        secondInputs.forEach(input => {
            input.nextElementSibling.classList.remove('active');
        });
        // thirdInputs.forEach(input => {
        //     input.nextElementSibling.classList.remove('active');
        // });
        idealLocation_Input.nextElementSibling.classList.remove('active');
        validateSecondInputs(lastFocusedElement);
    }
});

secondInputs.forEach(input => {
    input.addEventListener('blur', async () => {
        validateSecondInputs(input);
    });
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        removeError(input);
    });
});

let secondBackButton_Action = '';
secondInputs_Container.addEventListener('animationend', e => {
    if (!secondBackButton_Action) {
        if (e.animationName == 'slideRight') {
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            thirdInputs_Container.style.display = 'flex';
            thirdInputs_Container.classList.add('slide-left');
            thirdInputs_Container.classList.add('form-section');
            title.textContent = 'Where do you see yourself?';
        }
    } else {
        secondBackButton_Action = '';
        if (e.animationName == 'slideRight') {
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            firstInputs_Container.style.display = 'flex';
            firstInputs_Container.classList.add('slide-left');
            firstInputs_Container.classList.add('form-section');
            title.textContent = 'Personalize your Profile';
        }
    }
});


function goToLast(button) {
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

async function ifStudentNumber_Exist() {
    return fetch("http://158.69.205.176:8080/check_student_number.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInformation)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                showError(studentNumber_Input, "This Student ID is already registered");
                return false;
            } else {
                removeError(studentNumber_Input);
                return true;
            }
        })
        .catch(err => {
            console.error(err);
            ToastSystem.show("Something went wrong, try again later.", "error");
            return false;
        });
}

function resetFormState() {
    // 1. Reset Input Values
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
    // Remove active classes from all steps
    steps.forEach(step => step.classList.remove('active-step'));
    step_text.forEach(text => text.classList.remove('left-active-text'));
    step_icon.forEach(icon => icon.classList.remove('left-active-icon'));

    // Activate first step
    if (steps[0]) steps[0].classList.add('active-step');
    if (step_text[0]) step_text[0].classList.add('left-active-text');
    if (step_icon[0]) step_icon[0].classList.add('left-active-icon');

    // 6. Reset Title
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
                ToastSystem.show("You’ve been registered successfully", "success");
                setTimeout(() => {
                    ToastSystem.show("Redirecting to the landing page", "info");
                    setTimeout(() => {
                        resetFormState();
                        window.location.href = "/Hirenorian/Pages/Landing%20Page/php/landing_page.php";
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

thirdInputs_Container.addEventListener('animationend', e => {
    if (e.animationName == 'slideRight') {
        thirdInputs_Container.classList.remove('slide-right');
        thirdInputs_Container.style.display = 'none';
        secondInputs_Container.style.display = 'flex';
        secondInputs_Container.classList.add('slide-left');
        secondInputs_Container.classList.add('form-section');
        title.textContent = 'Display your Achievements';
    }

});

function autoCorrect_Suggestions(input, list, validation) {
    const index = list.findIndex(item => item.toLowerCase() === input.value.trim().toLowerCase());
    if (index !== -1) {
        input.value = list[index]
        validation[`is${input.name}Valid`] = true;
        userInformation[input.name] = input.value;
        if (input.name == "Ideal Location") {
            idealLocation_Valid = true;
        }
    } else {
        showError(input, `Invalid ${input.name}`);
        validation[`is${input.name}Valid`] = false;
        if (input.name == "Ideal Location") {
            idealLocation_Valid = false;
        }
    }
}

async function validateSecondInputs(input) {
    if (input !== null) {
        switch (input.name) {
            case 'University/Campus':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isUniversity/CampusValid'] = false;
                } else {
                    autoCorrect_Suggestions(input, campuses, secondInputs_Validation);
                }
                break;
            case 'Department':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isDepartmentValid'] = false;
                } else {
                    autoCorrect_Suggestions(input, departments, secondInputs_Validation);
                }
                break;
            case 'Course':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isCourseValid'] = false;
                } else {
                    if (courses != []) {
                        autoCorrect_Suggestions(input, courses, secondInputs_Validation);
                    }
                }
                break;

            case 'Student Number':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isStudentNumberValid'] = false;
                } else if (!checkStudentNumber(input)) {
                    showError(input, `Invalid ${input.name}`);
                    secondInputs_Validation['isStudentNumberValid'] = false;
                } else {
                    ifStudentNumber_Exist().then(exists => {
                        if (!exists) {
                            secondInputs_Validation['isStudentNumberValid'] = false;
                        } else {
                            secondInputs_Validation['isStudentNumberValid'] = true;
                        }
                    })
                }
                break;
            case 'School Email':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isSchoolEmailValid'] = false;
                } else if (!checkEmail(input)) {
                    secondInputs_Validation['isSchoolEmailValid'] = false;
                }
                else {
                    secondInputs_Validation['isSchoolEmailValid'] = true;
                }
                break;

            case 'Organization':
                if (input.value.trim() !== '') {
                    autoCorrect_Suggestions(input, organizations, secondInputs_Validation);
                } else {
                    userInformation[input.name] = '';
                }
                break;
        }
    }
}

function checkIfEmpty_General(input) {
    const trimmedValue = input.value.trim();
    if (trimmedValue == '') {
        showError(input, `${input.name} cannot be empty`);
        return false;
    } else {
        return true;
    }
}

function checkStudentNumber(input) {
    const studentNumber_RegEx = /^(19|20)\d{2}\d{6}$/;
    const value = input.value.trim();
    if (!studentNumber_RegEx.test(value)) {
        return false;
    }

    const year = parseInt(value.slice(0, 4), 10);
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
        return false;
    }
    if (year < currentYear - 15) {
        return false;
    }
    userInformation[input.name] = input.value.trim();
    return true;
}

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
    suggestionsContainer.innerHTML = '';

    if (list.length === 0 || !list) {
        const noItems = document.createElement('div');
        noItems.className = 'no-results';
        suggestionsContainer.append(noItems);
    } else {
        list.forEach(item => {
            const itemObj = document.createElement('div');
            itemObj.className = 'suggestion-item';
            itemObj.textContent = item;

            itemObj.addEventListener('click', async () => {

                input.value = item;
                suggestionsContainer.classList.remove('active');
                inputValidation_SecondSection(input);

                removeError(input);
            });

            suggestionsContainer.append(itemObj);
        });
        suggestionsContainer.classList.add('active');
    }

}

async function inputValidation_SecondSection(input) {
    if (input.name == 'Department') {
        const courseField = document.querySelector('#course-input');
        courseField.nextElementSibling.innerHTML = '';
        courseField.value = '';
        courses = [];

        const organizationField = document.querySelector('#org-input');
        organizationField.nextElementSibling.innerHTML = '';
        organizations_byDepartment = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

        const value = input.value.trim().toLowerCase();
        const depIndex = departments.findIndex(dep => dep.trim().toLowerCase() == value);

        // thirdInputs.forEach((input, index) => {
        //     if(index <=2 ){
        //         input.value = '';
        //         jobclassifications = [];
        //         input.nextElementSibling.innerHTML = '';
        //     }
        // });


        if (depIndex !== -1) {
            removeError(input);
            getCoursesList(departments[depIndex]);
            getOrganizationsList(departments[depIndex]);
            getJobClassificationList(departments[depIndex]);
        };
    } else if (input.name == 'University/Campus') {
        const value = input.value.trim().toLowerCase();
        const campusIndex = campuses.findIndex(campus => campus.toLowerCase() == value);
        const organizationField = document.querySelector('#org-input');
        organizationField.nextElementSibling.innerHTML = '';

        organizations_byCampus = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

        if (campusIndex !== -1) {
            AdditionalOrganizationsList(campuses[campusIndex]);
        };
    }
    else if (input.name.includes('Job Classification')) {
        if (jobclassifications.includes(input.value)) {
            const jobIndex = jobclassifications.indexOf(input.value);
            jobclassifications.splice(jobIndex, 1);
        }
    } else if (input.name == 'Ideal Location') {
        validateIdeal_Location(input);
    }
}

async function loadCampuses() {
    try {
        const response = await fetch('../JSON/campuses.json');
        const data = await response.json();
        return data.campuses;
    } catch (error) {
        console.error("Failed to Load Campuses: ", error);
        return [];
    }
}

async function loadDepartments() {
    try {
        const response = await fetch('../JSON/departments.json');
        const data = await response.json();
        return Object.keys(data.departments);
    } catch (error) {
        console.error("Failed to Load Departments: ", error);
        return [];
    }
}

async function getCoursesList(selectedDepartment) {
    try {
        const response = await fetch('../JSON/departments.json');
        const data = await response.json();
        courses = Object.values(data.departments[selectedDepartment]);
    } catch (error) {
        console.error('Failed to Load Courses: ', error);
        courses = [];
    }
}

async function getOrganizationsList(selectedDepartment) {
    try {
        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();

        if (data.organizations && data.organizations[selectedDepartment]) {
            organizations_byDepartment = Object.values(data.organizations[selectedDepartment]);
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        }

    } catch (error) {
        console.error('Failed to Load Organizations: ', error);
        organizations_byDepartment = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
    }
}

async function AdditionalOrganizationsList(selectedCampus) {
    try {

        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();
        if (data.organizations && data.organizations[selectedCampus]) {
            organizations_byCampus = Object.values(data.organizations[selectedCampus]);
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        } else {
            organizations_byCampus = [];
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        }
    } catch (error) {
        console.error('Failed to Load Organizations: ', error);
        organizations_byCampus = [];
    }
}

async function defaultOrganizations() {
    try {
        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();
        return Object.values(data.organizations['University Wide Organizations']);
    } catch (error) {
        console.error("Failed to Load Organizations: ", error);
        return [];
    }
}

async function getLocationList() {
    try {
        const response = await fetch('../JSON/city_province.json');
        const data = await response.json();
        return data.cities_provinces;
    } catch (error) {
        console.error("Failed to Load City/Provinces: ", error);
        return [];
    }
}

async function getJobClassificationList(selectedDepartment) {

    try {
        const response = await fetch('../JSON/internPositions.json');

        const data = await response.json();
        jobclassifications = Object.values(data.job_classifications_by_department[selectedDepartment]);
        jobclassifications_before = [...jobclassifications];

    } catch (error) {
        console.error('Failed to Load Courses: ', error);
        jobclassifications = [];
        jobclassifications_before = jobclassifications;
    }

}
function submitTheForm(button) {
    // thirdInputs.forEach(input => {
    //     validateThirdInputs(input);
    // });
    // if(Object.values(thirdInputs_Validation).every(Boolean)){
    //     // form.submit();
    //     console.log(userInformation);
    // }

    if (idealLocation_Valid) userInformation['Ideal Location'] = idealLocation_Input.value.trim();
    if (selectedTags) userInformation['Tags'] = [...selectedTags];
    console.log(userInformation);
    Register_Student();
}
// function validateThirdInputs(input){
function validateIdeal_Location(input) {
    if (input !== null) {
        // switch(input.name){
        //     case 'Job Classification 1':
        //         if(!checkIfEmpty_General(input)){
        //             thirdInputs_Validation[`is${input.name}Valid`] = false;
        //         }else{
        //             autoCorrect_Suggestions(input, jobclassifications_before, thirdInputs_Validation);
        //         }
        //         break;
        //     case 'Job Classification 2':
        //         if(!checkIfEmpty_General(input)){
        //             thirdInputs_Validation[`is${input.name}Valid`] = false;
        //         }else{
        //             autoCorrect_Suggestions(input, jobclassifications_before, thirdInputs_Validation);
        //         }
        //         break;
        //     case 'Job Classification 3':
        //         if(!checkIfEmpty_General(input)){
        //             thirdInputs_Validation[`is${input.name}Valid`] = false;
        //         }else{
        //             autoCorrect_Suggestions(input, jobclassifications_before, thirdInputs_Validation);
        //         }
        //         break;  

        //     case 'Ideal Location':
        if (!checkIfEmpty_General(input)) {
            idealLocation_Valid = false;
        } else {
            autoCorrect_Suggestions(input, locations, idealLocation_Valid);
        }
        //             break;
        //     }
    }
}

// thirdInputs.forEach(input =>{
idealLocation_Input.addEventListener('blur', async () => {
    validateIdeal_Location(idealLocation_Input);
});
idealLocation_Input.addEventListener('focus', async () => {
    removeError(idealLocation_Input);
});
idealLocation_Input.addEventListener('input', async () => {
    removeError(idealLocation_Input);
});
// });

window.addEventListener('DOMContentLoaded', async e => {

    const suggestionsContainer = document.querySelectorAll('.suggestions');
    campuses = await loadCampuses();
    departments = await loadDepartments();
    organizations_defaul = await defaultOrganizations();
    locations = await getLocationList();
    organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

    secondInputs.forEach(async (input) => {
        // Skip suggestions logic for school email input since it has a verify button as nextElementSibling
        if (input.id === 'schoolEmail-input') {
            return; // Exit early, no suggestions needed for school email
        }

        let list = []
        input.addEventListener('focus', (e) => {
            switch (input.name.toLowerCase()) {
                case 'university/campus':
                    list = campuses;
                    break;
                case 'department':
                    list = departments;
                    break;
                case 'course':
                    list = courses;
                    break;
                case 'organization':
                    list = organizations;
                    break;
            }
            suggestionsContainer.forEach(container => {
                container.classList.remove('active');
            });
            lastFocusedElement = e.target;
            LoadList(e.target, list);
        });

        input.addEventListener('input', async (e) => {
            // Skip suggestions logic for school email input
            if (input.id === 'schoolEmail-input') {
                return;
            }

            if (input.name == 'Department') {
                const value = input.value.trim().toLowerCase();
                const depIndex = departments.findIndex(dep => dep.toLowerCase() == value);
                const courseField = document.querySelector('#course-input');
                courseField.nextElementSibling.innerHTML = '';
                courseField.value = '';
                courses = [];

                const organizationField = document.querySelector('#org-input');
                organizationField.nextElementSibling.innerHTML = '';
                organizations_byDepartment = [];

                // thirdInputs.forEach((input, index) => {
                //     if(index <=2 ){
                //         input.value = '';
                //         jobclassifications = [];
                //         input.nextElementSibling.innerHTML = '';
                //     }
                // });

                if (depIndex !== -1) {
                    courses = await getCoursesList(departments[depIndex]);
                    organizations_byDepartment = await getOrganizationsList(departments[depIndex]);
                    await getJobClassificationList(departments[depIndex]);
                };
            }
            else if (input.name == 'University/Campus') {
                const organizationField = document.querySelector('#org-input');
                organizationField.nextElementSibling.innerHTML = '';
                organizations_byCampus = [];

                const value = input.value.trim().toLowerCase();
                const campusIndex = campuses.findIndex(campus => campus.toLowerCase() == value);
                if (campusIndex !== -1) {
                    organizations_byCampus = await AdditionalOrganizationsList(campuses[campusIndex]);
                };
            };
            let list = [];
            switch (input.name.toLowerCase()) {
                case 'university/campus':
                    list = campuses;
                    break;
                case 'department':
                    list = departments;
                    break;
                case 'course':
                    list = courses;
                    break;
                case 'organization':
                    list = organizations;
                    break;
            }
            LoadList(e.target, list);
            inputValidation_SecondSection(input)
        });
    });

    // thirdInputs.forEach(async (input,index)=>{
    let list = [];
    // if(index <= 2){
    //     input.addEventListener('focus', (e) => {
    //         list = jobclassifications;
    //         suggestionsContainer.forEach(container => {
    //             container.classList.remove('active');
    //         });
    //         LoadList(e.target, list);
    //     });

    //     input.addEventListener('input', async (e) => {
    //         list = jobclassifications;
    //         LoadList(e.target, list);
    //         validateThirdInputs(input);
    //         inputValidation_SecondSection(input);
    //     });
    // }else{
    idealLocation_Input.addEventListener('focus', (e) => {
        list = locations;
        suggestionsContainer.forEach(container => {
            container.classList.remove('active');
        });
        LoadList(e.target, list);
    });

    idealLocation_Input.addEventListener('input', async (e) => {
        list = locations;
        LoadList(e.target, list);
        // validateThirdInputs(input);
        validateIdeal_Location(idealLocation_Input)
        inputValidation_SecondSection(idealLocation_Input);
    });
    //     }

    // })
    const form_container = document.querySelector('.form-container');
    const form_children = document.querySelectorAll('.form-container  > div');
    const toggle_container = document.querySelector('.toggle-container');
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
    }

    setupEmailEditListeners();
});

function setupEmailEditListeners() {
    const personalEmailInput = document.querySelector('#email-input');
    const schoolEmailInput = document.querySelector('#schoolEmail-input');

    personalEmailInput.addEventListener('input', () => {
        if (emailVerificationState.personalEmail) {
            emailVerificationState.personalEmail = false;
            document.querySelector('#verify-personal-email-btn').style.display = 'flex';
            document.querySelector('#personal-email-verified').style.display = 'none';
            delete userInformation['Email Verified'];
        }
    });

    schoolEmailInput.addEventListener('input', () => {
        if (emailVerificationState.schoolEmail) {
            emailVerificationState.schoolEmail = false;
            document.querySelector('#verify-school-email-btn').style.display = 'flex';
            document.querySelector('#school-email-verified').style.display = 'none';
            delete userInformation['School Email Verified'];
        }
    });
}


// ==================== EMAIL VERIFICATION FUNCTIONS ====================

async function initiateEmailVerification(emailType) {
    if (emailType === 'personal') {
        const emailInput = document.querySelector('#email-input');
        const email = emailInput.value.trim();

        // Validate email format first
        const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;

        if (!email) {
            showError(emailInput, 'Please enter an email address');
            return;
        }
        if (!validEmail_RegEx.test(email)) {
            showError(emailInput, 'Invalid email format');
            return;
        }
        if (validSchoolEmail_RegEx.test(email.toLowerCase())) {
            showError(emailInput, 'Please use your personal email, not school email');
            return;
        }

        currentVerifyingEmail = email;
        currentVerifyingEmailType = emailType;
        openOTPModal();

    } else if (emailType === 'school') {
        const emailInput = document.querySelector('#schoolEmail-input');
        const email = emailInput.value.trim();

        // Validate school email format
        const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;

        if (!email) {
            showError(emailInput, 'Please enter your school email');
            return;
        }
        if (!validSchoolEmail_RegEx.test(email.toLowerCase())) {
            showError(emailInput, 'Invalid school email format');
            return;
        }

        // Check if matches student number
        const studentNumber = document.querySelector('#studNum-input').value.trim();

        // Check availability first
        const isStudentNumberAvailable = await ifStudentNumber_Exist();
        if (!isStudentNumberAvailable) {
            return;
        }

        if (studentNumber) {
            const studentNumber_substr = email.toLowerCase().slice(0, 10);
            if (studentNumber !== studentNumber_substr) {
                showError(emailInput, 'School email must match your student number');
                return;
            }
        }

        currentVerifyingEmail = email;
        currentVerifyingEmailType = emailType;
        openOTPModal();
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
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        // Remove existing event listeners by cloning
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });

    // Re-select after cloning
    const freshInputs = document.querySelectorAll('.otp-input');

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
    const otpInputs = document.querySelectorAll('.otp-input');
    let otpCode = '';

    otpInputs.forEach(input => {
        otpCode += input.value;
    });

    if (otpCode.length !== 6) {
        showOTPError('Please enter all 6 digits');
        otpInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('error');
            }
        });
        return;
    }

    // For demo: Accept any 6-digit code
    // In production: Make API call to validate OTP

    // Simulate API call
    setTimeout(() => {
        // Success! Mark email as verified
        markEmailAsVerified(currentVerifyingEmailType);
        closeOTPModal();
        ToastSystem.show('Email verified successfully!', 'success');
    }, 500);
}

function markEmailAsVerified(emailType) {
    if (emailType === 'personal') {
        emailVerificationState.personalEmail = true;

        const verifyBtn = document.querySelector('#verify-personal-email-btn');
        const verifiedBadge = document.querySelector('#personal-email-verified');
        const emailInput = document.querySelector('#email-input');

        verifyBtn.style.display = 'none';
        verifiedBadge.style.display = 'flex';
        // emailInput.setAttribute('readonly', true);

        userInformation['Email Verified'] = true;

    } else if (emailType === 'school') {
        emailVerificationState.schoolEmail = true;

        const verifyBtn = document.querySelector('#verify-school-email-btn');
        const verifiedBadge = document.querySelector('#school-email-verified');
        const emailInput = document.querySelector('#schoolEmail-input');

        verifyBtn.style.display = 'none';
        verifiedBadge.style.display = 'flex';
        // emailInput.setAttribute('readonly', true);

        userInformation['School Email Verified'] = true;
    }
}

function resendOTP() {
    const resendBtn = document.querySelector('#resendOtpBtn');
    const resendText = document.querySelector('#resendText');

    if (resendTimer) {
        return; // Already counting down
    }

    // For demo: Just show success message
    // In production: Make API call to resend OTP
    ToastSystem.show('Code resent successfully!', 'info');

    // Start countdown
    resendCountdown = 60;
    resendBtn.disabled = true;

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
    const errorDiv = document.querySelector('#otpErrorMessage');
    const errorText = document.querySelector('#otpErrorText');

    errorText.textContent = message;
    errorDiv.style.display = 'block';
}

function hideOTPError() {
    const errorDiv = document.querySelector('#otpErrorMessage');
    errorDiv.style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.querySelector('#otpModalOverlay');
    if (e.target === modal) {
        closeOTPModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('#otpModalOverlay');
        if (modal && modal.style.display === 'flex') {
            closeOTPModal();
        }
    }
});
