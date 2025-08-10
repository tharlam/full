// donation.js

document.addEventListener('DOMContentLoaded', function() {
    const bankButtons = document.querySelectorAll('.bank-tab-button');
    const bankDetailsContents = document.querySelectorAll('.bank-details-content');

    // Function to show a specific tab
    function showBankDetails(bankType) {
        bankDetailsContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${bankType}-bank-details`).classList.add('active');
    }

    // Add click event listeners to bank tab buttons
    bankButtons.forEach(button => {
        button.addEventListener('click', function() {
            bankButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const bankType = this.dataset.bank;
            showBankDetails(bankType);
        });
    });

    // Initialize: Show the 'nepal' bank details by default on page load
    const initialActiveButton = document.querySelector('.bank-tab-button.active');
    if (initialActiveButton) {
        showBankDetails(initialActiveButton.dataset.bank);
    } else if (bankButtons.length > 0) {
        bankButtons[0].classList.add('active');
        showBankDetails(bankButtons[0].dataset.bank);
    }

    // --- New Copy to Clipboard Functionality ---
    const copyButtons = document.querySelectorAll('.copy-button');

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentLi = this.closest('li'); // Find the parent <li> element
            const copyTarget = parentLi.querySelector('.copy-target'); // Find the span with the number
            const copyMessage = parentLi.querySelector('.copy-message'); // Find the feedback message

            if (copyTarget) {
                const textToCopy = copyTarget.textContent.trim();

                // Use the modern Clipboard API
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Show "Copied!" message
                    if (copyMessage) {
                        copyMessage.classList.add('show');
                        setTimeout(() => {
                            copyMessage.classList.remove('show');
                        }, 2000); // Hide after 2 seconds
                    }
                    console.log('Text copied:', textToCopy);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback for older browsers or if Clipboard API is not available/permitted
                    // This older method might not work reliably in all contexts (e.g., within iframes)
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page
                    textarea.style.left = '-9999px'; // Hide off-screen
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        if (copyMessage) {
                            copyMessage.classList.add('show');
                            setTimeout(() => {
                                copyMessage.classList.remove('show');
                            }, 2000);
                        }
                        console.log('Text copied (fallback):', textToCopy);
                    } catch (err) {
                        console.error('Fallback copy failed: ', err);
                        alert('Could not copy text. Please copy manually: ' + textToCopy);
                    }
                    document.body.removeChild(textarea);
                });
            }
        });
    });
});