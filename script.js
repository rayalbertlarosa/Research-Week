// Loading Screen Control
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Minimum loading time for branding effect (2 seconds)
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remove loading screen from DOM after fade out
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
});

// Loading Screen Early Hide (if page loads very fast)
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Start countdown for minimum display time
    setTimeout(() => {
        // Only hide if window.load hasn't fired yet
        if (document.readyState === 'complete') {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }, 3000);
});

// Professional Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Add smooth animation
    if (navMenu.classList.contains('active')) {
        navMenu.style.animation = 'slideDown 0.3s ease-out';
    } else {
        navMenu.style.animation = 'slideUp 0.3s ease-out';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Professional smooth scrolling for navigation links
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
            
            // Add active state to navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Professional navbar background change on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Professional scroll progress indicator
function updateScrollProgress() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-width', scrolled + '%');
}

window.addEventListener('scroll', updateScrollProgress);

// Add scroll progress indicator to DOM
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.style.width = 'var(--scroll-width, 0%)';
    document.body.appendChild(scrollIndicator);
});

// Professional Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add stagger delay for multiple elements
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Enhanced fade-in animations with different directions
document.addEventListener('DOMContentLoaded', () => {
    // Add different animation classes
    const titleElements = document.querySelectorAll('.section-title');
    const featureElements = document.querySelectorAll('.feature');
    const speakerElements = document.querySelectorAll('.speaker-card');
    const scheduleElements = document.querySelectorAll('.schedule-day');
    const aboutTextElements = document.querySelectorAll('.about-text');
    
    titleElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    featureElements.forEach((el, index) => {
        el.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
        observer.observe(el);
    });
    
    speakerElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 200}ms`;
        observer.observe(el);
    });
    
    scheduleElements.forEach((el, index) => {
        el.classList.add('slide-in-left');
        el.style.transitionDelay = `${index * 150}ms`;
        observer.observe(el);
    });
    
    aboutTextElements.forEach(el => {
        el.classList.add('slide-in-right');
        observer.observe(el);
    });
});

// Registration form handling with database integration
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    
    // Get selected days
    const selectedDays = [];
    const dayCheckboxes = document.querySelectorAll('input[name="selectedDays"]:checked');
    dayCheckboxes.forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });
    
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        affiliation: formData.get('affiliation'),
        phone: formData.get('phone'),
        interests: formData.get('interests'),
        selectedDays: selectedDays
    };
    
    // Basic validation
    if (!data.fullName || !data.email || !data.affiliation) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate at least one day is selected
    if (selectedDays.length === 0) {
        showNotification('Please select at least one day to attend.', 'error');
        const errorDiv = document.getElementById('day-selection-error');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    } else {
        const errorDiv = document.getElementById('day-selection-error');
        if (errorDiv) errorDiv.style.display = 'none';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Submit to database API
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        hideLoading();
        
        if (result.success) {
            const dayNames = {
                'day1': 'Day 1 (Nov 10)',
                'day2': 'Day 2 (Nov 11)',
                'day3': 'Day 3 (Nov 12)',
                'day4': 'Day 4 (Nov 13)',
                'day5': 'Day 5 (Nov 14)'
            };
            const selectedDayNames = selectedDays.map(day => dayNames[day]).join(', ');
            
            showNotification(
                result.message + 
                ` You are registered for: ${selectedDayNames}` +
                (result.emailSent ? ' Confirmation email sent!' : ' (Email delivery may be delayed)'), 
                'success'
            );
            this.reset();
            
            // Update registration count if stats are displayed
            updateRegistrationStats();
            
        } else {
            showNotification(result.error || 'Registration failed. Please try again.', 'error');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Registration error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    });
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1002;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Loading indicator
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Processing registration...</p>
        </div>
    `;
    
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        color: white;
        text-align: center;
    `;
    
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .loading-spinner {
            text-align: center;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #ffd700;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// Registration statistics update
function updateRegistrationStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update any stats display on the page
                const statsElement = document.getElementById('registration-stats');
                if (statsElement) {
                    statsElement.innerHTML = `
                        <div class="stats-item">
                            <span class="stats-number">${data.stats.total}</span>
                            <span class="stats-label">Total Registrations</span>
                        </div>
                        <div class="stats-item">
                            <span class="stats-number">${data.stats.today}</span>
                            <span class="stats-label">Today</span>
                        </div>
                        <div class="stats-grid">
                            <div class="day-stat">
                                <span class="day-stat-count">${data.stats.byDay.day1}</span>
                                <span class="day-stat-label">Day 1</span>
                            </div>
                            <div class="day-stat">
                                <span class="day-stat-count">${data.stats.byDay.day2}</span>
                                <span class="day-stat-label">Day 2</span>
                            </div>
                            <div class="day-stat">
                                <span class="day-stat-count">${data.stats.byDay.day3}</span>
                                <span class="day-stat-label">Day 3</span>
                            </div>
                            <div class="day-stat">
                                <span class="day-stat-count">${data.stats.byDay.day4}</span>
                                <span class="day-stat-label">Day 4</span>
                            </div>
                            <div class="day-stat">
                                <span class="day-stat-count">${data.stats.byDay.day5}</span>
                                <span class="day-stat-label">Day 5</span>
                            </div>
                        </div>
                    `;
                }
            }
        })
        .catch(error => {
            console.log('Stats update failed:', error);
        });
}

// Check registration status function
function checkRegistrationStatus(email) {
    return fetch(`/api/registration/${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.registration;
            } else {
                throw new Error(data.error);
            }
        });
}

