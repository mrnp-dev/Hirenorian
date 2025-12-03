# Main Account Registration Form - Modular JavaScript Structure

## Overview
The registration form JavaScript has been refactored into modular files for better organization, maintainability, and readability. Each file handles a specific aspect of the form functionality.

---

## File Structure & Dependencies

```
js/
├── formState.js                    # Global state variables
├── navigation.js                   # Step navigation & animations
├── errorHandling.js                # Error display & validation feedback
├── firstSectionValidation.js       # Personal information validation
├── secondSectionValidation.js      # Academic information validation
├── thirdSectionTags.js             # Ideal location & tag selection
├── dataLoader.js                   # JSON data loading
├── formSubmission.js               # Form submission & reset
├── loginPanel.js                   # Login panel & authentication
├── init.js                         # Initialization & event setup
└── main_registration.js            # (Original - can be removed)
```

---

## File Descriptions

### 1. **formState.js** - Global State Management
**Purpose:** Defines all global variables and form state

**Key Variables:**
- `userInformation` - Collects all user data during registration
- `currentStep` - Tracks position in multi-step form (0, 1, 2)
- `selectedTags` - Array of chosen working fields
- `secondInputs_Validation` - Tracks validation state of second section

**Usage:** Always load first, before other modules

---

### 2. **navigation.js** - Step Navigation & Animation
**Purpose:** Manages form section transitions and step indicators

**Key Functions:**
- `manageSteps(action)` - Updates step indicator (next/back)
- `goToPreviousSection(button)` - Navigate to previous form section
- `goBackToLandingPage()` - Exit form and return to landing page
- Event listeners for section animations

**Dependencies:** formState.js

---

### 3. **errorHandling.js** - Error Display & Messages
**Purpose:** Centralized error display and validation feedback

**Key Functions:**
- `showError(input, message)` - Display error below input
- `removeError(input)` - Hide error message
- `changePasswordStrength_text(element, strength)` - Show password strength feedback
- `confirmPassword(input)` - Validate matching passwords

**Usage:** Called by validation functions across all sections

---

### 4. **firstSectionValidation.js** - Personal Information Validation
**Purpose:** Validates Section 1: First Name, Last Name, Middle Initial, Suffix, Email, Phone, Password

**Key Validation Functions:**
- `checkFirst_Last_Name(input)` - Validate first/last names
- `validateMiddleInitial(input)` - Validate middle initial format
- `checkSuffix(input)` - Validate suffix (Jr., Sr., II, III, etc.)
- `checkEmail(input)` - Validate personal and school email
- `checkPhoneNumber(input)` - Validate Philippine phone numbers
- `checkPassword(input)` - Validate password length and strength
- `confirmPassword(input)` - Verify passwords match

**Navigation:**
- `goNext()` - Validates all fields and moves to section 2
- `firstInputsValidation()` - Runs all validations in parallel

**Dependencies:** formState.js, errorHandling.js

---

### 5. **secondSectionValidation.js** - Academic Information Validation
**Purpose:** Validates Section 2: Campus, Department, Course, Student Number, School Email, Organization

**Key Validation Functions:**
- `validateSecondInputs(input)` - Main validator for each field type
- `checkStudentNumber(input)` - Validate student ID format and year
- `ifStudentNumber_Exist()` - Check if student ID already registered
- `autoCorrect_Suggestions(input, list, validation)` - Auto-correct input to exact match

**Dropdown Management:**
- `LoadList(input, list)` - Filter and display suggestions
- `LoadSuggestions(input, list)` - Render clickable suggestion items
- `inputValidation_SecondSection(input)` - Handle special logic when inputs change

**Navigation:**
- `goToLast(button)` - Validate all fields and move to section 3

**Dependencies:** formState.js, errorHandling.js, dataLoader.js

---

### 6. **thirdSectionTags.js** - Career Interests & Tags
**Purpose:** Handles Section 3: Ideal Location and Working Field selection

**Key Functions:**
- `fetchCourseTags()` - Load available tags from JSON
- `renderTags(tags)` - Display selectable tags
- `toggleTag(tag, element)` - Add/remove tag selection (max 3)
- `updateSelectedCount()` - Update tag selection counter
- `updateTagsForSelectedCourse()` - Load tags for selected course
- `validateIdeal_Location(input)` - Validate ideal location field
- `submitTheForm(button)` - Final validation and form submission

**Dependencies:** formState.js, errorHandling.js

---

### 7. **dataLoader.js** - JSON Data Loading
**Purpose:** Loads all dropdown data from JSON files

**JSON Files Used:**
- `campuses.json` - List of campuses
- `departments.json` - Departments and their courses
- `organizations.json` - Organizations by department and campus
- `city_province.json` - Cities and provinces for location
- `internPositions.json` - Job classifications by department
- `courses_tags.json` - Working field tags by course

