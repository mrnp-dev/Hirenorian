/**
 * =============================================================================
 * FORM STATE MANAGEMENT
 * =============================================================================
 * Manages all global variables and form state
 * Tracks user input, validation status, and navigation state
 */

// ============ USER INFORMATION ============
/** Stores all collected user information during registration */
let userInformation = {};

// ============ FORM NAVIGATION ============
/** Current step in the multi-step form (0, 1, 2) */
let currentStep = 0;

// ============ FIRST INPUT SECTION (Personal Information) ============
const form = document.querySelector('#signUp-Form');
const title = document.querySelector('#title');
const firstInputs = document.querySelectorAll('#firstInputs input');
const firstInputs_Container = document.querySelector('#firstInputs');
const first_nextBtn = document.querySelector('#first_nextBtn');

// ============ SECOND INPUT SECTION (Academic Information) ============
const secondInputs_Container = document.querySelector('#secondInputs');
const secondInputs = document.querySelectorAll('#secondInputs input');
const studentNumber_Input = document.querySelector('#studNum-input');

/** Validation state for second section inputs */
let secondInputs_Validation = [];

/** Tracks which element was last focused (for dropdown management) */
let lastFocusedElement = null;

/** Flag to determine back button action (distinguishes between back and next) */
let secondBackButton_Action = '';

// ============ THIRD INPUT SECTION (Career Information) ============
let thirdInputs_Container = document.querySelector('#thirdInputs');
const idealLocation_Input = document.querySelector('#location-input');

/** Tracks if ideal location has been validated */
let idealLocation_Valid = false;

// ============ STEP INDICATORS ============
const steps = document.querySelectorAll('.step');
const step_text = document.querySelectorAll('.step-text');
const step_icon = document.querySelectorAll('.step-icon');

// ============ DATA LISTS (from JSON) ============
let campuses = [];
let departments = [];
let courses = [];
let organizations = [];
let organizations_defaul = [];
let organizations_byDepartment = [];
let organizations_byCampus = [];
let locations = [];
let jobclassifications = [];
let jobclassifications_before = [];

// ============ TAG SELECTION (Working Fields) ============
let selectedTags = [];
const maxSelection = 3;
let courseTagsData = {};
const tagsContainer = document.querySelector('.tags-container');
const selectedCount = document.querySelector('.selected-count');
