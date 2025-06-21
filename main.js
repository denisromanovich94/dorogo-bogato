// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contactForm');

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Service selection functionality
    window.selectService = function(serviceType) {
        const serviceSelect = document.getElementById('service');
        const serviceMap = {
            'basic': 'basic',
            'standard': 'standard', 
            'premium': 'premium'
        };
        
        if (serviceSelect && serviceMap[serviceType]) {
            serviceSelect.value = serviceMap[serviceType];
            serviceSelect.dispatchEvent(new Event('change'));
        }
        
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Track service selection for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_selection', {
                'service_type': serviceType,
                'value': getServiceValue(serviceType)
            });
        }

        // Track for Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_name: getServiceName(serviceType),
                content_category: 'Psychology Services',
                value: getServiceValue(serviceType),
                currency: 'USD'
            });
        }
    };

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-bg');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add loading class to trigger animations
    document.body.classList.add('loading');
});

// Form handling
function handleFormSubmission() {
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Basic form validation
    if (!validateForm(formObject)) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        contactForm.reset();
        
        // Track form submission for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                'service_interest': formObject.service || 'not_specified'
            });
        }

        // Track for Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Contact Form',
                content_category: 'Lead Generation'
            });
        }

        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Form validation
function validateForm(formData) {
    const requiredFields = ['name', 'email', 'message'];
    
    for (let field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            return false;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return false;
    }

    return true;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;

    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #2a9d0e, #4caf50);
                color: white;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #d32f2f, #f44336);
                color: white;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #1976d2, #2196f3);
                color: white;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: 1rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Helper functions for analytics
function getServiceName(serviceType) {
    const serviceNames = {
        'basic': 'Базовый пакет',
        'standard': 'Стандартный пакет',
        'premium': 'Премиум пакет'
    };
    return serviceNames[serviceType] || 'Неизвестная услуга';
}

function getServiceValue(serviceType) {
    const serviceValues = {
        'basic': 250,
        'standard': 500,
        'premium': 1000
    };
    return serviceValues[serviceType] || 0;
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const scrolled = window.pageYOffset;
    
    // Navbar effect
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 10);

// Replace scroll event listener for better performance
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        // Add any critical images here when provided
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Call preload function
preloadCriticalResources();

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(err) {
        //         console.log('ServiceWorker registration failed');
        //     });
    });
}

// Error handling for analytics
window.addEventListener('error', function(e) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.message,
            'fatal': false
        });
    }
});

// Track page engagement
let startTime = Date.now();
let maxScroll = 0;

window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    maxScroll = Math.max(maxScroll, scrollPercent);
});

window.addEventListener('beforeunload', function() {
    const timeOnPage = Date.now() - startTime;
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_engagement', {
            'time_on_page': Math.round(timeOnPage / 1000),
            'max_scroll_percentage': maxScroll
        });
    }
});






























