// Validation Functions

async function initialFirstInputs_Validations(input) {
    if (input.name !== 'Suffix') {
        return checkIfEmpty(input);
    } else {
        return checkIfValid(input);
    }
}

async function firstInputsValidation() {
    const firstInputs = document.querySelectorAll('#firstInputs input');
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
    const studentNumber_Input = document.querySelector('#studNum-input');

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

function checkWhiteSpaces(input) {
    const regExSpaces = /\s{2,}/;
    if (regExSpaces.test(input.value.trim())) {
        showError(input, `${input.name} contains to much spaces.`);
        return false;
    } else {
        return true;
    }
}

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

function validateIdeal_Location(input) {
    if (input !== null) {
        if (!checkIfEmpty_General(input)) {
            idealLocation_Valid = false;
        } else {
            autoCorrect_Suggestions(input, locations, idealLocation_Valid);
        }
    }
}
