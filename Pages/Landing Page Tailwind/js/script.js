document.addEventListener('DOMContentLoaded', () => {
    // --- Hero Carousel Logic ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    const intervalTime = 5000;
    let slideInterval;

    function showSlide(index) {
        carouselItems.forEach(item => {
            item.classList.remove('active');
        });

        if (index < 0) {
            currentIndex = carouselItems.length - 1;
        } else if (index >= carouselItems.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        carouselItems[currentIndex].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    function startInterval() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval();


    // --- News Slider Logic (Single Slide) ---
    const newsSlider = document.getElementById('newsSlider');
    const newsPrev = document.getElementById('newsPrev');
    const newsNext = document.getElementById('newsNext');
    let newsIndex = 0;

    if (newsSlider && newsPrev && newsNext) {
        // Count immediate children for slides
        const newsSlides = newsSlider.children;
        const newsCount = newsSlides.length;

        function updateNewsSlider() {
            newsSlider.style.transform = `translateX(-${newsIndex * 100}%)`;
        }

        newsNext.addEventListener('click', () => {
            if (newsIndex < newsCount - 1) {
                newsIndex++;
            } else {
                newsIndex = 0;
            }
            updateNewsSlider();
        });

        newsPrev.addEventListener('click', () => {
            if (newsIndex > 0) {
                newsIndex--;
            } else {
                newsIndex = newsCount - 1;
            }
            updateNewsSlider();
        });
    }


    // --- Recommended Slider Logic ---
    const recSlider = document.getElementById('recSlider');
    const recPrev = document.getElementById('recPrev');
    const recNext = document.getElementById('recNext');

    if (recSlider && recPrev && recNext) {
        recNext.addEventListener('click', () => {
            recSlider.scrollBy({ left: 340, behavior: 'smooth' });
        });

        recPrev.addEventListener('click', () => {
            recSlider.scrollBy({ left: -340, behavior: 'smooth' });
        });
    }

    // --- Header Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    });
});
