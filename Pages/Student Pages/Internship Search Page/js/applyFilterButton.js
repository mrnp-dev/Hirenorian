// applyFilterButton.js - Handle main Apply Filter button

export function initApplyFilterButton() {
    const applyBtn = document.querySelector('.btn-apply-filter');

    if (!applyBtn) {
        console.warn('[ApplyFilterButton] Apply filter button not found');
        return;
    }

    console.log('[ApplyFilterButton] Initializing apply filter button');

    applyBtn.addEventListener('click', () => {
        console.log('[ApplyFilterButton] Apply filter button clicked');

        // Dispatch search triggered event to apply all filters including keyword
        const searchEvent = new CustomEvent('searchTriggered', {
            detail: { keyword: window.getCurrentSearchKeyword ? window.getCurrentSearchKeyword() : '' }
        });
        document.dispatchEvent(searchEvent);
    });

    console.log('[ApplyFilterButton] Apply filter button initialized');
}
