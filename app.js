class PitchDeckPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        
        // Get navigation elements
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideIndicators = document.getElementById('slideIndicators');
        this.currentSlideElement = document.getElementById('currentSlide');
        this.totalSlidesElement = document.getElementById('totalSlides');
        
        console.log('Presentation initialized with', this.totalSlides, 'slides');
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.updateSlideCounter();
        this.updateNavigationState();
        this.bindEvents();
        
        // Set initial state
        this.showSlide(0);
        
        console.log('Presentation setup complete');
    }
    
    createIndicators() {
        if (!this.slideIndicators) {
            console.error('Slide indicators container not found');
            return;
        }
        
        this.slideIndicators.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.type = 'button';
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) indicator.classList.add('active');
            
            // Use closure to capture the correct index
            indicator.addEventListener('click', ((slideIndex) => {
                return (e) => {
                    e.preventDefault();
                    console.log('Indicator clicked:', slideIndex + 1);
                    this.goToSlide(slideIndex);
                };
            })(i));
            
            this.slideIndicators.appendChild(indicator);
        }
        
        console.log('Created', this.totalSlides, 'indicators');
    }
    
    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Space bar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) { // Minimum swipe distance
                    if (deltaX > 0) {
                        this.nextSlide(); // Swipe left = next slide
                    } else {
                        this.previousSlide(); // Swipe right = previous slide
                    }
                }
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
        
        // QR Code functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.qr-code')) {
                e.preventDefault();
                this.handleQRCodeClick();
            }
        });
        
        console.log('Event listeners bound');
    }
    
    showSlide(index) {
        console.log('Showing slide:', index + 1);
        
        // Remove active class from all slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        
        // Add active class to current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        // Update indicators
        const indicators = this.slideIndicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        this.currentSlide = index;
        this.updateSlideCounter();
        this.updateNavigationState();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        } else {
            console.log('Already on last slide');
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        } else {
            console.log('Already on first slide');
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        } else {
            console.log('Invalid slide index:', index);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideElement) {
            this.currentSlideElement.textContent = this.currentSlide + 1;
        }
        if (this.totalSlidesElement) {
            this.totalSlidesElement.textContent = this.totalSlides;
        }
    }
    
    updateNavigationState() {
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
    }
    
    handleQRCodeClick() {
        // Provide information about the QR code with Lions Club details
        const message = `UPI Payment QR Code for Solar Lighting & Smart Education Project

Account: Lions Club of Bombay Babulnath FRD Account
UPI ID: QR919322657306-2334@unionbankofindia
Amount: ₹14,07,800

About Lions Club of Babulnath:
• Established 1982 (42+ years of service)
• District 323A1 Premium Club
• Major projects worth ₹45+ lakhs completed
• Trusted CSR execution partner
• Motto: "We Serve"

Instructions:
1. Scan the QR code with any UPI app (BHIM, PhonePe, Paytm, etc.)
2. Verify the account details
3. Enter the amount or use the pre-filled amount
4. Complete the transaction

Your CSR funding will be professionally managed by Lions Club of Babulnath in partnership with SELCO India and Rock & Anchor for guaranteed impact and transparent execution.`;
        
        alert(message);
    }
    
    announceSlideChange() {
        const slideTitle = this.slides[this.currentSlide].querySelector('h1')?.textContent || 'Untitled';
        const announcement = `Slide ${this.currentSlide + 1} of ${this.totalSlides}: ${slideTitle}`;
        
        // Create or update screen reader announcement
        let announcer = document.getElementById('slide-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'slide-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = announcement;
    }
    
    // Public methods
    navigateTo(slideNumber) {
        this.goToSlide(slideNumber - 1);
    }
    
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide + 1,
            total: this.totalSlides,
            title: this.slides[this.currentSlide].querySelector('h1')?.textContent || 'Untitled'
        };
    }
}

// Enhanced slide animations
class SlideAnimations {
    constructor() {
        this.initAnimations();
    }
    
    initAnimations() {
        this.addHoverEffects();
        this.setupSlideObserver();
    }
    
    addHoverEffects() {
        // Use event delegation for better performance
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.partner-box')) {
                e.target.style.transform = 'translateY(-8px) scale(1.02)';
                e.target.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            
            if (e.target.matches('.sdg-item')) {
                e.target.style.transform = 'translateY(-6px)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
                e.target.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            
            if (e.target.matches('.qr-code')) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                e.target.style.cursor = 'pointer';
            }
            
            if (e.target.matches('.partner-profile')) {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = 'var(--shadow-md)';
                e.target.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.partner-box')) {
                e.target.style.transform = 'translateY(0) scale(1)';
            }
            
            if (e.target.matches('.sdg-item')) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
            }
            
