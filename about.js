// Ensure the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body; // Reference to the body element

    // Handle close button for mobile menu dynamically
    // We'll create it once and manage its lifecycle directly.
    let closeMenuBtn = null; // Initialize to null

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            body.classList.toggle('no-scroll');

            if (navLinks.classList.contains('show')) {
                // Create and prepend close button if it doesn't exist yet
                if (!closeMenuBtn) {
                    closeMenuBtn = document.createElement('button');
                    closeMenuBtn.classList.add('close-menu');
                    closeMenuBtn.setAttribute('aria-label', 'Close navigation');
                    closeMenuBtn.innerHTML = '<i class="fas fa-times"></i>'; // Assumes Font Awesome
                    navLinks.prepend(closeMenuBtn); // Add close button inside nav-links
                    closeMenuBtn.addEventListener('click', closeMobileMenu);
                }
            } else {
                // If the menu is closing, remove the close button from the DOM
                if (closeMenuBtn) {
                    closeMenuBtn.removeEventListener('click', closeMobileMenu); // Remove listener first
                    closeMenuBtn.remove(); // Remove element from DOM
                    closeMenuBtn = null; // Reset reference
                }
            }
        });

        // Function to close the mobile menu
        function closeMobileMenu() {
            navLinks.classList.remove('show');
            body.classList.remove('no-scroll');
            if (closeMenuBtn) { // Ensure button exists before trying to remove
                closeMenuBtn.removeEventListener('click', closeMobileMenu);
                closeMenuBtn.remove();
                closeMenuBtn = null;
            }
        }

        // Close menu when a link inside the mobile menu is clicked (good for UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu); // Re-use the close function
        });
    }


    // --- MODAL JAVASCRIPT LOGIC ---
    const modal = document.getElementById('curriculumModal');
    const openModalBtn = document.getElementById('openCurriculumModal');
    const closeModalBtn = modal ? modal.querySelector('.close-button') : null;

    function openModal() {
        if (modal) {
            modal.style.display = 'block';
            body.classList.add('no-scroll');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
            if (closeModalBtn) {
                closeModalBtn.focus();
            }
        }
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            body.classList.remove('no-scroll');
            modal.removeAttribute('aria-modal');
            modal.removeAttribute('role');
            if (openModalBtn) {
                openModalBtn.focus();
            }
        }
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });


    // --- Interactive Tabs Logic ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length > 0 && tabPanels.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 1. Remove 'active' from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 2. Add 'active' to the clicked button
                this.classList.add('active');

                // 3. Hide all panels
                tabPanels.forEach(panel => panel.classList.remove('active'));
                // 4. Show the corresponding panel
                const targetTabId = this.dataset.tab;
                const targetPanel = document.getElementById(targetTabId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        // Ensure the first tab is active on load if none are explicitly marked
        const activeTab = document.querySelector('.tab-button.active');
        if (!activeTab && tabButtons.length > 0) {
            tabButtons[0].click(); // Simulate click on the first button
        }
    }


    // --- AOS Initialization ---
    // It's best to initialize AOS after all other DOM-related scripts have run.
    AOS.init({
        duration: 1000, // global duration for AOS animations
        once: false,    // <<<<<< Changed to false to make animations replay on scroll
    });

}); // End of DOMContentLoaded