// Add registration lookup functionality
function addRegistrationLookup() {
    const lookupSection = document.createElement('div');
    lookupSection.className = 'registration-lookup';
    lookupSection.innerHTML = `
        <div class="lookup-container">
            <h3>Check Your Registration</h3>
            <div class="lookup-form">
                <input type="email" id="lookup-email" placeholder="Enter your email address" required>
                <button type="button" onclick="lookupRegistration()">Check Status</button>
            </div>
            <div id="lookup-result" class="lookup-result"></div>
        </div>
    `;
    
    // Add to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.appendChild(lookupSection);
    }
}

// Registration lookup function
function lookupRegistration() {
    const email = document.getElementById('lookup-email').value;
    const resultDiv = document.getElementById('lookup-result');
    
    if (!email) {
        resultDiv.innerHTML = '<p class="error">Please enter your email address.</p>';
        return;
    }
    
    resultDiv.innerHTML = '<p class="loading">Checking registration...</p>';
    
    checkRegistrationStatus(email)
        .then(registration => {
            resultDiv.innerHTML = `
                <div class="registration-found">
                    <h4>✅ Registration Found</h4>
                    <p><strong>Name:</strong> ${registration.fullName}</p>
                    <p><strong>Affiliation:</strong> ${registration.affiliation}</p>
                    <p><strong>Registered:</strong> ${new Date(registration.registrationDate).toLocaleDateString()}</p>
                    <p><strong>Selected Days:</strong> ${registration.selectedDays.join(', ')}</p>
                    <p><strong>Email Confirmation:</strong> ${registration.emailSent ? '✅ Sent' : '⏳ Pending'}</p>
                </div>
            `;
        })
        .catch(error => {
            resultDiv.innerHTML = `
                <div class="registration-not-found">
                    <h4>❌ Registration Not Found</h4>
                    <p>No registration found for this email address.</p>
                    <p>Please check your email or <a href="#registration">register now</a>.</p>
                </div>
            `;
        });
}

// Dynamic year update and initialization
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    document.querySelector('.footer-bottom p').innerHTML = 
        `&copy; ${currentYear} De La Salle Medical and Health Sciences Institute. All rights reserved.`;
    
    // Initialize registration statistics
    updateRegistrationStats();
    
    // Add registration lookup functionality
    addRegistrationLookup();
});

// Professional particle effect for hero section
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 20 + 10}s infinite linear;
        `;
        particleContainer.appendChild(particle);
    }
    
    hero.appendChild(particleContainer);
}

// Professional typing effect for hero title - DISABLED
// function createTypingEffect() {
//     const heroTitle = document.querySelector('.hero-title');
//     if (!heroTitle) return;
//     
//     const text = heroTitle.textContent;
//     heroTitle.textContent = '';
//     heroTitle.style.borderRight = '2px solid rgba(255, 255, 255, 0.8)';
//     
//     let i = 0;
//     const typeWriter = () => {
//         if (i < text.length) {
//             heroTitle.textContent += text.charAt(i);
//             i++;
//             setTimeout(typeWriter, 100);
//         } else {
//             // Remove cursor after typing
//             setTimeout(() => {
//                 heroTitle.style.borderRight = 'none';
//             }, 1000);
//         }
//     };
//     
//     setTimeout(typeWriter, 1500);
// }

// Professional parallax scrolling
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const heroBackground = document.querySelector('.hero::before');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Professional count-up animation for statistics
function animateCount(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = () => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start < target) {
            requestAnimationFrame(counter);
        } else {
            element.textContent = target;
        }
    };
    
    counter();
}

// Professional hover effects for interactive elements
function initHoverEffects() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', (e) => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translateY(-3px) scale(1.02) rotateX(${y * 0.1}deg) rotateY(${x * 0.1}deg)`;
        });
    });
    
    // Add floating animation to feature cards
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.animation = `floatUp ${3 + index * 0.5}s ease-in-out infinite`;
        feature.style.animationDelay = `${index * 0.2}s`;
    });
}

