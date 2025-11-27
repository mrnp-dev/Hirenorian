const form = document.querySelector('form');
const title = document.querySelector('#title');
const firstInputs = document.querySelectorAll('#firstInputs input');
const firstInputs_Container = document.querySelector('#firstInputs');
const first_nextBtn = document.querySelector('#first_nextBtn');

const secondInputs_Container = document.querySelector('#secondInputs');
const secondInputs = document.querySelectorAll('#secondInputs input')
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
const thirdInputs = document.querySelectorAll('#thirdInputs input');
let jobclassifications = [];
let jobclassifications_before = [];
let locations = [];
let thirdInputs_Validation = [];


let userInformation = {};

const steps = document.querySelectorAll('.step');
const step_text = document.querySelectorAll('.step-text');
const step_icon = document.querySelectorAll('.step-icon');
let currentStep = 0;

function manageSteps(action){
    step_text[currentStep].classList.remove('left-active-text');
    step_icon[currentStep].classList.remove('left-active-icon');
    steps[currentStep].classList.remove('active-step');
    if(action == 'next'){
        currentStep++;
    }else{
        currentStep--;
    }
    steps[currentStep].classList.add('active-step');
    step_text[currentStep].classList.add('left-active-text');
    step_icon[currentStep].classList.add('left-active-icon');
}

firstInputs_Container.addEventListener('animationend', e =>{
    if(e.animationName == 'slideRight'){
        firstInputs_Container.classList.remove('slide-right');
        firstInputs_Container.style.display = 'none';
        secondInputs_Container.style.display = 'flex';
        secondInputs_Container.classList.add('slide-left');
        secondInputs_Container.classList.add('form-section');
        title.textContent = 'Display your Achievements';
    }
    
});

firstInputs.forEach(input =>{
    input.addEventListener('blur', async ()=>{
        initialFirstInputs_Validations(input);
    });
    input.addEventListener('focus', async ()=>{
        removeError(input);
    });
    input.addEventListener('input', async ()=>{
        if(input.name == "Password"){
            const confirmPass_field = document.querySelector('#confirmPass-input');
            if(input.value.trim().length >= 12){
                if(confirmPass_field.value.trim()){
                    confirmPassword(confirmPass_field);
                }
                checkPassword(input);
            }else{
                removeError(confirmPass_field);
                removeError(input);
            }
        }else if(input.name == "Confirm Password"){
            confirmPassword(input);
        }else{
            removeError(input);
        }
    });
});

async function initialFirstInputs_Validations(input){
    if(input.name !== 'Suffix'){
        return checkIfEmpty(input);
    }else{
        return checkIfValid(input);
    } 
    
}

async function goNext(){
    if(await firstInputsValidation()){
        firstInputs_Container.classList.remove('slide-left');
        firstInputs_Container.classList.add('slide-right');
        console.log(userInformation);
        manageSteps('next');
    }
}

async function firstInputsValidation() {
  const validations = await Promise.all(
                            Array.from(firstInputs).map(input => {
                                if(input.name !== 'Suffix'){
                                    return checkIfEmpty(input);
                                }else{
                                    return checkIfValid(input);
                                }     
                            })
                            );
  if(validations.every(Boolean)){
    return true;
  }else{
    return false;
  }
}

async function checkIfEmpty(input){
    const trimmedValue = input.value.trim();
    if(trimmedValue == ''){
        showError(input, `${input.name} cannot be empty`);
        return false;
    }else{
        return await checkIfValid(input);
    }
}

function showError(input, errorMessage){
    input.classList.add('input_InvalidInput');
    const section = input.closest(".input-wrapper");
    const errorElement = section.querySelector("p");
    errorElement.textContent = errorMessage;
    errorElement.style.color = 'red'; 
    errorElement.style.visibility = 'visible'; 
}
function removeError(input){
    input.classList.remove('input_InvalidInput');
    const section = input.closest(".input-wrapper");
    const errorElement = section.querySelector("p");
    errorElement.style.visibility = 'hidden';
}

