// studentTags.js - Student-specific tag auto-selection functionality

let studentTags = [];
let isLoading = false;

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('filtersLoadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
        console.log('[StudentTags] Loading overlay shown');
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('filtersLoadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        console.log('[StudentTags] Loading overlay hidden');
    }
}

export async function loadStudentTags() {
    console.log('[StudentTags] Starting loadStudentTags...');

    // Show loading indicator
    isLoading = true;
    showLoadingOverlay();

    let checkedCount = 0; // Track number of auto-checked tags

    try {
        // Get student email from session storage
        const studentEmail = sessionStorage.getItem('email');
        console.log('[StudentTags] Session email:', studentEmail);

        if (!studentEmail) {
            console.warn('[StudentTags] No student email found in session storage');
            console.log('[StudentTags] Available session storage keys:', Object.keys(sessionStorage));
            hideLoadingOverlay();
            isLoading = false;
            return;
        }

        console.log('[StudentTags] Fetching student data from API...');
        const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_email: studentEmail })
        });

        console.log('[StudentTags] API response status:', response.status);
        const result = await response.json();
        console.log('[StudentTags] API result:', result);

        if (result.status === 'success' && result.data.basic_info) {
            const basic = result.data.basic_info;
            console.log('[StudentTags] Basic info:', basic);
            console.log('[StudentTags] Raw tags - tag1:', basic.tag1, 'tag2:', basic.tag2, 'tag3:', basic.tag3);

            // Get the three tags from Students table
            studentTags = [
                basic.tag1,
                basic.tag2,
                basic.tag3
            ].filter(tag => tag && tag.trim() !== ''); // Remove null/empty tags

            console.log('[StudentTags] Filtered student tags:', studentTags);
            console.log('[StudentTags] Number of tags:', studentTags.length);

            if (studentTags.length > 0) {
                console.log('[StudentTags] Calling autoCheckStudentTags...');
                checkedCount = autoCheckStudentTags();
            } else {
                console.warn('[StudentTags] No valid tags found to auto-check');
            }
        } else {
            console.error('[StudentTags] API returned error or missing basic_info:', result);
        }
    } catch (error) {
        console.error('[StudentTags] Failed to load student tags:', error);
        console.error('[StudentTags] Error details:', error.message, error.stack);
    } finally {
        console.log('[StudentTags] Auto-checked ' + checkedCount + ' matching tags');
        console.log('[StudentTags] Loading complete');

        // Dispatch event to trigger initial search with auto-selected tags
        if (checkedCount > 0) {
            console.log('[StudentTags] Dispatching initial search event');
            setTimeout(() => {
                const initialSearchEvent = new CustomEvent('initialSearchReady');
                document.dispatchEvent(initialSearchEvent);
            }, 500); // Small delay to ensure everything is initialized
        }

        // Hide loading indicator
        isLoading = false;
        hideLoadingOverlay();
    }
}

export function autoCheckStudentTags() {
    console.log('[StudentTags] Starting autoCheckStudentTags...');
    console.log('[StudentTags] Student tags to match:', studentTags);

    if (studentTags.length === 0) {
        console.warn('[StudentTags] No student tags to auto-check');
        return;
    }

    // Find all career tag checkboxes
    const careerTagCheckboxes = document.querySelectorAll('#careerTagsContainer input[type="checkbox"]');
    console.log('[StudentTags] Found checkboxes:', careerTagCheckboxes.length);

    if (careerTagCheckboxes.length === 0) {
        console.warn('[StudentTags] No career tag checkboxes found! UI may not be built yet.');
        return;
    }

    let matchedCount = 0;
    careerTagCheckboxes.forEach((checkbox, index) => {
        const tagValue = checkbox.value;
        // Check if this tag matches any of the student's tags (case-insensitive)
        const isMatch = studentTags.some(studentTag =>
            studentTag.toLowerCase() === tagValue.toLowerCase()
        );

        if (isMatch) {
            console.log(`[StudentTags] ✓ Match found: "${tagValue}" matches student tag`);
            checkbox.checked = true;
            matchedCount++;
        }
    });

    console.log(`[StudentTags] Auto-checked ${matchedCount} tags out of ${studentTags.length} student tags`);

    // Trigger update of selected filters
    if (matchedCount > 0) {
        console.log('[StudentTags] Triggering change event to update selected filters...');
        const changeEvent = new Event('change', { bubbles: true });
        careerTagCheckboxes[0].dispatchEvent(changeEvent);
    }

    return matchedCount; // Return the count of matched tags
}

export function isLoadingTags() {
    return isLoading;
}
