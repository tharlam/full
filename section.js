// This file contains all JavaScript logic for various interactive sections of your website.

document.addEventListener('DOMContentLoaded', () => {
    console.log("section.js loaded and DOMContentLoaded fired.");

    // --- All Functions and Variables are defined here, in the same scope ---

    // --- Initialize AOS (Animate On Scroll) Library ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
        });
        console.log("AOS initialized.");
    } else {
        console.warn("AOS library not found. Ensure it's linked in your HTML.");
    }

    // --- Banner Slider Functionality ---
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".nav-btn.prev-btn");
    const nextBtn = document.querySelector(".nav-btn.next-btn");

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove("active"));
        const normalizedIndex = (index % slides.length + slides.length) % slides.length;
        slides[normalizedIndex].classList.add("active");
        currentSlide = normalizedIndex;
    }
    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (slides.length > 0) {
        showSlide(0);
        // setInterval(nextSlide, 5000);
    }

    // --- Achievements Accordion Functionality ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            document.querySelectorAll('.accordion-item.active').forEach(openItem => {
                if (openItem !== accordionItem) {
                    openItem.classList.remove('active');
                }
            });
            accordionItem.classList.toggle('active');
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });

    // --- Facilities Tabbed Grid Functionality ---
    const tabButtons = document.querySelectorAll('.facilities-tabs-container .tab-btn');
    const facilityCards = document.querySelectorAll('.facilities-grid-content .facility-card');

    const filterFacilities = (category) => {
        facilityCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
                card.classList.add('hidden');
            }
        });
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    };
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            filterFacilities(category);
        });
    });
    const academicTabButton = document.querySelector('.facilities-tabs-container .tab-btn[data-category="academic"]');
    if (academicTabButton) {
        academicTabButton.click();
    }


    // --- FAQ Accordion Functionality ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== faqItem) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            faqItem.classList.toggle('active');
            if (faqItem.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            } else {
                faqAnswer.style.maxHeight = null;
            }
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });

    // --- Generic Modal Functionality ---
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    console.log(`[Modal Debug] Found ${modalTriggers.length} modal triggers on page load.`);
    const openModal = (modalId) => {
        console.log(`[Modal Debug] Attempting to open modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            console.log(`[Modal Debug] Modal element found for ID: ${modalId}. Adding 'active' class.`);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        } else {
            console.error(`[Modal Debug] ERROR: Modal element not found for ID: ${modalId}. Check HTML ID.`);
        }
    };
    const closeModal = (modalElement) => {
        if (modalElement) {
            console.log(`[Modal Debug] Attempting to close modal: ${modal.id}`);
            modalElement.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.modalTarget;
            console.log(`[Modal Debug] Click event detected on trigger. Target modal ID: ${modalId}`);
            openModal(modalId);
        });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelectorAll('.close-button, .modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                console.log(`[Modal Debug] Close button clicked for modal: ${modal.id}`);
                closeModal(modal);
            });
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log(`[Modal Debug] Clicked outside modal content for modal: ${modal.id}`);
                closeModal(modal);
            }
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                console.log(`[Modal Debug] Escape key pressed. Closing active modal: ${activeModal.id}`);
                closeModal(activeModal);
            }
        }
    });

    // --- Events Carousel and Read More Logic ---
    const carouselWrapper = document.querySelector('.card-carousel-wrapper');
    const slidesContainer = document.querySelector('.carousel-container');
    const eventSlides = document.querySelectorAll('.carousel-card');
    const prevButton = document.querySelector('.carousel-prev-button');
    const nextButton = document.querySelector('.carousel-next-button');
    const dots = document.querySelectorAll('.carousel-dot');

    let currentEventSlideIndex = 0;
    let eventSlideInterval;
    const totalEventSlides = eventSlides.length;

    // A variable to store the loaded translations
    let currentTranslations = {};

    // Helper function to get the current language from the HTML
    const getCurrentLanguage = () => {
        return document.documentElement.lang || 'en';
    };

    // Helper function to fetch translations from JSON
    async function fetchTranslations() {
        const lang = getCurrentLanguage();
        try {
            // **THIS PATH HAS BEEN CORRECTED**
            const response = await fetch(`./${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load translations for language: ${lang}`);
            }
            currentTranslations = await response.json();
            // Apply all translations on the page
            document.querySelectorAll('[data-i18n]').forEach(applyTranslation);
        } catch (error) {
            console.error(error);
            // Fallback to default language or show an error
        }
    }

    // Helper function to get a translated string from the loaded object
    function getTranslation(key) {
        return currentTranslations[key] || key;
    }

    // Helper function to update a single element's text
    function applyTranslation(element) {
        const key = element.getAttribute('data-i18n');
        if (key) {
            element.textContent = getTranslation(key);
        }
    }

    // Carousel Functions
    function updateEventCarousel(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index);
        });
    }

    function showEventSlide(index) {
        currentEventSlideIndex = (index + totalEventSlides) % totalEventSlides;
        const scrollPosition = eventSlides[currentEventSlideIndex].offsetLeft;
        slidesContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateEventCarousel(currentEventSlideIndex);
    }
    nextButton.addEventListener('click', () => {
        stopAutoEventSlide();
        showEventSlide(currentEventSlideIndex + 1);
        startAutoEventSlide();
    });
    prevButton.addEventListener('click', () => {
        stopAutoEventSlide();
        showEventSlide(currentEventSlideIndex - 1);
        startAutoEventSlide();
    });
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoEventSlide();
            showEventSlide(index);
            startAutoEventSlide();
        });
    });
    function startAutoEventSlide() {
        stopAutoEventSlide();
        eventSlideInterval = setInterval(() => {
            showEventSlide(currentEventSlideIndex + 1);
        }, 7000);
    }
    function stopAutoEventSlide() {
        clearInterval(eventSlideInterval);
    }
    carouselWrapper.addEventListener('mouseenter', stopAutoEventSlide);
    carouselWrapper.addEventListener('mouseleave', startAutoEventSlide);

    // Read More Logic
    const TEXT_MAX_HEIGHT_EM = 7.5;
    function setupReadMore() {
        const paragraphs = document.querySelectorAll('.card-content p');
        paragraphs.forEach(p => {
            const readMoreBtn = p.nextElementSibling;
            if (p.offsetHeight > (TEXT_MAX_HEIGHT_EM * 16) * 1.05 && readMoreBtn) {
                p.classList.add('collapsed');
                readMoreBtn.style.display = 'inline';
                applyTranslation(readMoreBtn); // Set initial button text from JSON
                readMoreBtn.addEventListener('click', () => {
                    const isCollapsed = p.classList.contains('collapsed');
                    p.classList.toggle('collapsed');
                    const newKey = isCollapsed ? 'read-less-btn' : 'read-more-btn';
                    readMoreBtn.setAttribute('data-i18n', newKey);

                    // Add this line to see what's happening
                    console.log(`Clicked! New key is: ${newKey}.`);

                    applyTranslation(readMoreBtn); // This should apply the new translation
                });
            } else if (readMoreBtn) {
                readMoreBtn.style.display = 'none';
            }
        });
    }

    // Final Initialization: Fetch translations, then set up the page
    fetchTranslations().then(() => {
        showEventSlide(0);
        startAutoEventSlide();
        setupReadMore();
    });
});