async function checkIfValid(input){
    let isValid = true;
    switch(input.name.trim().toLowerCase()){
        case 'first name':
            isValid =  checkFirst_Last_Name(input);
            break;
        case 'last name':
            isValid = checkFirst_Last_Name(input);
            break;
        case 'middle initial':
            isValid = validateMiddleInitial(input);
            break;
        case 'suffix':
            isValid = checkSuffix(input);
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

function checkFirst_Last_Name(input){
    if(!checkNameLength(input)){
        return false;
    }else{
        return true;
    }
}

function capitalizeFirstLetter(input){
    const parts = input.value.split(" ");
    if(!parts.includes('')){
        return parts.map(part =>{
                return part[0].toUpperCase() + part.slice(1).toLowerCase();}).join(' ');
    }
}

function checkNameLength(input){
    const trimmedName = input.value.trim();
    if(trimmedName.length < 2 && trimmedName.length > 50){
        switch(input.name.trim().toLowerCase()){
            case 'first name':
                showError(input, `${input.name} must be between 2 and 50 characters.`);
                break;
            case 'last name':
                showError(input, `${input.name} must be between 2 and 50 characters.`);
                break;
        }
        return false;

    }else{
        if(checkWhiteSpaces(input)) return validateFirst_Last_Name(input);
    }
}

function validateFirst_Last_Name(input){
    const first_last_Name_regex = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s\-]{2,50}$/;

    if(!first_last_Name_regex.test(input.value)){
        showError(input, `${input.name} contains invalid characters.`);
        return false;
    }else{
        userInformation[input.name] = capitalizeFirstLetter(input);
        return true;
    }
}

function validateMiddleInitial(input){
    const middleInitial_regex =  /^[A-Za-z]\.?$/
    if(!middleInitial_regex.test(input.value)){
        showError(input, `Invalid ${input.name}.`);
        return false;
    }else{
        userInformation[input.name] = input.value.includes(".") ? 
                                                                input.value.toUpperCase() : 
                                                                input.value.toUpperCase() + ".";
        return true;
    }
}

function checkSuffix(input){
    const suffix_regex = /^(Jr\.?|Sr\.?|[A-Za-z]\.?|II|III|IV|V|VI|VII|VIII|IX|X)$/i;
    let valid = true;
    if(input.value.trim() !== ''){
        if(!suffix_regex.test(input.value)){
            showError(input, `Invalid ${input.name}.`);
            valid = false;
        }else{
            userInformation[input.name] = input.value.toUpperCase();
        }
    }
    return valid;
}

function checkEmail(input){
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]*@pampangastateu\.edu\.ph$/;
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(input.name == 'Email'){
        if(!validEmail_RegEx.test(input.value.trim())){
            showError(input, `Invalid Email`);
            return false;
        }else{
            if(validSchoolEmail_RegEx.test(input.value.trim().toLowerCase())){
                showError(input, `Not your School Email`);
                return false;
            }
            userInformation[input.name] = input.value;
            return true;
        }
    }else{
        if(!validSchoolEmail_RegEx.test(input.value.trim().toLowerCase())){
            return false;
        }else{
             const studentNumber_Input = document.querySelector('#studNum-input');
             const studentNumber_substr = input.value.trim().toLowerCase().slice(0, 10);
            if(studentNumber_Input.value.trim()){
                if(studentNumber_Input.value.trim() == studentNumber_substr){
                    userInformation[input.name] = input.value.toLowerCase();
                    return true;
                }else{
                    showError(input, `Use your own school email address`);
                    return true;
                }
            }
        }
    }
}

function checkPhoneNumber(input){
    const validPhoneNo_regex = /^(?:\+639\d{9}|09\d{9})$/;
    if(!validPhoneNo_regex.test(input.value.trim())){
        showError(input, `Invalid Philippine phone number.`);
        return false;
    }else{
         userInformation[input.name] = input.value;
        return true;
    }
}

