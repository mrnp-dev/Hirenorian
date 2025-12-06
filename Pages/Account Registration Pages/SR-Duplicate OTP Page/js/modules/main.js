// Main Initialization Script

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Data
    fetchCourseTags();
    campuses = await loadCampuses();
    departments = await loadDepartments();
    organizations_defaul = await defaultOrganizations();
    locations = await getLocationList();
    organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

    // DOM Elements
    const signUp_Inputs = document.querySelectorAll('.sign-in-container input');
    const form = document.querySelector('#signUp-Form');
    const title = document.querySelector('#title');
    const firstInputs = document.querySelectorAll('#firstInputs input');
    const firstInputs_Container = document.querySelector('#firstInputs');
    const first_nextBtn = document.querySelector('#first_nextBtn');
    const secondInputs_Container = document.querySelector('#secondInputs');
    const secondInputs = document.querySelectorAll('#secondInputs input');
    const thirdInputs_Container = document.querySelector('#thirdInputs');
    const idealLocation_Input = document.querySelector('#location-input');
    const signIn_Btn = document.getElementById('toggle-signIn-Btn');
    const signUp_Btn = document.getElementById('toggle-signUp-Btn');
    const suggestionsContainer = document.querySelectorAll('.suggestions');

    // Sign In Inputs Listeners
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
    });

    // First Inputs Listeners
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

    // Second Inputs Listeners
    secondInputs.forEach(async (input) => {
        // Skip suggestions logic for school email input since it has a verify button as nextElementSibling
        if (input.id === 'schoolEmail-input') {
            input.addEventListener('blur', async () => {
                validateSecondInputs(input);
            });
            input.addEventListener('focus', async () => {
                removeError(input);
            });
            input.addEventListener('input', async () => {
                removeError(input);
            });
            return;
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

        input.addEventListener('blur', async () => {
            validateSecondInputs(input);
        });

        input.addEventListener('input', async (e) => {
            // Skip suggestions logic for school email input
            if (input.id === 'schoolEmail-input') {
                removeError(input);
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

    // Ideal Location Listeners
    if (idealLocation_Input) {
        idealLocation_Input.addEventListener('blur', async () => {
            validateIdeal_Location(idealLocation_Input);
        });
        idealLocation_Input.addEventListener('focus', (e) => {
            removeError(idealLocation_Input);
            let list = locations;
            suggestionsContainer.forEach(container => {
                container.classList.remove('active');
            });
            LoadList(e.target, list);
        });
        idealLocation_Input.addEventListener('input', async (e) => {
            removeError(idealLocation_Input);
            let list = locations;
            LoadList(e.target, list);
            validateIdeal_Location(idealLocation_Input)
            inputValidation_SecondSection(idealLocation_Input);
        });
    }

    // Animation End Listeners
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

    // Toggle Buttons
    signUp_Btn.addEventListener('click', () => {
        panelSwap();
    });

    signIn_Btn.addEventListener('click', () => {
        panelSwap();
    });

    // Global Click Listener for Suggestions
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.input-wrapper') && !e.target.closest('button')) {
            secondInputs.forEach(input => {
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('suggestions')) {
                    input.nextElementSibling.classList.remove('active');
                }
            });
            if (idealLocation_Input && idealLocation_Input.nextElementSibling) {
                idealLocation_Input.nextElementSibling.classList.remove('active');
            }
            validateSecondInputs(lastFocusedElement);
        }
    });

    // Modal Listeners
    document.addEventListener('click', (e) => {
        const modal = document.querySelector('#otpModalOverlay');
        if (e.target === modal) {
            closeOTPModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('#otpModalOverlay');
            if (modal && modal.style.display === 'flex') {
                closeOTPModal();
            }
        }
    });

    // Initialize Email Edit Listeners
    setupEmailEditListeners();
});

// Helper for suggestions loading
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
    if (!suggestionsContainer || !suggestionsContainer.classList.contains('suggestions')) return;

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
