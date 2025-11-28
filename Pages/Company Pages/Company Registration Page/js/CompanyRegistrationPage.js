
const firstPageInput = document.querySelectorAll('#p1 input');
const nextButton1 = document.getElementById('btn-next1');
const nextButton2 = document.getElementById('btn-next2');
const finishButton = document.getElementById('btn-3');
let companyPassword = "";
let fieldStatus1 = true;
let fieldStatus2 = true;
let fieldStatus3 = true;
const secondPageInput = document.querySelectorAll('#p2 input');
const thirdPageInput = document.querySelectorAll('#p3 input');

const pages = document.querySelectorAll(".p1, .p2, .p3");
const stepIndicators = document.querySelectorAll(".step");
let current = 0;



/* For next button */
function callButtonChecker() {
    firstPageInput.forEach(input => {
        if(input.value.trim() === '') {
            fieldStatus1 = false;
            showErrorMessage(input, 'empty field');
        } else {
            hideErrorMessage(input);
            fieldStatus1 = true;
        }
    });

}

function callButtonChecker2() {
    secondPageInput.forEach(input => {
        if(input.value.trim() === '') {
            fieldStatus2 = false;
            showErrorMessage(input, 'empty field');
        } else {
            hideErrorMessage(input);
            fieldStatus2 = true;
        }
    });
}

function callButtonChecker3() {
    thirdPageInput.forEach(input => {
        if(input.value.trim() === '') {
            fieldStatus3 = false;
            showErrorMessage(input, 'empty field');
        } else {
            hideErrorMessage(input);
            fieldStatus3 = true;
        }
    });
}


/* --- page 1 --- */
firstPageInput.forEach(input => {
    input.addEventListener('blur', async () => {
        if(input.name === 'email'){
            check_Email(input);
        } else if(input.name === 'password1') {
            checkCompanyPassword(input);
        } else if(input.name === 'password2') {
            checkConfirmCompanyPassword(input);
        } else if(input.name === 'phoneNum') {
            checkPhoneNum(input);
        }
    });

    input.addEventListener('focus', async () => {
        hideErrorMessage(input);
    });
    input.addEventListener('input', async () =>{
        hideErrorMessage(input);
    });
});


/* Functions */
function check_Email(input) {
    const correctEmailFormat_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const inputEmail = input.value.trim();

    if(inputEmail === '') {
        showErrorMessage(input, 'Company Email Cannot be Empty');
        return false;
    } else if(!correctEmailFormat_RegEx.test(inputEmail)) {
        showErrorMessage(input, "Invalid Email");
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    };
};

function checkCompanyPassword(input) {
    companyPassword = input.value;
    const companyPasswordHasLower = /[a-z]/.test(companyPassword);
    const companyPasswordHasUpper = /[A-Z]/.test(companyPassword);
    const companyPasswordHasSpecialChar = /[^A-Za-z0-9]/.test(companyPassword);
    const companyPasswordHasNumbers = /[0-9]/.test(companyPassword);

    if(companyPassword === '') {
        showErrorMessage(input, 'Company Password Cannot be Empty');
        return false;
    };

    if(companyPassword.length < 8) {
        showErrorMessage(input, 'Password must be at least 8 characters');
        return false;
    };

    if(!companyPasswordHasLower || !companyPasswordHasUpper) {
        showErrorMessage(input, 'Weak Password: use CAPITAL and lowercase Letters');
        return false;
    };
    
    if(!companyPasswordHasSpecialChar) {
        showErrorMessage(input, 'Weak Password: use Special Charcters / Symbols');
        return false;
    };
    
    if(!companyPasswordHasNumbers) {
        showErrorMessage(input, 'Weak Password: use Numeric Characters');
        return false;
    };
    
    hideErrorMessage(input);
    return true;
};

function checkConfirmCompanyPassword(input) {
    const companyPasswordConfirmation = input.value;
    let isSame = companyPassword.localeCompare(companyPasswordConfirmation);

    if(companyPasswordConfirmation === '') {
        showErrorMessage(input, 'Password Confirmation Cannot be Empty');
        return false;
    } ;
    
    if(isSame != 0) {
        showErrorMessage(input, 'Password Do Not Match')
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    };
};

function checkPhoneNum(input) {
    const PhoneNumber = input.value.trim();
    const correctPhoneNumber_RegEx = /^(?:\+639\d{9}|09\d{9})$/.test(PhoneNumber);

    if(PhoneNumber === '') {
        showErrorMessage(input, 'Company Phone Number Cannot be Empty');
        return false;
    } else if(!correctPhoneNumber_RegEx) {
        showErrorMessage(input, 'Invalid Philippine Phone Number')
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    }
};

/*Page 2 */
secondPageInput.forEach(input => {
    input.addEventListener('blur', async () => {
        if(input.name === 'companyName'){
            checkCompanyName(input);
        } else if(input.name === 'companyType') {
            checkCompanyType(input);
        } else if(input.name === 'industryType') {
            checkindustryType(input);
        } else if(input.name === 'companyAddress') {
            checkCompanyAddress(input);
        }
    })

    input.addEventListener('focus', async () => {
        hideErrorMessage(input);
    })
    input.addEventListener('input', async () =>{
        hideErrorMessage(input);
    } )
});

function checkCompanyName(input) {
    const companyName = input.value;

    if(companyName === '') {
        showErrorMessage(input, 'Company Name Cannot be Empty');
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    }
};

function checkCompanyType(input) {
    const companyType = input.value;

    if(companyType === '') {
        showErrorMessage(input, 'Company Type Cannot be Empty');
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    }
};

