// Fractal Canvas Animation
class FractalCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.lines = [];
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addPoint(x, y);
        });
        
        // Add some initial points for demonstration
        setTimeout(() => {
            if (this.points.length === 0) {
                this.addRandomPoints(3);
            }
        }, 2000);
    }
    
    addPoint(x, y) {
        const newPoint = {
            x,
            y,
            age: 0,
            radius: 0,
            maxRadius: 8,
            glowIntensity: 1,
            pulsePhase: 0
        };
        
        // Connect to existing points
        this.points.forEach(point => {
            this.addLine(newPoint, point);
        });
        
        this.points.push(newPoint);
        
        // Limit total points to prevent performance issues
        if (this.points.length > 12) {
            this.removeOldestPoint();
        }
    }
    
    addLine(point1, point2) {
        const line = {
            start: point1,
            end: point2,
            opacity: 0,
            maxOpacity: 0.6,
            age: 0,
            length: this.distance(point1, point2),
            animationProgress: 0
        };
        
        this.lines.push(line);
    }
    
    addRandomPoints(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                this.addPoint(x, y);
            }, i * 1000);
        }
    }
    
    removeOldestPoint() {
        if (this.points.length === 0) return;
        
        const oldestPoint = this.points.shift();
        
        // Remove lines connected to this point
        this.lines = this.lines.filter(line => 
            line.start !== oldestPoint && line.end !== oldestPoint
        );
    }
    
    distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    update() {
        // Update points
        this.points.forEach(point => {
            point.age += 0.02;
            point.pulsePhase += 0.05;
            
            // Animate radius growth
            if (point.radius < point.maxRadius) {
                point.radius += 0.3;
            }
            
            // Pulse effect
            point.glowIntensity = 0.7 + 0.3 * Math.sin(point.pulsePhase);
        });
        
        // Update lines
        this.lines.forEach(line => {
            line.age += 0.02;
            line.animationProgress = Math.min(1, line.age * 2);
            
            // Fade in animation
            if (line.opacity < line.maxOpacity) {
                line.opacity += 0.02;
            }
            
            // Distance-based opacity
            const distanceFactor = Math.max(0, 1 - line.length / 300);
            line.opacity = Math.min(line.opacity, line.maxOpacity * distanceFactor);
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw lines first (behind points)
        this.lines.forEach(line => {
            if (line.opacity > 0.01) {
                this.drawLine(line);
            }
        });
        
        // Draw points
        this.points.forEach(point => {
            this.drawPoint(point);
        });
    }
    
    drawLine(line) {
        const gradient = this.ctx.createLinearGradient(
            line.start.x, line.start.y,
            line.end.x, line.end.y
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${line.opacity})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${line.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${line.opacity})`);
        
        this.ctx.beginPath();
        this.ctx.moveTo(line.start.x, line.start.y);
        
        // Animate line drawing
        const endX = line.start.x + (line.end.x - line.start.x) * line.animationProgress;
        const endY = line.start.y + (line.end.y - line.start.y) * line.animationProgress;
        
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Add subtle glow effect
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        this.ctx.shadowBlur = 3;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }
    
    drawPoint(point) {
        // Main point
        const gradient = this.ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, point.radius
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${point.glowIntensity})`);
        gradient.addColorStop(0.7, `rgba(200, 220, 255, ${point.glowIntensity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Inner core
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, point.radius * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${point.glowIntensity * 0.9})`;
        this.ctx.fill();
        
        // Outer glow
        if (point.glowIntensity > 0.8) {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.radius * 1.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${(point.glowIntensity - 0.8) * 0.3})`;
            this.ctx.fill();
        }
    }
    
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize Fractal Canvas
document.addEventListener('DOMContentLoaded', function() {
    const fractalCanvas = new FractalCanvas('fractalCanvas');
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (fractalCanvas) {
            fractalCanvas.destroy();
        }
    });
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// Registration Form Logic
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const registrationType = document.getElementById('registrationType');
    const teamInfo = document.getElementById('teamInfo');

    // Show/hide team information based on registration type
    if (registrationType && teamInfo) {
        registrationType.addEventListener('change', function() {
            if (this.value === 'team' || this.value === 'school') {
                teamInfo.style.display = 'block';
                // Make team fields required
                document.getElementById('teamName').required = true;
                document.getElementById('coachName').required = true;
                document.getElementById('coachEmail').required = true;
            } else {
                teamInfo.style.display = 'none';
                // Remove required attribute from team fields
                document.getElementById('teamName').required = false;
                document.getElementById('coachName').required = false;
                document.getElementById('coachEmail').required = false;
            }
        });
    }

    // Registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '#e2e8f0';
                }
            });

            if (isValid) {
                // Show success message
                showNotification('Registration form submitted successfully! You will receive payment instructions via email.', 'success');
                
                // Reset form
                this.reset();
                teamInfo.style.display = 'none';
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
});

// Contact Form Logic
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    contactForm.action = "https://formsubmit.co/princetonstemexpo@gmail.com";
    contactForm.method = "POST";

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '#e2e8f0';
                }
            });

            if (isValid) {
                // Show success message
                showNotification('Message sent successfully! We will respond within 1-2 business days.', 'success');
                contactForm.submit();
                // Reset form
                this.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth Scrolling for Internal Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header Background on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    }
});

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            // Initially hide answers
            answer.style.display = 'none';
            question.style.cursor = 'pointer';
            question.style.userSelect = 'none';
            
            // Add toggle icon
            question.innerHTML += ' <i class="fas fa-chevron-down" style="font-size: 0.8em; transition: transform 0.3s ease;"></i>';
            
            question.addEventListener('click', function() {
                const icon = this.querySelector('i');
                
                if (answer.style.display === 'none') {
                    answer.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    answer.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
});

// Countdown Timer (for event page)
function createCountdownTimer(targetDate, elementId) {
    const countdownElement = document.getElementById(elementId);
    
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            countdownElement.innerHTML = '<div class="countdown-ended">Event has started!</div>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-timer">
                <div class="countdown-item">
                    <div class="countdown-number">${days}</div>
                    <div class="countdown-label">Days</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${hours}</div>
                    <div class="countdown-label">Hours</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${minutes}</div>
                    <div class="countdown-label">Minutes</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${seconds}</div>
                    <div class="countdown-label">Seconds</div>
                </div>
            </div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize countdown timer if on homepage
document.addEventListener('DOMContentLoaded', function() {
    // Set target date to April 12, 2025, 8:00 AM EST
    const eventDate = new Date('2025-04-12T08:00:00-05:00').getTime();
    createCountdownTimer(eventDate, 'countdown-timer');
});

// Form Field Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        });
        
        // Add validation styling
        input.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim() === '') {
                this.style.borderColor = '#ef4444';
            } else if (this.type === 'email' && this.value && !this.value.includes('@')) {
                this.style.borderColor = '#f59e0b';
            } else {
                this.style.borderColor = '#10b981';
            }
        });
    });
});

// Loading Animation for Links
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.style.opacity = '0.7';
            this.innerHTML += ' <i class="fas fa-spinner fa-spin"></i>';
        });
    });
});

// Intersection Observer for Animations
document.addEventListener('DOMContentLoaded', function() {
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

    // Observe feature cards and other animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .resource-card, .stat-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Print Functionality
function printSchedule() {
    window.print();
}

// Copy to Clipboard Functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Copied to clipboard!', 'success');
    }, function() {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Search Functionality (if search box is added)
function searchContent(query) {
    const content = document.body.innerText.toLowerCase();
    const searchQuery = query.toLowerCase();
    
    if (content.includes(searchQuery)) {
        showNotification(`Found "${query}" on this page`, 'success');
    } else {
        showNotification(`"${query}" not found on this page`, 'info');
    }
}

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Enter key on buttons triggers click
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Performance Optimization - Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

console.log('PSE Website JavaScript loaded successfully!');

// About Carousel Functionality
class AboutCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        if (!this.slides.length) return;
        
        this.init();
        this.setupEventListeners();
        this.startAutoPlay();
    }
    
    init() {
        // Ensure first slide is active
        this.showSlide(0);
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.about-carousel-container:hover')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            }
        });
        
        // Touch/swipe support for mobile
        this.setupTouchEvents();
        
        // Pause auto-play on hover
        const carouselContainer = document.querySelector('.about-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    setupTouchEvents() {
        const carousel = document.querySelector('.carousel-slides');
        if (!carousel) return;
        
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', () => {
            const threshold = 50; // Minimum swipe distance
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide(); // Swipe left - next slide
                } else {
                    this.prevSlide(); // Swipe right - previous slide
                }
            }
        }, { passive: true });
    }
    
    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
            this.resetAutoPlay();
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the about page and carousel exists
    if (document.querySelector('.about-carousel-container')) {
        new AboutCarousel();
    }
});

