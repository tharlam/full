document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create and append the close button for the mobile menu
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-menu');
    closeButton.innerHTML = '&times;'; // 'x' icon
    closeButton.setAttribute('aria-label', 'Close menu'); // Added for accessibility
    navLinks.prepend(closeButton); // Add to the beginning of nav-links

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
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                body.classList.remove('no-scroll');
            }
        });
    });

    // Close menu if clicked outside of it on mobile
    // This requires checking if the click target is neither the nav links nor the menu toggle
    document.addEventListener('click', function(event) {
        // Check if the menu is open AND the click was outside the navLinks AND outside the menuToggle
        if (navLinks.classList.contains('show') &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)) {
            navLinks.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });

    // Close menu if user resizes window to desktop view while menu is open
    window.addEventListener('resize', function() {
        // Use a breakpoint that matches your CSS (e.g., 769px for desktop in your media queries)
        if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });

    // Initialize AOS Library
    // This will activate the data-aos animations in your HTML
    AOS.init({
        duration: 800, // Duration of animation (e.g., 800ms)
        once: false,   // Whether animation should only happen once - set to false to repeat
    });
});