            if (e.target.matches('.qr-code')) {
                e.target.style.transform = 'scale(1)';
            }
            
            if (e.target.matches('.partner-profile')) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
            }
        }, true);
    }
    
    setupSlideObserver() {
        // Observe slide changes and animate elements
        const slideObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && mutation.target.classList.contains('slide')) {
                    const slide = mutation.target;
                    if (slide.classList.contains('active')) {
                        this.animateSlideElements(slide);
                    }
                }
            });
        });
        
        // Observe all slides
        document.querySelectorAll('.slide').forEach(slide => {
            slideObserver.observe(slide, { attributes: true });
        });
    }
    
    animateSlideElements(slide) {
        const animatableElements = slide.querySelectorAll(
            '.challenge-item, .impact-item, .sdg-item, .partner-box, .partner-profile, .benefit-item, .step-item, .payment-section, .investment-ask, .next-steps, .partnership-info'
        );
        
        animatableElements.forEach((element, index) => {
            // Reset animation
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            // Animate in with stagger
            setTimeout(() => {
                element.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
}

// Utility functions
const PresentationUtils = {
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    },
    
    copyUPIId() {
        const upiId = "QR919322657306-2334@unionbankofindia";
        if (navigator.clipboard) {
            navigator.clipboard.writeText(upiId).then(() => {
                alert('UPI ID copied to clipboard: ' + upiId + '\n\nThis is the Lions Club of Babulnath FRD Account for direct CSR funding of the Solar Lighting & Smart Education project.');
            }).catch(() => {
                alert('UPI ID: ' + upiId + '\n\nLions Club of Babulnath FRD Account\nFor Solar Lighting & Smart Education CSR project');
            });
        } else {
            alert('UPI ID: ' + upiId + '\n\nLions Club of Babulnath FRD Account\nFor Solar Lighting & Smart Education CSR project');
        }
    },
    
    showPartnershipInfo() {
        const info = `Partnership Structure for Solar Lighting & Smart Education Project:

🔧 SELCO India
• Technical expertise and implementation
• 50% funding match (₹14,07,800)
• Award-winning sustainable energy solutions

🌱 Rock & Anchor
• Community engagement and local execution
• Grassroots connections in Karjat region
• Cultural sensitivity and smooth implementation

🦁 Lions Club of Babulnath
• CSR coordination and project management
• 42+ years of community service experience
• Transparent fund utilization and reporting
• Professional project oversight

💼 Your CSR Investment
• ₹14,07,800 funding requirement
• Direct impact on 567 lives across 5 villages
• Measurable outcomes and regular reporting
• Perfect alignment with CSR mandates

This four-way partnership ensures professional management, technical excellence, community engagement, and transparent execution for maximum impact.`;
        
        alert(info);
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    try {
        // Initialize main presentation
        const presentation = new PitchDeckPresentation();
        
        // Initialize animations
        const animations = new SlideAnimations();
        
        // Add click handler for UPI ID copy
        document.addEventListener('click', (e) => {
            if (e.target.matches('.upi-id')) {
                e.preventDefault();
                PresentationUtils.copyUPIId();
            }
            
            // Add click handler for Lions Club trust badge
            if (e.target.matches('.lions-trust')) {
                e.preventDefault();
                PresentationUtils.showPartnershipInfo();
            }
        });
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
                e.preventDefault();
                PresentationUtils.toggleFullscreen();
            }
            
            // Add shortcut for partnership info
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                PresentationUtils.showPartnershipInfo();
            }
        });
        
        // Expose for debugging
        window.pitchDeck = presentation;
        window.presentationUtils = PresentationUtils;
        
        console.log('✅ CSR Pitch Deck with Lions Club Partnership initialized successfully');
        console.log('Navigation: Arrow keys, space bar, navigation buttons, or click dots');
        console.log('Shortcuts: Ctrl+F for fullscreen, Ctrl+P for partnership info, Home/End for first/last slide');
        console.log('Payment: Click QR code for instructions, click UPI ID to copy');
        console.log('Partnership: Lions Club of Babulnath + SELCO India + Rock & Anchor');
        
    } catch (error) {
        console.error('❌ Failed to initialize presentation:', error);
    }
});