// ========================================
// JOB LISTING STATE
// ========================================

window.JobListingApp = {
    // Data
    jobPostsData: [],
    jobDetailsCache: {},
    applicantsData: [],
    acceptedCountsCache: {},

    // State Variables
    viewMode: 'cards',
    selectedJobId: null,
    selectedJobForDetail: null,
    currentFilter: 'all',
    searchTerm: '',
    jobSearchTerm: '',
    selectedApplicants: new Set(),
    batchMode: false,

    // State Persistence Methods
    saveState: function () {
        const state = {
            viewMode: this.viewMode,
            selectedJobId: this.selectedJobForDetail || this.selectedJobId,
            currentFilter: this.currentFilter,
            searchTerm: this.searchTerm,
            jobSearchTerm: this.jobSearchTerm
        };
        sessionStorage.setItem('jobListingState', JSON.stringify(state));
    },

    loadState: function () {
        const savedState = sessionStorage.getItem('jobListingState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.viewMode) this.viewMode = state.viewMode;
                if (state.selectedJobId) {
                    this.selectedJobId = state.selectedJobId;
                    this.selectedJobForDetail = state.selectedJobId;
                }
                if (state.currentFilter) this.currentFilter = state.currentFilter;
                if (state.searchTerm !== undefined) this.searchTerm = state.searchTerm;
                if (state.jobSearchTerm !== undefined) this.jobSearchTerm = state.jobSearchTerm;
            } catch (e) {
                console.error("Error loading state:", e);
                sessionStorage.removeItem('jobListingState');
            }
        }
    }
};
