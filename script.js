// ===== Smooth Scroll to Form =====
document.addEventListener('DOMContentLoaded', function() {
    const scrollToFormBtn = document.getElementById('scrollToForm');
    const formSection = document.getElementById('formSection');
    const successMessage = document.getElementById('successMessage');
    const googleForm = document.getElementById('googleForm');

    // Smooth scroll to form section
    if (scrollToFormBtn && formSection) {
        scrollToFormBtn.addEventListener('click', function() {
            formSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // ===== Form Submission Detection =====
    // Note: Google Forms don't trigger standard form events when embedded
    // This is a workaround to detect when user likely submitted the form
    
    // Method 1: Listen for URL changes in iframe (limited due to cross-origin)
    // Method 2: Show success message after a delay when form is interacted with
    
    let formInteracted = false;

    if (googleForm) {
        // Detect when user interacts with the form
        window.addEventListener('blur', function() {
            if (document.activeElement === googleForm) {
                formInteracted = true;
            }
        });

        // Check for Google Forms submission confirmation page
        // This works by detecting if the iframe URL changes to the confirmation page
        try {
            googleForm.addEventListener('load', function() {
                if (formInteracted) {
                    // Wait a bit to see if it's the confirmation page
                    setTimeout(function() {
                        try {
                            // Try to detect if it's the confirmation page
                            // Note: This may not work due to cross-origin restrictions
                            const iframeContent = googleForm.contentWindow.location.href;
                            if (iframeContent.includes('formResponse')) {
                                showSuccessMessage();
                            }
                        } catch (e) {
                            // Cross-origin restriction - this is expected
                            // You might want to implement alternative detection
                            console.log('Form submission detection limited by cross-origin policy');
                        }
                    }, 1000);
                }
            });
        } catch (e) {
            console.log('Form event listeners limited by cross-origin policy');
        }
    }

    // ===== Alternative: Manual Success Trigger =====
    // If automatic detection doesn't work, you can add a button
    // that users click after submitting the form
    
    // Uncomment this if you add a manual trigger button
    /*
    const manualSuccessBtn = document.getElementById('manualSuccessBtn');
    if (manualSuccessBtn) {
        manualSuccessBtn.addEventListener('click', function() {
            showSuccessMessage();
        });
    }
    */

    // ===== Show Success Message =====
    function showSuccessMessage() {
        if (googleForm && successMessage) {
            // Hide the form
            googleForm.style.display = 'none';
            
            // Show success message
            successMessage.classList.add('show');
            
            // Scroll to success message
            successMessage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });

            // Optional: Add confetti effect or celebration animation
            createConfetti();
        }
    }

    // ===== Confetti Effect =====
    function createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(function() {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.opacity = '1';
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.transition = 'all 3s ease-out';

                document.body.appendChild(confetti);

                // Animate confetti falling
                setTimeout(function() {
                    confetti.style.top = window.innerHeight + 'px';
                    confetti.style.opacity = '0';
                    confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                }, 10);

                // Remove confetti after animation
                setTimeout(function() {
                    confetti.remove();
                }, 3000);
            }, i * 30);
        }
    }

    // ===== Intersection Observer for Scroll Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards for animation on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // ===== Button Ripple Effect =====
    const buttons = document.querySelectorAll('.cta-button, .form-link-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ===== Loading State for Iframe =====
    if (googleForm) {
        const formWrapper = document.querySelector('.form-wrapper');
        
        // Add loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="width: 50px; height: 50px; border: 4px solid #f3f4f6; border-top: 4px solid #667eea; border-radius: 50%; margin: 0 auto 1rem; animation: spin 1s linear infinite;"></div>
                <p style="color: #6b7280;">Loading form...</p>
            </div>
        `;
        
        // Add spinner CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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
        
        formWrapper.insertBefore(loadingSpinner, googleForm);
        
        googleForm.addEventListener('load', function() {
            loadingSpinner.style.display = 'none';
        });
    }

    // ===== Scroll to Top Button (Optional Enhancement) =====
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect for scroll to top button
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    });

    // ===== Console Welcome Message =====
    console.log('%c👋 Welcome to Our Form Portal!', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'font-size: 14px; color: #6b7280;');
});

// ===== Prevent Right Click on Form (Optional Security) =====
// Uncomment if you want to prevent right-click on the form
/*
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.form-wrapper')) {
        e.preventDefault();
        return false;
    }
});
*/

// ===== Google Analytics (Optional) =====
// Add your Google Analytics tracking code here if needed
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR-GA-TRACKING-ID');
*/

// ===== Performance Monitoring =====
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Page loaded in ' + loadTime + 'ms');
    }
});