// Professional scroll-triggered animations
function initScrollAnimations() {
    const animationTriggers = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.animate;
                entry.target.classList.add(`animate-${animationType}`);
            }
        });
    }, { threshold: 0.1 });
    
    animationTriggers.forEach(trigger => {
        animationObserver.observe(trigger);
    });
}

// Professional preloader
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <img src="images/logo.svg" alt="DLSMHSI" style="height: 60px; opacity: 0; animation: fadeInScale 1s ease-out 0.5s both;">
            </div>
            <div class="preloader-text" style="margin-top: 20px; color: #1e4d2b; font-weight: 600; opacity: 0; animation: fadeInScale 1s ease-out 1s both;">
                Loading Research Week 2025...
            </div>
            <div class="progress-bar" style="width: 200px; height: 3px; background: #e0e0e0; border-radius: 2px; margin-top: 20px; overflow: hidden;">
                <div class="progress-fill" style="height: 100%; background: linear-gradient(90deg, #1e4d2b, #2d5a3d); width: 0%; transition: width 2s ease-out;"></div>
            </div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f8fffe 0%, #ffffff 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease-out;
    `;
    
    document.body.appendChild(preloader);
    
    // Animate progress bar
    setTimeout(() => {
        const progressFill = preloader.querySelector('.progress-fill');
        progressFill.style.width = '100%';
    }, 500);
    
    // Remove preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 2000);
    });
}

// Professional page load initialization
document.addEventListener('DOMContentLoaded', () => {
    // Create preloader
    createPreloader();
    
    // Initialize all professional features
    setTimeout(() => {
        createParticleEffect();
        // createTypingEffect(); // DISABLED - Static title display
        initParallax();
        initHoverEffects();
        initScrollAnimations();
    }, 2500);
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add pulse effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        btn.classList.add('pulse');
    });
    
    // Add smooth hover transitions to cards
    const cards = document.querySelectorAll('.feature, .speaker-card, .schedule-day');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add scroll-to-top button
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1e4d2b, #2d5a3d);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 90;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(scrollToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.transform = 'translateY(0)';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.transform = 'translateY(100px)';
        }
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Add countdown timer (enhanced visibility for November 10, 2025, 9:00 AM)
function addCountdownTimer() {
    const eventDate = new Date('2025-11-10T09:00:00').getTime();
    
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown-timer enhanced-countdown';
    countdownElement.innerHTML = `
        <div class="countdown-header">
            <h3>🎯 Event Starts In:</h3>
            <p class="event-date">November 10, 2025 • 9:00 AM</p>
        </div>
        <div class="countdown-display">
            <div class="countdown-item">
                <span class="countdown-number" id="days">00</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-item">
                <span class="countdown-number" id="hours">00</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-item">
                <span class="countdown-number" id="minutes">00</span>
                <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-item">
                <span class="countdown-number" id="seconds">00</span>
                <span class="countdown-label">Seconds</span>
            </div>
        </div>
        <div class="countdown-footer">
            <p>📍 Villarosa Hall, DLSMHSI Angelo King Medical Center</p>
        </div>
    `;
    
    // Add countdown styles with enhanced visibility
    const countdownStyle = document.createElement('style');
    countdownStyle.textContent = `
        .enhanced-countdown {
            background: linear-gradient(135deg, rgba(30, 77, 43, 0.95), rgba(45, 90, 61, 0.95));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 2.5rem;
            margin: 3rem auto;
            max-width: 700px;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .enhanced-countdown::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
            pointer-events: none;
        }

        
        .countdown-header {
            position: relative;
            z-index: 2;
            margin-bottom: 2rem;
        }
        
        .countdown-header h3 {
            color: white;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            letter-spacing: -0.02em;
        }
        
        .event-date {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            font-weight: 500;
            margin: 0;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
        }
        
        .countdown-display {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            position: relative;
            z-index: 2;
            margin: 2rem 0;
        }
        
        .countdown-item {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 1.5rem 1rem;
            min-width: 100px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .countdown-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
        }
        
        .countdown-item:hover::before {
            left: 100%;
        }
        
        .countdown-item:hover {
            transform: translateY(-2px) scale(1.02);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .countdown-number {
            display: block;
            font-size: 2.8rem;
            font-weight: 800;
            color: #ffffff;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            line-height: 1;
            margin-bottom: 0.5rem;
            font-family: 'Inter', monospace;
            letter-spacing: -0.02em;
        }
        
        .countdown-label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .countdown-separator {
            font-size: 2rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 300;
        }
        
        .countdown-footer {
            position: relative;
            z-index: 2;
            margin-top: 2rem;
        }
        
        .countdown-footer p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1rem;
            font-weight: 500;
            margin: 0;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
            .enhanced-countdown {
                margin: 2rem 1rem;
                padding: 2rem 1rem;
            }
            
            .countdown-display {
                gap: 0.5rem;
            }
            
            .countdown-item {
                min-width: 70px;
                padding: 1rem 0.5rem;
            }
            
            .countdown-number {
                font-size: 2rem;
            }
            
            .countdown-separator {
                font-size: 1.5rem;
            }
            
            .countdown-header h3 {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(countdownStyle);
    
    // Insert countdown into hero section with professional styling
    const heroContent = document.querySelector('.hero-content');
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroContent && heroButtons) {
        heroContent.insertBefore(countdownElement, heroButtons);
    }
    
    // Update countdown
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            countdownElement.innerHTML = `
                <div class="countdown-header">
                    <h3 style="color: #3e7b3e; font-size: 2rem; margin-bottom: 1rem;">🎉 Event Has Started!</h3>
                    <p style="color: #2d5a3d; font-size: 1.2rem; font-weight: 600;">DLSMHSI Research Week 2025 is now live!</p>
                    <p style="color: #1e4d2b; font-size: 1rem; margin-top: 0.5rem;">📍 Villarosa Hall, DLSMHSI Angelo King Medical Center</p>
                </div>
            `;
            countdownElement.style.background = 'linear-gradient(135deg, rgba(62, 123, 62, 0.95), rgba(45, 90, 61, 0.95))';
        }
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize countdown on page load
document.addEventListener('DOMContentLoaded', addCountdownTimer);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Hide loading
        hideLoading();
    }
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label') && btn.textContent) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.style.outline = '3px solid #3e7b3e';
            el.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', () => {
            el.style.outline = 'none';
        });
    });
});