async function checkPassword(input){ 
    const password_minLength = 12,
          password_maxLength = 64;
    if(input.value.length < password_minLength){
        showError(input, `${input.name} must contain atleast 12 characters.`);
        return false;
    }else if(input.value.length > password_maxLength){
        showError(input, `${input.name} must not exceed 64 characters.`);
        return false;
    }else{
        // try{
        //     const response = await fetch('../JSON/weakPasswords.json');
        //     const data = await response.json();
        //     if(data.weakPasswords.includes(input.value.toLowerCase())){
        //         showError(input, `Please choose a more secure password.`);
        //         return false;
        //     }else{
        //         return true;
        //     }
        // }catch(error){
        //     console.error("Error loading WeakPasswords:", error);
        //     return false;
        // }
        
        checkPasswordStrength(input);
        return true;
    }
}

function checkPasswordStrength(input) {
    const password = input.value;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecials = /[^a-zA-Z0-9]/.test(password);

    const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;
    changePasswordStrength_text(input, typesCount);
    
}
function changePasswordStrength_text(element, strength){
    const section = element.closest(".input-wrapper");
    const strength_P = section.querySelector("p");
    const span = document.createElement('span');
    strength_P.textContent = "strength: ";
    strength_P.style.color = "white";

    switch (strength) {
        case 1: 
            span.textContent = "weak";
            span.style.color = "red";
            break;
        case 2: 
            span.textContent = "medium";
            span.style.color = "orange";
            break;
        case 3: 
            span.textContent = "strong";
            span.style.color = "green";
            break;
    }
    strength_P.append(span);
    strength_P.style.visibility = 'visible'; 
}



