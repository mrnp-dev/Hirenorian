import * as Utils from "./ElementUtils.js";

/**
 * Initializes all viewport-based dimensions for elements
 */
function InitializeViewportDimensions()
{
    // Set max-height for sections (not width - sections use 100% width)
    Utils.SetMaxHeightToWindowHeight("header-section");
    Utils.SetMaxHeightToWindowHeight("main-section-1");
    Utils.SetMaxHeightToWindowHeight("main-section-2");
    Utils.SetMaxHeightToWindowHeight("main-section-3");
    Utils.SetMaxHeightToWindowHeight("main-section-4");
    
    // Set max-width for elements inside the sections
    Utils.SetMaxWidthToWindowWidth("navbar");
    Utils.SetMaxWidthToWindowWidth("find-career-section");
    Utils.SetMaxWidthToWindowWidth("headline-section");
}

// Initialize all viewport dimensions on page load
InitializeViewportDimensions();

// Resize listener is temporarily disabled to maintain initial dimensions when zooming
// To re-enable: uncomment the code below
// const debounce = (func, wait) => {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// };
// const debouncedResize = debounce(() => {
//     InitializeViewportDimensions();
// }, 150);
// window.addEventListener('resize', debouncedResize);