// QR Code Attendance System
const attendanceQRData = {
    day1: {
        code: 'RW2025-DAY1',
        url: 'https://dlsmhsiresearch2025.com/attendance/day1',
        data: {
            event: 'DLSMHSI Research Week 2025 - Day 1',
            date: '2025-11-10',
            venue: 'Villarosa Hall, DLSMHSI Angelo King Medical Center',
            activities: 'Opening Ceremonies, Keynote Presentations, JBI Evidence Synthesis'
        }
    },
    day2: {
        code: 'RW2025-DAY2',
        url: 'https://dlsmhsiresearch2025.com/attendance/day2',
        data: {
            event: 'DLSMHSI Research Week 2025 - Day 2',
            date: '2025-11-11',
            venue: 'Villarosa Hall, DLSMHSI Angelo King Medical Center',
            activities: '18th DLSMHSI Students Research Contest, Awards Ceremony'
        }
    },
    day3: {
        code: 'RW2025-DAY3',
        url: 'https://dlsmhsiresearch2025.com/attendance/day3',
        data: {
            event: 'DLSMHSI Research Week 2025 - Day 3',
            date: '2025-11-12',
            venue: 'Villarosa Hall, DLSMHSI Angelo King Medical Center',
            activities: 'Residents Research Contest, Descriptive & Analytic Studies'
        }
    },
    day4: {
        code: 'RW2025-DAY4',
        url: 'https://dlsmhsiresearch2025.com/attendance/day4',
        data: {
            event: 'DLSMHSI Research Week 2025 - Day 4',
            date: '2025-11-13',
            venue: 'Villarosa Hall, DLSMHSI Angelo King Medical Center',
            activities: 'Faculty Research Forum, Pitching Possibilities: From Ideas to Impact'
        }
    },
    day5: {
        code: 'RW2025-DAY5',
        url: 'https://dlsmhsiresearch2025.com/attendance/day5',
        data: {
            event: 'DLSMHSI Research Week 2025 - Day 5',
            date: '2025-11-14',
            venue: 'Villarosa Hall, DLSMHSI Angelo King Medical Center',
            activities: 'Innovation Seminar, AI Literacy Program, Culminating Activity'
        }
    }
};