function confirmPassword(input){
    
    const password = document.querySelector('#password-input').value;
    if(input.value !== password){
        showError(input, `Passwords do not match.`);
        return false;
    }else{
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

function toggleShow_Hide_Password(){
    const toggleButtons = document.querySelectorAll('.toggle_show_hide');
    toggleButtons.forEach(button => {
        const input_wrapper = button.closest('.input-wrapper');
        const eye = input_wrapper.querySelector('i');
        const passwordField = input_wrapper.querySelector('input');
        if(passwordField.type == 'password'){
            passwordField.type = 'text';
        }else{
            passwordField.type = 'password';
        }
        eye.classList.toggle('fa-eye');
        eye.classList.toggle('fa-eye-slash');
    });
}

function checkWhiteSpaces(input){
    const regExSpaces = /\s{2,}/;
    if (regExSpaces.test(input.value.trim())) {
        showError(input, `${input.name} contains to much spaces.`);
        return false;
    }else{
        return true;
    }
}  

function goToPreviousSection(button){
    const formSection = button.closest('.form-section');
    formSection.classList.remove('slide-left');
    formSection.classList.add('slide-right');
    secondBackButton_Action = button.textContent;
    manageSteps('back');
}

document.addEventListener('click', (e) => {
    if(!e.target.closest('.input-wrapper' || !e.target.closest('button'))){
        secondInputs.forEach(input => {
            input.nextElementSibling.classList.remove('active');
        });
        thirdInputs.forEach(input => {
            input.nextElementSibling.classList.remove('active');
        });
        validateSecondInputs(lastFocusedElement);
    }
});

secondInputs.forEach(input =>{
    input.addEventListener('blur', async ()=>{
        validateSecondInputs(input);
    });
    input.addEventListener('focus', async ()=>{
        removeError(input);
    });
    input.addEventListener('input', async ()=>{
        removeError(input);
    });
});

let secondBackButton_Action = '';
secondInputs_Container.addEventListener('animationend', e =>{
    if(!secondBackButton_Action){
        if(e.animationName == 'slideRight'){
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            thirdInputs_Container.style.display = 'flex';
            thirdInputs_Container.classList.add('slide-left');
            thirdInputs_Container.classList.add('form-section');
            title.textContent = 'Where do you see yourself?';
        }
    }else{
        secondBackButton_Action = '';
        if(e.animationName == 'slideRight'){
            secondInputs_Container.classList.remove('slide-right');
            secondInputs_Container.style.display = 'none';
            firstInputs_Container.style.display = 'flex';
            firstInputs_Container.classList.add('slide-left');
            firstInputs_Container.classList.add('form-section');
            title.textContent = 'Personalize your Profile';
        }
    }
});

function goToLast(button){
    secondInputs.forEach(input => {
        validateSecondInputs(input);
    });
    if(Object.values(secondInputs_Validation).every(Boolean)){
        secondInputs_Container.classList.remove('slide-left');
        secondInputs_Container.classList.add('slide-right');
        console.log(userInformation);
        manageSteps('next');
    }
}

thirdInputs_Container.addEventListener('animationend', e =>{
    if(e.animationName == 'slideRight'){
        thirdInputs_Container.classList.remove('slide-right');
        thirdInputs_Container.style.display = 'none';
        secondInputs_Container.style.display = 'flex';
        secondInputs_Container.classList.add('slide-left');
        secondInputs_Container.classList.add('form-section');
        title.textContent = 'Display your Achievements';
    }
    
});

function autoCorrect_Suggestions(input, list, validation){
    const index = list.findIndex(item => item.toLowerCase() === input.value.trim().toLowerCase());
    if (index !== -1) {
        input.value = list[index]
        validation[`is${input.name}Valid`] = true;
        userInformation[input.name] = input.value;
    } else {
        showError(input, `Invalid ${input.name}`);
        validation[`is${input.name}Valid`] = false;
    }
}

function validateSecondInputs(input){
    if(input !== null){
        switch(input.name){
            case 'University/Campus':
                if(!checkIfEmpty_General(input)){
                    secondInputs_Validation['isUniversity/CampusValid'] = false;
                }else{
                    autoCorrect_Suggestions(input, campuses, secondInputs_Validation);
                }
                break;
            case 'Department':
                if(!checkIfEmpty_General(input)){
                    secondInputs_Validation['isDepartmentValid'] = false;
                }else{
                    autoCorrect_Suggestions(input, departments, secondInputs_Validation);
                }
                break;
            case 'Course':
                if(!checkIfEmpty_General(input)){
                    secondInputs_Validation['isCourseValid'] = false;
                }else{
                    if(courses != []){
                        autoCorrect_Suggestions(input, courses, secondInputs_Validation);
                    }
                }
                break;  
  
            case 'Student Number':
                if(!checkIfEmpty_General(input)){
                    secondInputs_Validation['isStudentNumberValid'] = false;
                }else if(!checkStudentNumber(input)){
                    showError(input, `Invalid ${input.name}`);
                    secondInputs_Validation['isStudentNumberValid'] = false;
                }
                else{
                    secondInputs_Validation['isStudentNumberValid'] = true;
                }
                break;
            case 'School Email':
                if(!checkIfEmpty_General(input)){
                    secondInputs_Validation['isSchoolEmailValid'] = false;
                }else if(!checkEmail(input)){
                    showError(input, `Invalid ${input.name}`);
                    secondInputs_Validation['isSchoolEmailValid'] = false;
                }
                else{
                    secondInputs_Validation['isSchoolEmailValid'] = true;
                }
                break;

            case 'Organization':
                if(input.value.trim() !== ''){
                    autoCorrect_Suggestions(input, organizations, secondInputs_Validation);
                }else{
                    userInformation[input.name] = input.value;
                }
                break;
        }
    }
}

function checkIfEmpty_General(input){
    const trimmedValue = input.value.trim();
    if(trimmedValue == ''){
        showError(input, `${input.name} cannot be empty`);
        return false;
    }else{
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

    return true;
}

function LoadList(input, list){
    const value = input.value.trim().toLowerCase();

    if(value === ''){
        LoadSuggestions(input, list);
    }else{
        const filteredList = list.filter(item => item.toLowerCase().includes(value));
        LoadSuggestions(input, filteredList);
    }
}
function LoadSuggestions(input, list){
    const suggestionsContainer = input.nextElementSibling;
    suggestionsContainer.innerHTML = '';

    if(list.length === 0 || !list){
        const noItems = document.createElement('div');
        noItems.className = 'no-results';
        suggestionsContainer.append(noItems);
    }else{
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

async function inputValidation_SecondSection(input){
    if(input.name == 'Department'){   
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

        thirdInputs.forEach((input, index) => {
            if(index <=2 ){
                input.value = '';
                jobclassifications = [];
                input.nextElementSibling.innerHTML = '';
            }
        });
    

        if(depIndex !== -1){
            removeError(input);
            getCoursesList(departments[depIndex]);
            getOrganizationsList(departments[depIndex]);
            getJobClassificationList(departments[depIndex]);
        };
    }else if(input.name == 'University/Campus'){
        const value = input.value.trim().toLowerCase();
        const campusIndex = campuses.findIndex(campus => campus.toLowerCase() == value);
        const organizationField = document.querySelector('#org-input');
        organizationField.nextElementSibling.innerHTML = '';

        organizations_byCampus = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

        if(campusIndex !== -1){
            AdditionalOrganizationsList(campuses[campusIndex]);
        };
    }
    else if(input.name.includes('Job Classification')){
        if(jobclassifications.includes(input.value)){
            const jobIndex = jobclassifications.indexOf(input.value);
            jobclassifications.splice(jobIndex, 1);
        }
    }
}

async function loadCampuses() {
    try{
        const response = await fetch('../JSON/campuses.json');
        const data = await response.json();
        return data.campuses;
    }catch(error){
        console.error("Failed to Load Campuses: ", error);
        return [];
    }
}

async function loadDepartments() {
    try{
        const response = await fetch('../JSON/departments.json');
        const data = await response.json();
        return Object.keys(data.departments);
    }catch(error){
        console.error("Failed to Load Departments: ", error);
        return [];
    }
}

async function getCoursesList(selectedDepartment){
    try{
        const response = await fetch('../JSON/departments.json');
        const data = await response.json();
        courses = Object.values(data.departments[selectedDepartment]);
    }catch(error){
        console.error('Failed to Load Courses: ', error);
        courses = [];
    }
}

async function getOrganizationsList(selectedDepartment){
    try{
        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();

        if(data.organizations && data.organizations[selectedDepartment]){
            organizations_byDepartment = Object.values(data.organizations[selectedDepartment]);
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        }

    }catch(error){
        console.error('Failed to Load Organizations: ', error);
        organizations_byDepartment = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
    }
}

async function AdditionalOrganizationsList(selectedCampus){
    try{
        
        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();
        if(data.organizations && data.organizations[selectedCampus]){
            organizations_byCampus = Object.values(data.organizations[selectedCampus]);
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        }else{
            organizations_byCampus = [];
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        }
    }catch(error){
        console.error('Failed to Load Organizations: ', error);
        organizations_byCampus = [];
    }
}

async function defaultOrganizations(){
    try{
        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();
        return Object.values(data.organizations['University Wide Organizations']);
    }catch(error){
        console.error("Failed to Load Organizations: ", error);
        return [];
    }
}

async function getLocationList(){
    try{
        const response = await fetch('../JSON/city_province.json');
        const data = await response.json();
        return data.cities_provinces;
    }catch(error){
        console.error("Failed to Load City/Provinces: ", error);
        return [];
    }
}

async function getJobClassificationList(selectedDepartment){

        try{
            const response = await fetch('../JSON/internPositions.json');
            
            const data = await response.json();
            jobclassifications = Object.values(data.job_classifications_by_department[selectedDepartment]);
            jobclassifications_before = [...jobclassifications];

        }catch(error){
            console.error('Failed to Load Courses: ', error);
            jobclassifications = [];
            jobclassifications_before = jobclassifications;
        }

}
function submitTheForm(button){
    thirdInputs.forEach(input => {
        validateThirdInputs(input);
    });
    if(Object.values(thirdInputs_Validation).every(Boolean)){
        // form.submit();
        console.log(userInformation);
    }
}
function validateThirdInputs(input){
    if(input !== null){
        switch(input.name){
            case 'Job Classification 1':
                if(!checkIfEmpty_General(input)){
                    thirdInputs_Validation[`is${input.name}Valid`] = false;
                }else{
                    autoCorrect_Suggestions(input, jobclassifications_before, thirdInputs_Validation);
                }
                break;
            case 'Job Classification 2':
                if(!checkIfEmpty_General(input)){
                    thirdInputs_Validation[`is${input.name}Valid`] = false;
                }else{
                    autoCorrect_Suggestions(input, jobclassifications_before, thirdInputs_Validation);
                }
                break;
            case 'Job Classification 3':
                if(!checkIfEmpty_General(input)){
                    thirdInputs_Validation[`is${input.name}Valid`] = false;
                }else{
                    autoCorrect_Suggestions(input, jobclassifications_before, thirdInputs_Validation);
                }
                break;  

            case 'Ideal Location':
                if(!checkIfEmpty_General(input)){
                    thirdInputs_Validation[`is${input.name}Valid`] = false;
                }else{
                    autoCorrect_Suggestions(input, locations,thirdInputs_Validation);
                }
                break;
        }
    }
}

thirdInputs.forEach(input =>{
    input.addEventListener('blur', async ()=>{
        validateThirdInputs(input);
    });
    input.addEventListener('focus', async ()=>{
        removeError(input);
    });
    input.addEventListener('input', async ()=>{
        removeError(input);
    });
});

window.addEventListener('DOMContentLoaded', async e => {
    const suggestionsContainer = document.querySelectorAll('.suggestions');
    campuses = await loadCampuses();
    departments = await loadDepartments();
    organizations_defaul = await defaultOrganizations();
    locations = await getLocationList();
    organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

    secondInputs.forEach(async (input) => {
        let list = []
        input.addEventListener('focus', (e) => {
            switch(input.name.toLowerCase()){
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
            if(input.name == 'Department'){
                const value = input.value.trim().toLowerCase();
                const depIndex = departments.findIndex(dep => dep.toLowerCase() == value);
                const courseField = document.querySelector('#course-input');
                courseField.nextElementSibling.innerHTML = '';
                courseField.value = '';
                courses = [];

                const organizationField = document.querySelector('#org-input');
                organizationField.nextElementSibling.innerHTML = '';
                organizations_byDepartment = [];

                thirdInputs.forEach((input, index) => {
                    if(index <=2 ){
                        input.value = '';
                        jobclassifications = [];
                        input.nextElementSibling.innerHTML = '';
                    }
                });
                
                if(depIndex !== -1){
                    courses = await getCoursesList(departments[depIndex]);
                    organizations_byDepartment = await getOrganizationsList(departments[depIndex]);
                    await getJobClassificationList(departments[depIndex]);
                };
            }
            else if(input.name == 'University/Campus'){
                const organizationField = document.querySelector('#org-input');
                organizationField.nextElementSibling.innerHTML = '';
                organizations_byCampus = [];

                const value = input.value.trim().toLowerCase();
                const campusIndex = campuses.findIndex(campus => campus.toLowerCase() == value);
                if(campusIndex !== -1){
                    organizations_byCampus = await AdditionalOrganizationsList(campuses[campusIndex]);
                };
            };
            let list = [];
            switch(input.name.toLowerCase()){
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

    thirdInputs.forEach(async (input,index)=>{
        let list = [];
        if(index <= 2){
            input.addEventListener('focus', (e) => {
                list = jobclassifications;
                suggestionsContainer.forEach(container => {
                    container.classList.remove('active');
                });
                LoadList(e.target, list);
            });

            input.addEventListener('input', async (e) => {
                list = jobclassifications;
                LoadList(e.target, list);
                validateThirdInputs(input);
                inputValidation_SecondSection(input);
            });
        }else{
            input.addEventListener('focus', (e) => {
                list = locations;
                suggestionsContainer.forEach(container => {
                    container.classList.remove('active');
                });
                LoadList(e.target, list);
            });

            input.addEventListener('input', async (e) => {
                list = locations;
                LoadList(e.target, list);
                validateThirdInputs(input);
                inputValidation_SecondSection(input);
            });
        }
        
    })
});

