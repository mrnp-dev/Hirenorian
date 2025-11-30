/**
 * =============================================================================
 * DATA LOADING FROM JSON FILES
 * =============================================================================
 * Loads dropdowndata (campuses, departments, courses, organizations, locations, jobs)
 */

/**
 * Loads list of all campuses
 * 
 * @returns {Promise<Array>} - Array of campus names
 */
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

/**
 * Loads list of all departments
 * 
 * @returns {Promise<Array>} - Array of department names
 */
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

/**
 * Loads courses for a specific department
 * Triggered when user selects a department
 * 
 * @param {string} selectedDepartment - Name of selected department
 * @returns {Promise<Array>} - Array of course names
 */
async function getCoursesList(selectedDepartment) {
    try {
        const response = await fetch('../JSON/departments.json');
        const data = await response.json();
        courses = Object.values(data.departments[selectedDepartment]);
        return courses;
    } catch (error) {
        console.error('Failed to Load Courses: ', error);
        courses = [];
        return courses;
    }
}

/**
 * Loads organizations associated with a department
 * 
 * @param {string} selectedDepartment - Name of selected department
 * @returns {Promise<Array>} - Array of organization names
 */
async function getOrganizationsList(selectedDepartment) {
    try {
        const response = await fetch('../JSON/organizations.json');
        const data = await response.json();

        if (data.organizations && data.organizations[selectedDepartment]) {
            organizations_byDepartment = Object.values(data.organizations[selectedDepartment]);
            organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        }
        return organizations_byDepartment;

    } catch (error) {
        console.error('Failed to Load Organizations: ', error);
        organizations_byDepartment = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];
        return organizations_byDepartment;
    }
}

/**
 * Loads organizations associated with a specific campus
 * 
 * @param {string} selectedCampus - Name of selected campus
 * @returns {Promise<Array>} - Array of organization names
 */
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
        return organizations_byCampus;
        
    } catch (error) {
        console.error('Failed to Load Organizations: ', error);
        organizations_byCampus = [];
        return organizations_byCampus;
    }
}

/**
 * Loads default (university-wide) organizations
 * These appear in all organization dropdowns
 * 
 * @returns {Promise<Array>} - Array of default organization names
 */
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

/**
 * Loads all available cities and provinces for location dropdown
 * 
 * @returns {Promise<Array>} - Array of location names
 */
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

/**
 * Loads job classifications available for a department
 * Used to suggest preferred job types to students
 * 
 * @param {string} selectedDepartment - Name of selected department
 */
async function getJobClassificationList(selectedDepartment) {
    try {
        const response = await fetch('../JSON/internPositions.json');
        const data = await response.json();
        
        jobclassifications = Object.values(data.job_classifications_by_department[selectedDepartment]);
        jobclassifications_before = [...jobclassifications];

    } catch (error) {
        console.error('Failed to Load Job Classifications: ', error);
        jobclassifications = [];
        jobclassifications_before = jobclassifications;
    }
}
