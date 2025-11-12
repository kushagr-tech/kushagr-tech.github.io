// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initAnimatedCounters();
    initContactForm();
    initScrollAnimations();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated counters functionality
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.achievement-number');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            let step = 0;
            
            const updateCounter = () => {
                if (step < steps) {
                    current += increment;
                    step++;
                    
                    if (target === 98.2) {
                        counter.textContent = current.toFixed(1) + '%';
                    } else if (target === 30) {
                        counter.textContent = Math.ceil(current) + '%';
                    } else if (target === 2) {
                        counter.textContent = Math.ceil(current) + '+';
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    
                    setTimeout(updateCounter, duration / steps);
                } else {
                    // Set final values
                    if (target === 98.2) {
                        counter.textContent = '98.2%';
                    } else if (target === 30) {
                        counter.textContent = '30%';
                    } else if (target === 2) {
                        counter.textContent = '2+';
                    } else {
                        counter.textContent = '3';
                    }
                }
            };
            
            updateCounter();
        });
        
        hasAnimated = true;
    }

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, {
        threshold: 0.5
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        counterObserver.observe(aboutSection);
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    // If the form has an action (e.g., Formspree), validate then allow native submit
    if (form.getAttribute('action')) {
        form.addEventListener('submit', function(e) {
            // Read values
            const formData = new FormData(form);
            const name = (formData.get('name') || '').toString().trim();
            const email = (formData.get('email') || '').toString().trim();
            const subject = (formData.get('subject') || '').toString().trim();
            const message = (formData.get('message') || '').toString().trim();
            const phone = (formData.get('phone') || '').toString().trim();
            
            const errors = [];
            
            // Name
            if (!name) {
                errors.push('Name is required');
            } else if (name.length < 2) {
                errors.push('Name must be at least 2 characters');
            }
            
            // Email
            if (!email) {
                errors.push('Email is required');
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
            }
            
            // Subject
            if (!subject) {
                errors.push('Subject is required');
            } else if (subject.length < 3) {
                errors.push('Subject must be at least 3 characters');
            }
            
            // Message
            if (!message) {
                errors.push('Message is required');
            } else if (message.length < 10) {
                errors.push('Message must be at least 10 characters');
            }
            
            // Phone (optional)
            if (phone && !isValidPhone(phone)) {
                errors.push('Please enter a valid phone number');
            }
            
            if (errors.length > 0) {
                e.preventDefault();
                showMessage(errors.join('. '), 'error');
                // Trigger native UI hints if available
                form.reportValidity && form.reportValidity();
                return;
            }
            
            // Loading state while Formspree submits
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.dataset.originalText = originalText;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
            }
        });
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const project = formData.get('project').trim();
        
        // Validate form
        if (!validateForm(name, email, project)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Form validation
function validateForm(name, email, project) {
    const errors = [];
    
    if (!name) {
        errors.push('Name is required');
    }
    
    if (!email) {
        errors.push('Email is required');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!project) {
        errors.push('Project description is required');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('. '), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (simple, permissive for international formats)
function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    return phoneRegex.test(phone);
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    
    // Style the message
    const baseStyles = `
        padding: 16px 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid;
        animation: slideDown 0.3s ease-out;
        position: relative;
        z-index: 10;
    `;
    
    if (type === 'success') {
        messageEl.style.cssText = baseStyles + `
            background: rgba(33, 128, 141, 0.1);
            color: var(--color-teal-300);
            border-color: rgba(33, 128, 141, 0.3);
        `;
    } else {
        messageEl.style.cssText = baseStyles + `
            background: rgba(255, 84, 89, 0.1);
            color: var(--color-red-400);
            border-color: rgba(255, 84, 89, 0.3);
        `;
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    if (!document.querySelector('style[data-form-message]')) {
        style.setAttribute('data-form-message', 'true');
        document.head.appendChild(style);
    }
    
    // Insert message before form
    const form = document.getElementById('contact-form');
    const formWrapper = form.parentNode;
    formWrapper.insertBefore(messageEl, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply fade-in animation to cards and sections
    const animatedElements = document.querySelectorAll(`
        .project-card,
        .service-card,
        .timeline-item,
        .skill-category,
        .contact-item
    `);
    
    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Observe element
        observer.observe(el);
    });
    
    // Parallax effect for hero background (simplified and controlled)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.hero');
                const floatingElements = document.querySelector('.floating-elements');
                
                if (heroSection && floatingElements && scrolled < window.innerHeight) {
                    const rate = scrolled * -0.3;
                    floatingElements.style.transform = `translateY(${rate}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Utility function to throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add scroll event with throttling for performance
window.addEventListener('scroll', throttle(() => {
    updateNavbarBackground();
}, 16)); // ~60fps

// Update navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        navbar.style.background = 'rgba(38, 40, 40, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(38, 40, 40, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add initial loading state
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in-out';

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on escape
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Add focus management for accessibility
function initAccessibility() {
    // Skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
        skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
        skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
initAccessibility();

// Error handling for failed resource loads
window.addEventListener('error', (e) => {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
});

// Performance optimization: Lazy load images when implemented
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// Prevent default behavior on hash links without targets
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        const href = link.getAttribute('href');
        if (href === '#' || !document.querySelector(href)) {
            e.preventDefault();
        }
    }
});