function checkindustryType(input) {
    const industryType = input.value;

    if(industryType === '') {
        showErrorMessage(input, 'Industry Cannot be Empty');
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    }
};

function checkCompanyAddress(input) {
    const companyAddress = input.value;

    if(companyAddress === '') {
        showErrorMessage(input, 'Company Address Cannot be Empty');
        return false;
    } else {
        hideErrorMessage(input);
        return true;
    }
};

/* LOAD JSON DATA */
async function loadCompanyType() {
    try{
        const response = await fetch('../json/CompanyType.json');
        const data = await response.json();
        return data.typesOfCompanies;
    }catch(error){
        console.error("Failed to Load Company Types: ", error);
        return [];
    }
};

async function loadIndustries() {
    try{
        const response = await fetch('../json/industry.json');
        const data = await response.json();
        return data.industries;
    }catch(error){
        console.error("Failed to Load Company Types: ", error);
        return [];
    }
};

/* Adding the data to html from json */
const inputCompanyType = document.querySelector('#companyType');
const dropdownDiv = inputCompanyType.nextElementSibling.nextElementSibling;

inputCompanyType.addEventListener('focus', async () => {
    const arrayCompanyTypes = await loadCompanyType();

    dropdownDiv.innerHTML = '';
    dropdownDiv.style.display = 'block';

    arrayCompanyTypes.forEach(compType => {
        const eachType = document.createElement('div');
        eachType.textContent = compType;
        eachType.classList.add('itemDropdown');
        dropdownDiv.appendChild(eachType);

        eachType.addEventListener('mousedown', () => {
            inputCompanyType.value = compType;
            dropdownDiv.style.display = 'none';
        });

    });
    
    inputCompanyType.addEventListener('blur', () => {
        dropdownDiv.style.display = 'none';
    });

});

const inputIndustry = document.querySelector('#industryType');
const dropdownDiv2 = inputIndustry.nextElementSibling.nextElementSibling;

inputIndustry.addEventListener('focus', async () => {
    const arrayIndustry = await loadIndustries();

    dropdownDiv2.innerHTML = '';
    dropdownDiv2.style.display = 'block';

    arrayIndustry.forEach(industryType => {
        const eachType = document.createElement('div');
        eachType.textContent = industryType;
        eachType.classList.add('itemDropdown');
        dropdownDiv2.appendChild(eachType);

        eachType.addEventListener('mousedown', () => {
            inputIndustry.value = industryType;
            dropdownDiv2.style.display = 'none';
        });

    });
    
    inputIndustry.addEventListener('blur', () => {
        dropdownDiv2.style.display = 'none';
    });

});


/* --- PAGE 3 --- */

thirdPageInput.forEach(input => {
    input.addEventListener('blur', async () => {
        if(input.name === 'contactEmail'){
            check_Email(input);
        } else if(input.name === 'contactPhone') {
            checkPhoneNum(input);
        } else if (input.name === 'contactName') {
            checkContactName(input);
        } else if (input.name === 'contactPosition') {
            checkContactPosition(input);
        }
    })

    input.addEventListener('focus', async () => {
        hideErrorMessage(input);
    })
    input.addEventListener('input', async () =>{
        hideErrorMessage(input);
    } )
});

function checkContactName(input) {
    const contactName = input.value;
    const contactNameHasSpecialChar = /[^A-Za-z0-9]/.test(contactName);

    if(contactName === '') {
        showErrorMessage(input, 'Name Cannot be Empty');
        return false;
    } else if(contactNameHasSpecialChar) {
        showErrorMessage(input, 'Invalid Name');
    } else {
        hideErrorMessage(input);
        return true;
    }
};

function checkContactPosition(input) {
    const contactPosition = input.value;
    const contactPositionHasSpecialChar = /[^A-Za-z0-9]/.test(contactPosition);

    if(contactPosition === '') {
        showErrorMessage(input, 'Position / Role Cannot be Empty');
        return false;
    } else if(contactPositionHasSpecialChar) {
        showErrorMessage(input, 'Invalid Position');
    } else {
        hideErrorMessage(input);
        return true;
    }
};

/* Prints / Hide Error Message*/
function showErrorMessage(input, message) {
    input.classList.add("error");
    const paragraphErrorMessage = input.nextElementSibling;
    paragraphErrorMessage.textContent = message;
    paragraphErrorMessage.style.display = "block";
};

function hideErrorMessage(input) {
    input.classList.remove("error");
    const paragraphErrorMessage = input.nextElementSibling;
    paragraphErrorMessage.textContent = "";
    paragraphErrorMessage.style.display = "none";
};


/* For Interactivity*/
document.addEventListener("DOMContentLoaded", () => {

    function showPage(n) {
        pages.forEach(p => p.classList.remove("active"));
        stepIndicators.forEach(s => s.classList.remove("active-step"));
        
        pages[n].classList.add("active");
        stepIndicators[n].classList.add("active-step");
    }
    showPage(current);

    nextButton1.addEventListener("click", () => {
        callButtonChecker();
        if (current < pages.length - 1 && (fieldStatus1 === true)) {
            current++;
            showPage(current);
        }
    });

    nextButton2.addEventListener("click", () => {
        callButtonChecker2();
        if (current < pages.length - 1 && (fieldStatus2 === true)) {
            current++;
            showPage(current);
        }
    });

    finishButton.addEventListener("click", () => {
        callButtonChecker3();
        if (current < pages.length - 1 && (fieldStatus3 === true)) {
            current++;
            showPage(current);
        }
    });

    document.querySelectorAll(".btn-back").forEach(btn => {
        btn.addEventListener("click", () => {
            if (current > 0) {
                current--;
                showPage(current);
            }
        });
    });
});