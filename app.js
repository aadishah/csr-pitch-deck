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
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            
            // Add click event listener with proper scope
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Indicator clicked:', i);
                this.goToSlide(i);
            });
            
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
        
        // CTA button functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.cta-slide .btn')) {
                e.preventDefault();
                this.handleCTAClick();
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
    
    handleCTAClick() {
        // Create a more professional modal-like response
        const message = `Thank you for your interest in the Solar Lighting & Smart Education project!

Investment Required: ₹14,07,800
Impact: 567 lives transformed across 5 villages

Next Steps:
1. Partnership discussion
2. Fund transfer & deployment  
3. Implementation & monitoring
4. Impact reporting

This would typically connect you with our project team for immediate follow-up.`;
        
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
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.partner-box')) {
                e.target.style.transform = 'translateY(0) scale(1)';
            }
            
            if (e.target.matches('.sdg-item')) {
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
            '.challenge-item, .impact-item, .sdg-item, .partner-box, .benefit-item, .step'
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
    
    checkImageLoading() {
        const costChartImage = document.querySelector('.cost-chart img');
        if (costChartImage) {
            costChartImage.addEventListener('load', () => {
                console.log('Cost breakdown chart loaded successfully');
            });
            
            costChartImage.addEventListener('error', (e) => {
                console.error('Failed to load cost breakdown chart:', e);
                // Provide fallback content
                const container = costChartImage.parentElement;
                container.innerHTML = `
                    <div class="chart-fallback">
                        <h4>Project Cost Breakdown</h4>
                        <div class="cost-items">
                            <div class="cost-item">
                                <span>Home Lighting Systems (92 homes)</span>
                                <strong>₹17,75,600</strong>
                            </div>
                            <div class="cost-item">
                                <span>Smart School Systems (3 schools)</span>
                                <strong>₹9,30,000</strong>
                            </div>
                            <div class="cost-item">
                                <span>Smart Anganwadi System</span>
                                <strong>₹1,10,000</strong>
                            </div>
                            <div class="cost-total">
                                <span>Total Project Cost</span>
                                <strong>₹28,15,600</strong>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add styles for fallback
                const style = document.createElement('style');
                style.textContent = `
                    .chart-fallback {
                        background: var(--color-surface);
                        padding: var(--space-20);
                        border-radius: var(--radius-lg);
                        border: 1px solid var(--color-border);
                    }
                    .cost-items {
                        display: grid;
                        gap: var(--space-12);
                        margin-top: var(--space-16);
                    }
                    .cost-item {
                        display: flex;
                        justify-content: space-between;
                        padding: var(--space-12);
                        background: var(--color-bg-1);
                        border-radius: var(--radius-base);
                    }
                    .cost-total {
                        display: flex;
                        justify-content: space-between;
                        padding: var(--space-16);
                        background: var(--color-primary);
                        color: var(--color-btn-primary-text);
                        border-radius: var(--radius-base);
                        font-weight: var(--font-weight-bold);
                        margin-top: var(--space-12);
                    }
                `;
                document.head.appendChild(style);
            });
        }
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
        
        // Check image loading
        PresentationUtils.checkImageLoading();
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
                e.preventDefault();
                PresentationUtils.toggleFullscreen();
            }
        });
        
        // Expose for debugging
        window.pitchDeck = presentation;
        window.presentationUtils = PresentationUtils;
        
        console.log('✅ CSR Pitch Deck initialized successfully');
        console.log('Navigation: Arrow keys, space bar, or click buttons/dots');
        console.log('Shortcuts: Ctrl+F for fullscreen, Home/End for first/last slide');
        
    } catch (error) {
        console.error('❌ Failed to initialize presentation:', error);
    }
});