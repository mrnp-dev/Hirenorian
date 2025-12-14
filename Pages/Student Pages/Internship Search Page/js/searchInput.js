// searchInput.js - Handle search input with debouncing

let searchTimeout = null;
let currentKeyword = '';

export function initSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.warn('[SearchInput] Search input not found');
        return;
    }

    console.log('[SearchInput] Initializing search input');

    // Listen for input with debouncing
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();
        console.log('[SearchInput] Input changed:', keyword);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout (500ms debounce)
        searchTimeout = setTimeout(() => {
            currentKeyword = keyword;
            triggerSearch(keyword);
        }, 500);
    });

    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(searchTimeout);
            const keyword = e.target.value.trim();
            currentKeyword = keyword;
            triggerSearch(keyword);
        }
    });

    // Expose function to get current keyword
    window.getCurrentSearchKeyword = () => currentKeyword;

    console.log('[SearchInput] Search input initialized');
}

function triggerSearch(keyword) {
    console.log('[SearchInput] Triggering search with keyword:', keyword);

    // Dispatch custom event for search
    const searchEvent = new CustomEvent('searchTriggered', {
        detail: { keyword }
    });
    document.dispatchEvent(searchEvent);
}

// Export function to clear search
export function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        currentKeyword = '';
        triggerSearch('');
    }
}
