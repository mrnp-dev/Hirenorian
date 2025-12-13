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
        // Get tags from session storage (injected by PHP)
        const storedTags = sessionStorage.getItem('studentTags');
        console.log('[StudentTags] Session tags:', storedTags);

        if (storedTags) {
            try {
                studentTags = JSON.parse(storedTags);
                console.log('[StudentTags] Parsed tags from session:', studentTags);
            } catch (e) {
                console.error('[StudentTags] Error parsing session tags:', e);
                studentTags = [];
            }
        } else {
            console.warn('[StudentTags] No tags found in session storage');
            studentTags = [];
        }

        if (studentTags.length > 0) {
            console.log('[StudentTags] Calling autoCheckStudentTags...');
            checkedCount = await waitForCheckboxesAndCheck();
        } else {
            console.log('[StudentTags] No student tags to check');
        }

    } catch (error) {
        console.error('[StudentTags] Failed to load student tags:', error);
    } finally {
        console.log('[StudentTags] Auto-checked ' + checkedCount + ' matching tags');
        console.log('[StudentTags] Loading complete');

        // Dispatch event to trigger initial search with auto-selected tags
        // Dispatch even if count is 0, to just load all jobs or empty state?
        // Actually, if 0 tags, we might want to just show "all jobs" or "no jobs".
        // Current logic: if > 0 dispatch. If 0, maybe dispatch anyway to show *something*?
        // User said: "auto search all the jobs based on the 3 tags".
        // If no tags, maybe just default search?
        // Let's dispatch anyway so the page isn't empty.

        console.log('[StudentTags] Dispatching initial search event');
        setTimeout(() => {
            const initialSearchEvent = new CustomEvent('initialSearchReady');
            document.dispatchEvent(initialSearchEvent);
        }, 500);

        // Hide loading indicator
        isLoading = false;
        hideLoadingOverlay();
    }
}

// Helper to wait for checkboxes if they aren't rendered yet (though they should be)
async function waitForCheckboxesAndCheck() {
    return new Promise(resolve => {
        let attempts = 0;
        const check = () => {
            const careerTagCheckboxes = document.querySelectorAll('#careerTagsContainer input[type="checkbox"]');
            if (careerTagCheckboxes.length > 0) {
                resolve(autoCheckStudentTags());
            } else if (attempts < 10) {
                attempts++;
                setTimeout(check, 100);
            } else {
                console.warn('[StudentTags] Checkboxes never appeared');
                resolve(0);
            }
        };
        check();
    });
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