// Generate QR codes when page loads
setTimeout(() => {
    // Generate QR codes for all days
    Object.keys(attendanceQRData).forEach(day => {
        generateQRCode(day);
    });
}, 1000);

function generateQRCode(day) {
    const canvas = document.getElementById(`qr-canvas-${day}`);
    if (!canvas || typeof QRCode === 'undefined') {
        console.warn('QR Code library not loaded or canvas not found for ' + day);
        return;
    }
    
    const qrData = attendanceQRData[day];
    
    // Create attendance verification URL with encoded data
    const attendanceData = {
        code: qrData.code,
        event: qrData.data.event,
        date: qrData.data.date,
        venue: qrData.data.venue,
        activities: qrData.data.activities,
        timestamp: new Date().toISOString(),
        verification_url: qrData.url
    };
    
    const qrString = JSON.stringify(attendanceData);
    
    // Generate QR code
    QRCode.toCanvas(canvas, qrString, {
        width: 200,
        height: 200,
        margin: 2,
        color: {
            dark: '#1e4d2b',
            light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
    }, function (error) {
        if (error) {
            console.error('QR Code generation failed for ' + day + ':', error);
        } else {
            console.log('QR Code generated successfully for ' + day);
        }
    });
}

function toggleQR(day) {
    const qrContainer = document.getElementById(`qr-${day}`);
    const allQRContainers = document.querySelectorAll('.qr-container');
    
    // Hide all other QR containers
    allQRContainers.forEach(container => {
        if (container.id !== `qr-${day}`) {
            container.style.display = 'none';
        }
    });
    
    // Toggle current QR container
    if (qrContainer.style.display === 'none' || qrContainer.style.display === '') {
        qrContainer.style.display = 'block';
        
        // Add click outside to close functionality
        setTimeout(() => {
            document.addEventListener('click', function closeQR(e) {
                if (!qrContainer.contains(e.target) && !e.target.closest('.qr-toggle-btn')) {
                    qrContainer.style.display = 'none';
                    document.removeEventListener('click', closeQR);
                }
            });
        }, 100);
    } else {
        qrContainer.style.display = 'none';
    }
}

// Attendance tracking API simulation
function recordAttendance(participantId, day, method = 'qr') {
    const attendanceData = {
        participant_id: participantId,
        event_day: day,
        timestamp: new Date().toISOString(),
        method: method,
        event_details: attendanceQRData[day]
    };
    
    // In a real implementation, this would send to your backend
    console.log('Attendance recorded:', attendanceData);
    
    // Store in localStorage for demo purposes
    const storedAttendance = JSON.parse(localStorage.getItem('eventAttendance') || '[]');
    storedAttendance.push(attendanceData);
    localStorage.setItem('eventAttendance', JSON.stringify(storedAttendance));
    
    return attendanceData;
}

// Get attendance records for a participant
function getAttendanceRecords(participantId) {
    const storedAttendance = JSON.parse(localStorage.getItem('eventAttendance') || '[]');
    return storedAttendance.filter(record => record.participant_id === participantId);
}

// Validate QR code data
function validateQRData(qrData) {
    try {
        const data = JSON.parse(qrData);
        
        // Check if it's a valid Research Week QR code
        if (!data.code || !data.code.startsWith('RW2025-DAY')) {
            return { valid: false, error: 'Invalid QR code format' };
        }
        
        // Check if the event date is valid
        const eventDate = new Date(data.date);
        const today = new Date();
        
        // Allow attendance recording from the day before to the day after
        const dayBefore = new Date(eventDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        const dayAfter = new Date(eventDate);
        dayAfter.setDate(dayAfter.getDate() + 1);
        
        if (today < dayBefore || today > dayAfter) {
            return { valid: false, error: 'QR code is not valid for today\'s date' };
        }
        
        return { valid: true, data: data };
    } catch (error) {
        return { valid: false, error: 'Invalid QR code data' };
    }
}