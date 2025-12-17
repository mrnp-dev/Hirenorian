// Global State Variables
let selectedTags = [];
const maxSelection = 3;
let courseTagsData = {};

// Email Verification State
let emailVerificationState = {
    personalEmail: false,
    schoolEmail: false
};

let currentVerifyingEmail = null;
let currentVerifyingEmailType = null;
let resendTimer = null;
let resendCountdown = 60;

// User Information
let userInformation = {};

// Form Data Lists
let campuses = [];
let departments = [];
let courses = [];
let organizations = [];
let organizations_defaul = [];
let organizations_byDepartment = [];
let organizations_byCampus = [];
let jobclassifications = [];
let jobclassifications_before = [];
let locations = [];

// Validation State
let secondInputs_Validation = [];
let idealLocation_Valid = false;
let lastFocusedElement = null;

// Navigation State
let currentStep = 0;
let secondBackButton_Action = '';

// DOM Elements (assigned in main.js or used globally)
// Note: Many DOM elements are queried dynamically in functions, 
// but some might be useful to have globally if they are constant.
// For now, we keep the variable declarations that were global.
