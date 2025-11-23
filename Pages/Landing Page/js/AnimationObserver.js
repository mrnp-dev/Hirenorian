/**
 * AnimationObserver - Handles scroll-triggered animations using IntersectionObserver
 */
export class AnimationObserver {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.15,
            ...options
        };

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );

        this.init();
    }

    init() {
        // Observe all elements with the animate-on-scroll class
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the in-view class to trigger animation
                entry.target.classList.add('in-view');

                // Optionally unobserve after animation (one-time animation)
                // Uncomment the line below if you want animations to play only once
                // this.observer.unobserve(entry.target);
            }
        });
    }
}

// Auto-initialize when module is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationObserver();
});
