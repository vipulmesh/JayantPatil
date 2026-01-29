/**
 * Premium Webpage - Interactive Functionality
 * Handles the reveal animation for the secondary image
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const redeemButton = document.getElementById('redeemButton');
    const secondaryImage = document.getElementById('secondaryImage');
    
    // Track if button has been clicked
    let isRevealed = false;

    /**
     * Handle the redeem button click event
     */
    function handleRedeemClick() {
        // Prevent multiple clicks
        if (isRevealed) {
            return;
        }

        // Mark as revealed
        isRevealed = true;

        // Add visual feedback to button
        redeemButton.classList.add('clicked');
        redeemButton.textContent = 'Redeemed ✓';
        redeemButton.setAttribute('aria-pressed', 'true');

        // Reveal the secondary image with animation
        secondaryImage.classList.add('revealed');
        secondaryImage.setAttribute('aria-hidden', 'false');

        // Smooth scroll to bring the new image into view
        setTimeout(() => {
            secondaryImage.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);

        // Optional: Disable button after click
        setTimeout(() => {
            redeemButton.disabled = true;
            redeemButton.style.cursor = 'default';
        }, 600);
    }

    /**
     * Add event listener to the button
     */
    if (redeemButton && secondaryImage) {
        // Click event
        redeemButton.addEventListener('click', handleRedeemClick);

        // Keyboard accessibility - Enter and Space keys
        redeemButton.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleRedeemClick();
            }
        });
    } else {
        console.error('Required elements not found in the DOM');
    }

    /**
     * Optional: Add intersection observer for fade-in effects
     * This enhances the user experience on scroll
     */
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeInObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should fade in
        const elementsToObserve = document.querySelectorAll('.hero-image, .cta-button');
        elementsToObserve.forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Start observing
            fadeInObserver.observe(el);
        });
    }

    /**
     * Optional: Add ripple effect on button click
     */
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');

        // Remove existing ripples
        const existingRipple = button.getElementsByClassName('ripple')[0];
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple effect styling dynamically
    const style = document.createElement('style');
    style.textContent = `
        .cta-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add ripple effect to button
    redeemButton.addEventListener('mousedown', createRipple);

    /**
     * Log initialization for debugging
     */
    console.log('Premium webpage initialized successfully');
});

/**
 * Handle page visibility changes
 * Pause animations when page is not visible to save resources
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is hidden - animations paused');
    } else {
        console.log('Page is visible - animations resumed');
    }
});

/**
 * Optional: Add smooth scroll polyfill for older browsers
 */
if (!('scrollBehavior' in document.documentElement.style)) {
    // Smooth scroll polyfill would go here if needed
    console.log('Smooth scroll not supported - consider adding polyfill');
}