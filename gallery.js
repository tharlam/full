document.addEventListener('DOMContentLoaded', function() {
    // --- Navigation Mobile Menu Logic (NEW) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body; // body constant already exists from lightbox logic

    // Create and append the close button for the mobile menu
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-menu');
    closeButton.innerHTML = '&times;'; // 'x' icon
    closeButton.setAttribute('aria-label', 'Close menu'); // Added for accessibility
    if (navLinks) { // Ensure navLinks exists before prepending
        navLinks.prepend(closeButton); // Add to the beginning of nav-links
    }


    // Toggle menu visibility
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
        });
    }

    // Close menu when close button is clicked
    if (closeButton && navLinks) {
        closeButton.addEventListener('click', function() {
            navLinks.classList.remove('show');
            body.classList.remove('no-scroll');
        });
    }

    // Close menu when a navigation link is clicked
    if (navLinks) { // Ensure navLinks exists before querying its children
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    body.classList.remove('no-scroll');
                }
            });
        });
    }


    // Close menu if clicked outside of it on mobile
    document.addEventListener('click', function(event) {
        // Ensure both navLinks and menuToggle exist before checking contains
        if (navLinks && menuToggle && navLinks.classList.contains('show') &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)) {
            navLinks.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });

    // Close menu if user resizes window to desktop view while menu is open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });


    // --- Lightbox Gallery Logic (EXISTING) ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentIndex = 0; // To keep track of the current image

    // Function to show a specific image in the lightbox
    function showImage(index) {
        if (index < 0 || index >= galleryItems.length) {
            return; // Do nothing if index is out of bounds
        }

        currentIndex = index;
        const currentItem = galleryItems[currentIndex];
        lightboxImg.src = currentItem.getAttribute('data-full-src');
        lightboxCaption.textContent = currentItem.alt;
        lightboxCounter.textContent = `${currentIndex + 1} of ${galleryItems.length}`;

        // Hide/Show navigation buttons based on current index
        if (currentIndex === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentIndex === galleryItems.length - 1) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }

    // Open lightbox when a gallery item is clicked
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImage(index); // Show the clicked image
            lightbox.classList.add('active');
            body.classList.add('no-scroll'); // Prevent body scrolling, consistent with nav logic
        });
    });

    // Close lightbox functions
    if (closeBtn) { // Added check for closeBtn existence
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            body.classList.remove('no-scroll'); // Restore body scrolling
        });
    }


    if (lightbox) { // Added check for lightbox existence
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) { // Clicked directly on the overlay
                lightbox.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }


    // Navigation buttons listeners
    if (prevBtn) { // Added check for prevBtn existence
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing lightbox if clicked on button
            showImage(currentIndex - 1);
        });
    }

    if (nextBtn) { // Added check for nextBtn existence
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing lightbox if clicked on button
            showImage(currentIndex + 1);
        });
    }


    // Keyboard navigation (Arrow Left/Right, Escape)
    document.addEventListener('keydown', (event) => {
        if (lightbox && lightbox.classList.contains('active')) { // Ensure lightbox exists
            if (event.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            } else if (event.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            } else if (event.key === 'Escape') {
                lightbox.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        }
    });

    // Basic Touch Swipe for mobile-like navigation
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) { // Ensure lightbox exists
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleGesture();
        });
    }

    function handleGesture() {
        const minSwipeDistance = 50; // Minimum pixels for a swipe to be recognized

        if (touchEndX < touchStartX - minSwipeDistance) {
            // Swiped Left (move to next image)
            showImage(currentIndex + 1);
        } else if (touchEndX > touchStartX + minSwipeDistance) {
            // Swiped Right (move to previous image)
            showImage(currentIndex - 1);
        }
    }
});