**Key Functions:**
- `loadCampuses()` - Load campus list
- `loadDepartments()` - Load department list
- `getCoursesList(department)` - Load courses for department
- `getOrganizationsList(department)` - Load org for department
- `AdditionalOrganizationsList(campus)` - Load org for campus
- `defaultOrganizations()` - Load university-wide organizations
- `getLocationList()` - Load all locations
- `getJobClassificationList(department)` - Load job types for department

**Dependencies:** formState.js

---

### 8. **formSubmission.js** - Form Submission & Reset
**Purpose:** Handles final form submission and complete form reset

**Key Functions:**
- `Register_Student()` - Send form data to backend
  - Success: Shows toast notifications and redirects to landing page
  - Failure: Shows error toast with message
- `resetFormState()` - Completely reset form to initial state
  - Clears all input values
  - Resets validation states
  - Hides all sections except first
  - Resets step indicators
  - Clears error messages

**Dependencies:** formState.js, navigation.js, errorHandling.js

---

### 9. **loginPanel.js** - Login & Sign-In/Up Toggle
**Purpose:** Manages login authentication and panel switching

**Key Functions:**
- `panelSwap()` - Toggle between sign-in and sign-up panels
- `check_LogIn_Fields()` - Validate login credentials and authenticate
  - Validates school email format
  - Sends credentials to backend
  - On success: Redirects to student dashboard
  - On failure: Shows error toast
- `checkLogged_Email(input)` - Validate PSU school email format
- `initializePanelToggle()` - Setup toggle button listeners

**Email Format:** `20YYNTNNNNNN@pampangastateu.edu.ph`

**Dependencies:** formState.js, errorHandling.js

---

### 10. **init.js** - Initialization & Setup
**Purpose:** Main initialization on page load, sets up all event listeners

**Key Operations:**
1. Load all dropdown data
2. Attach event listeners to second section inputs
3. Setup autocomplete suggestions
4. Handle special logic for dependent dropdowns (Department → Courses)
5. Initialize ideal location listeners
6. Setup login panel toggle

**Called On:** `DOMContentLoaded` event

**Dependencies:** All other modules

---

### 11. **main_registration.js** (Original)
**Status:** Can be removed or archived
**Reason:** All functionality has been refactored into modular files

---

## Loading Order (in HTML)

Load files in this specific order to resolve dependencies:

```html
<!-- State & Utilities -->
<script src="js/formState.js"></script>
<script src="js/errorHandling.js"></script>

<!-- Validation Modules -->
<script src="js/firstSectionValidation.js"></script>
<script src="js/secondSectionValidation.js"></script>
<script src="js/thirdSectionTags.js"></script>

<!-- Data & Server -->
<script src="js/dataLoader.js"></script>
<script src="js/loginPanel.js"></script>

<!-- Core Functionality -->
<script src="js/navigation.js"></script>
<script src="js/formSubmission.js"></script>

<!-- Initialization (Must be last) -->
<script src="js/init.js"></script>
```

---

## Common Modifications Guide

### Adding a New Required Field to Section 1

1. **Add HTML input** to form in `student_registrationForm.php`
2. **Add validation function** in `firstSectionValidation.js`
3. **Add case statement** in `checkIfValid()` function
4. **Add field-specific validator** function with detailed comments

Example:
```javascript
case 'my field':
    isValid = checkMyField(input);
    break;
```

### Adding a New Dropdown to Section 2

1. **Create JSON file** in `/JSON/` folder with data
2. **Add loader function** in `dataLoader.js`
3. **Update `loadCampuses()` or similar** to load new data
4. **Add validation case** in `validateSecondInputs()` in `secondSectionValidation.js`
5. **Add event listener setup** in `init.js`

### Modifying Error Messages

Find and update error messages in:
- `firstSectionValidation.js` - Section 1 errors
- `secondSectionValidation.js` - Section 2 errors
- `loginPanel.js` - Login errors

---

## Debugging Tips

1. **Check console for errors** - All modules log to console with descriptive messages
2. **Verify data loading** - Check `/JSON/` files exist and are valid JSON
3. **Test validation order** - Validate functions are called in correct sequence
4. **Check file load order** - JavaScript must load in dependency order

---

## Performance Notes

- JSON files are loaded once on page load (not on every change)
- Validation happens in parallel where possible
- Event delegation prevents memory leaks
- Suggestion dropdowns are created/destroyed dynamically

---

## Future Improvements

1. Consider converting to ES6 modules with import/export
2. Add unit tests for each validation function
3. Create shared utility functions file for repeated logic
4. Consider form builder pattern for better extensibility
5. Add form state persistence to localStorage

---

## Contact & Support

For questions about specific modules, check the detailed comments in each file.
Each function has JSDoc comments explaining parameters and return values.
