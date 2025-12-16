// Global State Variables
let companyTypes = [];
let industries = [];

// Email Verification State
let emailVerificationState = {
    companyEmail: false
};

let currentVerifyingEmail = null;
let currentVerifyingEmailType = null;
let resendTimer = null;
let resendCountdown = 60;

// User Information
let userInformation = {};

// Form Data Lists
// (None needed as they were student specific strings/arrays mostly replaced by above)

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
