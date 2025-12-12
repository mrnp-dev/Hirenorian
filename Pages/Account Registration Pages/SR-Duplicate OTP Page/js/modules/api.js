// API and Data Fetching Functions

async function fetchCourseTags() {
    try {
        const response = await fetch('../JSON/courses_tags.json');
        const data = await response.json();
        courseTagsData = data.tags;
    } catch (error) {
        console.error('Error fetching course tags:', error);
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

async function ifStudentNumber_Exist() {
    return fetch("http://158.69.205.176:8080/check_student_number.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInformation)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                const studentNumber_Input = document.querySelector('#studNum-input');
                showError(studentNumber_Input, "This Student ID is already registered");
                return false;
            } else {
                const studentNumber_Input = document.querySelector('#studNum-input');
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
