/**
 * Enhanced Home Page with Premium Features
 */

function renderHomePage() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <!-- Animated Particles Background -->
        <div class="particles-container" id="particles"></div>

        <!-- Hero Section with Enhanced Visuals -->
        <section class="hero" id="hero-section">
            <div class="hero-container">
                <div class="hero-content">
                    <div class="hero-badge animate-fadeInUp">
                        <span class="badge-glow">🚀</span>
                        <span>Start Your Construction Journey</span>
                        <span class="badge-new">NEW</span>
                    </div>
                    <h1 class="hero-title animate-fadeInUp delay-100">
                        Find the Perfect 
                        <span class="text-gradient animated-gradient">Builder</span> 
                        for Your Project
                    </h1>
                    <p class="hero-subtitle animate-fadeInUp delay-200">
                        Connect with verified construction professionals, get competitive quotes, and bring your vision to life. Simple, transparent, and reliable.
                    </p>
                    <div class="hero-cta animate-fadeInUp delay-300">
                        <button class="btn btn-primary btn-lg btn-glow" onclick="navigateTo('customer-signup')">
                            <span class="btn-icon">🚀</span>
                            Get Quotes Now
                            <span class="btn-shine"></span>
                        </button>
                        <button class="btn btn-outline btn-lg btn-hover-fill" onclick="navigateTo('builder-signup')">
                            <span class="btn-icon">👷</span>
                            Join as Builder
                        </button>
                    </div>
                    <div class="hero-trust animate-fadeInUp delay-400">
                        <div class="trust-avatars">
                            <div class="trust-avatar">👤</div>
                            <div class="trust-avatar">👤</div>
                            <div class="trust-avatar">👤</div>
                            <div class="trust-avatar more">+</div>
                        </div>
                        <span class="trust-text">Be among the first to join!</span>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-features-grid">
                        <div class="card feature-highlight-card glass-card animate-fadeInUp">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon">🤖</div>
                                <div class="feature-glow"></div>
                            </div>
                            <h4>AI-Powered Matching</h4>
                            <p>Smart algorithms match you with the perfect builders for your project</p>
                        </div>
                        <div class="card feature-highlight-card glass-card animate-fadeInUp delay-100">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon">⚡</div>
                                <div class="feature-glow"></div>
                            </div>
                            <h4>Instant Quotes</h4>
                            <p>Get competitive quotes from verified builders in hours, not weeks</p>
                        </div>
                        <div class="card feature-highlight-card glass-card animate-fadeInUp delay-200">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon">🔒</div>
                                <div class="feature-glow"></div>
                            </div>
                            <h4>Secure Payments</h4>
                            <p>Protected transactions with milestone-based payment system</p>
                        </div>
                        <div class="card feature-highlight-card glass-card animate-fadeInUp delay-300">
                            <div class="feature-icon-wrapper">
                                <div class="feature-icon">💬</div>
                                <div class="feature-glow"></div>
                            </div>
                            <h4>24/7 Support</h4>
                            <p>Expert assistance whenever you need it throughout your project</p>
                        </div>
                    </div>
                    <div class="floating-elements">
                        <div class="floating-card fc-1">💡 New Quote!</div>
                        <div class="floating-card fc-2">✓ Project Completed</div>
                        <div class="floating-card fc-3">🏆 Top Rated</div>
                    </div>
                </div>
            </div>
            <div class="hero-scroll-indicator">
                <span>Scroll to explore</span>
                <div class="scroll-arrow"></div>
            </div>
        </section>

        <!-- Trusted By / Brands Section -->
        <section class="brands-section">
            <div class="container">
                <p class="brands-title">Trusted by leading companies and individuals</p>
                <div class="brands-logos">
                    <div class="brand-logo">🏛️ PropertyMax</div>
                    <div class="brand-logo">🏢 BuildCorp</div>
                    <div class="brand-logo">🏘️ HomeFirst</div>
                    <div class="brand-logo">🏗️ ConstructPro</div>
                    <div class="brand-logo">🏠 RealtyPlus</div>
                </div>
            </div>
        </section>

        <!-- How It Works with Steps -->
        <section class="features-section" id="how-it-works">
            <div class="container">
                <div class="section-header text-center">
                    <span class="section-badge">Simple Process</span>
                    <h2>How It <span class="text-gradient">Works</span></h2>
                    <p>Get your construction project started in three simple steps</p>
                </div>
                <div class="steps-container">
                    <div class="step-line"></div>
                    <div class="features-grid">
                        <div class="card feature-card glass-card animate-on-scroll" data-step="1">
                            <div class="step-number">01</div>
                            <div class="icon">
                                <span>📋</span>
                                <div class="icon-ring"></div>
                            </div>
                            <h3>Describe Your Project</h3>
                            <p>Add your plot details, location, and specific requirements for your construction project.</p>
                            <ul class="feature-list">
                                <li>📍 Add plot location</li>
                                <li>📐 Specify dimensions</li>
                                <li>📝 Detail requirements</li>
                            </ul>
                        </div>
                        <div class="card feature-card glass-card animate-on-scroll" data-step="2">
                            <div class="step-number">02</div>
                            <div class="icon">
                                <span>🔍</span>
                                <div class="icon-ring"></div>
                            </div>
                            <h3>Get Multiple Quotes</h3>
                            <p>Receive competitive quotes from verified builders who specialize in your project type.</p>
                            <ul class="feature-list">
                                <li>💰 Competitive pricing</li>
                                <li>✅ Verified builders</li>
                                <li>⚡ Fast responses</li>
                            </ul>
                        </div>
                        <div class="card feature-card glass-card animate-on-scroll" data-step="3">
                            <div class="step-number">03</div>
                            <div class="icon">
                                <span>🤝</span>
                                <div class="icon-ring"></div>
                            </div>
                            <h3>Choose & Build</h3>
                            <p>Compare quotes, review builder profiles, and select the perfect match for your project.</p>
                            <ul class="feature-list">
                                <li>📊 Compare easily</li>
                                <li>⭐ Read reviews</li>
                                <li>🏗️ Start building</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Choose Us Section -->
        <section class="why-us-section">
            <div class="container">
                <div class="why-us-grid">
                    <div class="why-us-content animate-on-scroll">
                        <span class="section-badge">Why BuildQuote Pro</span>
                        <h2>The Smart Way to <span class="text-gradient">Build</span></h2>
                        <p class="why-us-description">
                            We've revolutionized how property owners connect with builders. Our platform ensures you get the best value, quality, and peace of mind for your construction project.
                        </p>
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <div class="benefit-icon">🛡️</div>
                                <div class="benefit-content">
                                    <h4>Verified Builders</h4>
                                    <p>All builders are vetted and verified for quality and reliability</p>
                                </div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">💸</div>
                                <div class="benefit-content">
                                    <h4>Save Money</h4>
                                    <p>Compare quotes and save up to 30% on your construction costs</p>
                                </div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">⏱️</div>
                                <div class="benefit-content">
                                    <h4>Save Time</h4>
                                    <p>Get multiple quotes in hours, not weeks</p>
                                </div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">🤖</div>
                                <div class="benefit-content">
                                    <h4>AI-Powered Insights</h4>
                                    <p>Get smart budget recommendations with our AI advisor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="why-us-visual animate-on-scroll">
                        <div class="visual-card main-card">
                            <div class="visual-header">
                                <span class="status-dot"></span>
                                Active Project
                            </div>
                            <div class="visual-content">
                                <h4>Modern Villa Construction</h4>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                                <span class="progress-text">75% Complete</span>
                            </div>
                        </div>
                        <div class="visual-card side-card sc-1">
                            <span>💰 Quote Accepted</span>
                            <strong>$125,000</strong>
                        </div>
                        <div class="visual-card side-card sc-2">
                            <span>⭐ Builder Rating</span>
                            <strong>4.9/5.0</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="testimonials-section">
            <div class="container">
                <div class="section-header text-center">
                    <span class="section-badge">Testimonials</span>
                    <h2>What Our <span class="text-gradient">Customers</span> Say</h2>
                    <p>Real stories from real customers who built their dreams with us</p>
                </div>
                <div class="testimonials-slider">
                    <div class="testimonials-track" id="testimonials-track">
                        ${renderTestimonials()}
                    </div>
                </div>
                <div class="testimonial-indicators">
                    <button class="indicator active" onclick="goToTestimonial(0)"></button>
                    <button class="indicator" onclick="goToTestimonial(1)"></button>
                    <button class="indicator" onclick="goToTestimonial(2)"></button>
                </div>
            </div>
        </section>

        <!-- Platform Benefits Section -->
        <section class="benefits-section">
            <div class="container">
                <div class="section-header text-center">
                    <span class="section-badge">Why Choose Us</span>
                    <h2>Platform <span class="text-gradient">Benefits</span> & Advantages</h2>
                    <p>Discover what makes BuildQuote Pro the smart choice for your construction project</p>
                </div>
                <div class="benefits-grid">
                    ${renderPlatformBenefits()}
                </div>
            </div>
        </section>

        <!-- Cost Estimator Section -->
        ${typeof CostEstimator !== 'undefined' ? CostEstimator.render() : ''}

        <!-- FAQ Section -->
        <section class="faq-section">
            <div class="container">
                <div class="section-header text-center">
                    <span class="section-badge">FAQ</span>
                    <h2>Frequently Asked <span class="text-gradient">Questions</span></h2>
                    <p>Got questions? We've got answers</p>
                </div>
                <div class="faq-container">
                    ${renderFAQs()}
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <div class="cta-card card glass-card">
                    <div class="cta-background"></div>
                    <div class="cta-content">
                        <div class="cta-icon">🏗️</div>
                        <h2>Ready to Start Your <span class="text-gradient">Dream Project</span>?</h2>
                        <p>Join thousands of property owners who have found their perfect builder through BuildQuote Pro.</p>
                        <div class="cta-buttons">
                            <button class="btn btn-primary btn-lg btn-glow" onclick="navigateTo('signup-choice')">
                                Get Started Free
                                <span class="btn-arrow">→</span>
                            </button>
                            <button class="btn btn-outline btn-lg" onclick="navigateTo('contact')">
                                Contact Sales
                            </button>
                        </div>
                        <div class="cta-features">
                            <span>✓ No credit card required</span>
                            <span>✓ Free to get quotes</span>
                            <span>✓ Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter Section -->
        <section class="newsletter-section">
            <div class="container">
                <div class="newsletter-card">
                    <div class="newsletter-content">
                        <h3>📬 Stay Updated</h3>
                        <p>Get the latest construction tips, industry news, and exclusive offers.</p>
                    </div>
                    <form class="newsletter-form" onsubmit="handleNewsletter(event)">
                        <input type="email" class="form-input" placeholder="Enter your email" required>
                        <button type="submit" class="btn btn-primary">Subscribe</button>
                    </form>
                </div>
            </div>
        </section>
    `;

    // Add section styles and initialize features
    addEnhancedHomeStyles();
    initParticles();
    initCounters();
    initScrollAnimations();
    initTestimonialSlider();
}

// Render testimonials
function renderTestimonials() {
    const testimonials = [
        {
            name: "Your Name Here",
            role: "Happy Customer",
            image: "?",
            rating: 5,
            text: "Be the first to share your experience with BuildQuote Pro! We're just getting started and can't wait to help you find the perfect builder for your project.",
            project: "Your Project Could Be Here"
        },
        {
            name: "Future Builder Partner",
            role: "Construction Professional",
            image: "?",
            rating: 5,
            text: "Join our growing network of verified builders. We're building a platform that connects quality builders with property owners who need their expertise.",
            project: "Join Our Network Today"
        },
        {
            name: "Coming Soon",
            role: "Real Stories",
            image: "?",
            rating: 5,
            text: "Real testimonials from real customers will appear here as we grow. We're committed to transparency and authentic reviews from verified users.",
            project: "Building Trust Together"
        }
    ];

    return testimonials.map((t, index) => `
        <div class="testimonial-card glass-card ${index === 0 ? 'active' : ''}">
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">${t.text}</p>
            <div class="testimonial-rating">
                ${'⭐'.repeat(t.rating)}
            </div>
            <div class="testimonial-project">${t.project}</div>
            <div class="testimonial-author">
                <div class="author-avatar">${t.image}</div>
                <div class="author-info">
                    <strong>${t.name}</strong>
                    <span>${t.role}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render platform benefits
function renderPlatformBenefits() {
    const benefits = [
        {
            icon: "💰",
            title: "Transparent Pricing",
            description: "Compare multiple quotes side-by-side with detailed breakdowns. No hidden fees, no surprises.",
            features: ["Detailed cost breakdown", "Compare multiple quotes", "No hidden charges"]
        },
        {
            icon: "✅",
            title: "Quality Assurance",
            description: "All builders are thoroughly vetted and verified. We ensure only qualified professionals join our platform.",
            features: ["Verified credentials", "Background checks", "Quality reviews"]
        },
        {
            icon: "⚡",
            title: "Save Time",
            description: "Get quotes from multiple builders in hours instead of spending weeks searching and contacting individually.",
            features: ["Instant notifications", "Quick responses", "Streamlined process"]
        },
        {
            icon: "🎯",
            title: "Expert Support",
            description: "Our team of construction experts is available 24/7 to guide you through every step of your project.",
            features: ["24/7 availability", "Expert guidance", "Project assistance"]
        },
        {
            icon: "🔒",
            title: "Secure Platform",
            description: "Your data and transactions are protected with bank-level security. Build with confidence and peace of mind.",
            features: ["Encrypted data", "Secure payments", "Privacy protected"]
        },
        {
            icon: "🎨",
            title: "Flexible Options",
            description: "Whether it's residential, commercial, or renovation - find builders specialized in your exact project type.",
            features: ["All project types", "Custom requirements", "Specialized builders"]
        }
    ];

    return benefits.map(benefit => `
        <div class="benefit-card card glass-card animate-on-scroll">
            <div class="benefit-icon-large">${benefit.icon}</div>
            <h3>${benefit.title}</h3>
            <p class="benefit-description">${benefit.description}</p>
            <ul class="benefit-features">
                ${benefit.features.map(f => `<li><span class="check-icon">✓</span> ${f}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Render FAQs
function renderFAQs() {
    const faqs = [
        { q: "How does BuildQuote Pro work?", a: "Simply add your plot details and project requirements. Verified builders in your area will send you competitive quotes. Compare, choose, and start building!" },
        { q: "Is it free to get quotes?", a: "Yes! Getting quotes is completely free for property owners. You only pay the builder you choose to work with." },
        { q: "How are builders verified?", a: "All builders go through a rigorous verification process including license checks, insurance verification, and quality reviews of past work." },
        { q: "What if I'm not satisfied with the quotes?", a: "You're never obligated to accept any quote. You can request more quotes or adjust your requirements anytime." }
    ];

    return faqs.map((faq, i) => `
        <div class="faq-item" onclick="toggleFAQ(${i})">
            <div class="faq-question">
                <span>${faq.q}</span>
                <div class="faq-icon">+</div>
            </div>
            <div class="faq-answer">
                <p>${faq.a}</p>
            </div>
        </div>
    `).join('');
}

// Toggle FAQ
function toggleFAQ(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, i) => {
        if (i === index) {
            item.classList.toggle('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Newsletter handler
function handleNewsletter(event) {
    event.preventDefault();
    showToast('Thanks for subscribing! 🎉', 'success');
    event.target.reset();
}

// Initialize particles
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        container.appendChild(particle);
    }
}

// Initialize counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.dataset.target);
                const isDecimal = counter.dataset.decimal === 'true';
                animateCounter(counter, target, isDecimal);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, isDecimal = false) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    }, stepTime);
}

// Initialize scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// Testimonial slider
let currentTestimonial = 0;
function initTestimonialSlider() {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % 3;
        goToTestimonial(currentTestimonial);
    }, 5000);
}

function goToTestimonial(index) {
    currentTestimonial = index;
    const track = document.getElementById('testimonials-track');
    const indicators = document.querySelectorAll('.indicator');

    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
}

// Signup choice page
function renderSignupChoicePage() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <div class="auth-page">
            <div class="auth-container" style="max-width: 800px;">
                <div class="auth-header">
                    <h1>Join <span class="text-gradient">BuildQuote Pro</span></h1>
                    <p>Choose how you want to use our platform</p>
                </div>
                <div class="choice-grid">
                    <div class="card choice-card glass-card" onclick="navigateTo('customer-signup')">
                        <div class="choice-badge">Popular</div>
                        <div class="icon">🏠</div>
                        <h3>I'm a Property Owner</h3>
                        <p>I have a plot and I'm looking for builders to construct my project</p>
                        <ul class="choice-features">
                            <li>✓ Get multiple quotes</li>
                            <li>✓ AI budget advisor</li>
                            <li>✓ Verified builders</li>
                        </ul>
                        <button class="btn btn-primary btn-full">Get Started</button>
                    </div>
                    <div class="card choice-card glass-card" onclick="navigateTo('builder-signup')">
                        <div class="icon">👷</div>
                        <h3>I'm a Builder</h3>
                        <p>I'm a construction professional looking for new projects and clients</p>
                        <ul class="choice-features">
                            <li>✓ Find new projects</li>
                            <li>✓ Build your reputation</li>
                            <li>✓ Grow your business</li>
                        </ul>
                        <button class="btn btn-secondary btn-full">Join as Builder</button>
                    </div>
                </div>
                <div class="auth-footer">
                    Already have an account? <a href="#" onclick="navigateTo('login')">Log in</a>
                </div>
            </div>
        </div>
    `;
}

function addEnhancedHomeStyles() {
    if (document.getElementById('enhanced-home-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'enhanced-home-styles';
    styles.textContent = `
        /* Particles */
        .particles-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(139, 92, 246, 0.3);
            border-radius: 50%;
            animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }

        /* Hero Enhancements */
        .hero {
            position: relative;
            z-index: 1;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2) var(--space-4);
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1));
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            color: var(--primary-300);
            margin-bottom: var(--space-6);
        }

        .badge-glow {
            animation: pulse 2s ease-in-out infinite;
        }

        .badge-new {
            background: var(--gradient-secondary);
            padding: 2px 8px;
            border-radius: var(--radius-full);
            font-size: 10px;
            font-weight: 700;
            color: white;
        }

        .animated-gradient {
            animation: gradientShift 3s ease-in-out infinite;
            background-size: 200% auto;
        }

        .btn-glow {
            animation: glow 3s ease-in-out infinite;
        }

        .btn-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
            0% { left: -100%; }
            50%, 100% { left: 100%; }
        }

        .hero-trust {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            margin-top: var(--space-8);
            padding-top: var(--space-8);
            border-top: 1px solid var(--border-light);
        }

        .trust-avatars {
            display: flex;
        }

        .trust-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: white;
            border: 2px solid var(--bg-primary);
            margin-left: -10px;
        }

        .trust-avatar:first-child {
            margin-left: 0;
        }

        .trust-avatar.more {
            background: var(--gradient-secondary);
            font-size: 10px;
        }

        .trust-text {
            color: var(--text-muted);
            font-size: var(--font-size-sm);
        }

        /* Hero Features Grid */
        .hero-features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-4);
        }

        .feature-highlight-card {
            position: relative;
            overflow: hidden;
            padding: var(--space-6);
            text-align: center;
            transition: all var(--transition-base);
        }

        .feature-highlight-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
        }

        .feature-icon-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: var(--space-4);
        }

        .feature-icon {
            font-size: 3rem;
            position: relative;
            z-index: 2;
        }

        .feature-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
            animation: pulseGlow 3s ease-in-out infinite;
            pointer-events: none;
        }

        @keyframes pulseGlow {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        .feature-highlight-card h4 {
            font-size: var(--font-size-lg);
            font-weight: 700;
            margin-bottom: var(--space-2);
            color: var(--text-primary);
        }

        .feature-highlight-card p {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            line-height: 1.5;
        }

        @keyframes rotateGlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Floating Elements */
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .floating-card {
            position: absolute;
            padding: var(--space-3) var(--space-4);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            font-size: var(--font-size-sm);
            color: var(--text-primary);
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-lg);
            animation: floatCard 6s ease-in-out infinite;
        }

        .fc-1 { top: 10%; left: -20%; animation-delay: 0s; }
        .fc-2 { top: 50%; right: -15%; animation-delay: -2s; }
        .fc-3 { bottom: 15%; left: -10%; animation-delay: -4s; }

        @keyframes floatCard {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
        }

        /* Scroll Indicator */
        .hero-scroll-indicator {
            position: absolute;
            bottom: var(--space-8);
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-2);
            color: var(--text-muted);
            font-size: var(--font-size-xs);
            animation: bounce 2s ease-in-out infinite;
        }

        .scroll-arrow {
            width: 20px;
            height: 30px;
            border: 2px solid var(--text-muted);
            border-radius: 10px;
            position: relative;
        }

        .scroll-arrow::after {
            content: '';
            position: absolute;
            top: 6px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 8px;
            background: var(--primary-400);
            border-radius: 2px;
            animation: scrollDot 2s ease-in-out infinite;
        }

        @keyframes scrollDot {
            0%, 100% { top: 6px; opacity: 1; }
            50% { top: 14px; opacity: 0.5; }
        }

        /* Brands Section */
        .brands-section {
            padding: var(--space-12) 0;
            border-top: 1px solid var(--border-light);
            border-bottom: 1px solid var(--border-light);
        }

        .brands-title {
            text-align: center;
            color: var(--text-muted);
            font-size: var(--font-size-sm);
            margin-bottom: var(--space-6);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .brands-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: var(--space-10);
            flex-wrap: wrap;
        }

        .brand-logo {
            font-size: var(--font-size-lg);
            color: var(--text-muted);
            opacity: 0.6;
            transition: all var(--transition-base);
        }

        .brand-logo:hover {
            opacity: 1;
            color: var(--primary-400);
        }

        /* Section Badge */
        .section-badge {
            display: inline-block;
            padding: var(--space-2) var(--space-4);
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: var(--radius-full);
            font-size: var(--font-size-xs);
            font-weight: 600;
            color: var(--primary-400);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: var(--space-4);
        }

        /* Features Enhanced */
        .steps-container {
            position: relative;
        }

        .step-line {
            display: none;
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 2px;
            background: linear-gradient(90deg, var(--primary-600), var(--accent-500), var(--primary-600));
        }

        @media (min-width: 968px) {
            .step-line {
                display: block;
            }
        }

        .feature-card {
            position: relative;
            padding: var(--space-8);
            text-align: center;
        }

        .step-number {
            position: absolute;
            top: var(--space-4);
            right: var(--space-4);
            font-size: var(--font-size-2xl);
            font-weight: 800;
            color: rgba(139, 92, 246, 0.2);
        }

        .feature-card .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto var(--space-6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            background: var(--gradient-primary);
            border-radius: var(--radius-2xl);
            position: relative;
        }

        .icon-ring {
            position: absolute;
            inset: -5px;
            border: 2px dashed rgba(139, 92, 246, 0.3);
            border-radius: var(--radius-2xl);
            animation: spinSlow 20s linear infinite;
        }

        @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .feature-list {
            text-align: left;
            margin-top: var(--space-4);
            padding-top: var(--space-4);
            border-top: 1px solid var(--border-light);
        }

        .feature-list li {
            padding: var(--space-2) 0;
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        }

        /* Why Us Section */
        .why-us-section {
            padding: var(--space-24) 0;
        }

        .why-us-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-12);
            align-items: center;
        }

        @media (max-width: 968px) {
            .why-us-grid {
                grid-template-columns: 1fr;
            }
        }

        .why-us-description {
            color: var(--text-muted);
            font-size: var(--font-size-lg);
            margin-bottom: var(--space-8);
        }

        .benefits-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-4);
        }

        .benefit-item {
            display: flex;
            gap: var(--space-4);
            padding: var(--space-4);
            background: var(--glass-bg);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-xl);
            transition: all var(--transition-base);
        }

        .benefit-item:hover {
            border-color: var(--primary-400);
            transform: translateX(8px);
        }

        .benefit-icon {
            font-size: 1.5rem;
        }

        .benefit-content h4 {
            font-size: var(--font-size-base);
            margin-bottom: var(--space-1);
        }

        .benefit-content p {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        }

        /* Visual cards */
        .why-us-visual {
            position: relative;
            height: 400px;
        }

        .visual-card {
            position: absolute;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-xl);
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-xl);
        }

        .visual-card.main-card {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: var(--space-6);
            width: 280px;
        }

        .visual-header {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            margin-bottom: var(--space-4);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--success-500);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        .visual-content h4 {
            font-size: var(--font-size-lg);
            margin-bottom: var(--space-4);
        }

        .progress-bar {
            height: 8px;
            background: rgba(139, 92, 246, 0.2);
            border-radius: var(--radius-full);
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: var(--gradient-primary);
            border-radius: var(--radius-full);
            animation: progressGrow 2s ease-out;
        }

        @keyframes progressGrow {
            from { width: 0; }
        }

        .progress-text {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            margin-top: var(--space-2);
        }

        .visual-card.side-card {
            padding: var(--space-3) var(--space-4);
            display: flex;
            flex-direction: column;
            gap: var(--space-1);
            animation: floatCard 6s ease-in-out infinite;
        }

        .side-card span {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
        }

        .side-card strong {
            font-size: var(--font-size-lg);
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .sc-1 { top: 15%; left: 10%; animation-delay: -2s; }
        .sc-2 { bottom: 15%; right: 10%; animation-delay: -4s; }

        /* Testimonials */
        .testimonials-section {
            padding: var(--space-24) 0;
            overflow: hidden;
        }

        .testimonials-slider {
            overflow: hidden;
            margin: 0 -var(--space-6);
        }

        .testimonials-track {
            display: flex;
            transition: transform 0.5s ease-out;
        }

        .testimonial-card {
            flex: 0 0 100%;
            padding: var(--space-8);
            margin: 0 var(--space-6);
            text-align: center;
        }

        .testimonial-quote {
            font-size: 4rem;
            color: var(--primary-400);
            opacity: 0.5;
            line-height: 1;
            margin-bottom: var(--space-4);
        }

        .testimonial-text {
            font-size: var(--font-size-xl);
            color: var(--text-primary);
            line-height: 1.8;
            margin-bottom: var(--space-6);
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .testimonial-rating {
            font-size: var(--font-size-lg);
            margin-bottom: var(--space-2);
        }

        .testimonial-project {
            font-size: var(--font-size-sm);
            color: var(--primary-400);
            margin-bottom: var(--space-6);
        }

        .testimonial-author {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-4);
        }

        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: white;
        }

        .author-info {
            text-align: left;
        }

        .author-info strong {
            display: block;
        }

        .author-info span {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        }

        .testimonial-indicators {
            display: flex;
            justify-content: center;
            gap: var(--space-2);
            margin-top: var(--space-6);
        }

        .indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--glass-bg);
            border: 2px solid var(--border-light);
            cursor: pointer;
            transition: all var(--transition-base);
        }

        .indicator.active {
            background: var(--primary-500);
            border-color: var(--primary-500);
            transform: scale(1.2);
        }

        /* Platform Benefits */
        .benefits-section {
            padding: var(--space-24) 0;
            background: linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.03) 100%);
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-6);
            margin-top: var(--space-12);
        }

        @media (max-width: 968px) {
            .benefits-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 640px) {
            .benefits-grid {
                grid-template-columns: 1fr;
            }
        }

        .benefit-card {
            padding: var(--space-8);
            text-align: left;
            position: relative;
            transition: all var(--transition-base);
            border: 1px solid var(--border-light);
        }

        .benefit-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-2xl);
            border-color: var(--primary-400);
        }

        .benefit-icon-large {
            font-size: 3.5rem;
            margin-bottom: var(--space-4);
            display: inline-block;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .benefit-card h3 {
            font-size: var(--font-size-xl);
            font-weight: 700;
            margin-bottom: var(--space-3);
            color: var(--text-primary);
        }

        .benefit-description {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: var(--space-4);
        }

        .benefit-features {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .benefit-features li {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2) 0;
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        }

        .check-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            background: var(--gradient-primary);
            border-radius: 50%;
            color: white;
            font-size: 12px;
            font-weight: 700;
            flex-shrink: 0;
        }

        /* FAQ */
        .faq-section {
            padding: var(--space-24) 0;
        }

        .faq-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .faq-item {
            background: var(--glass-bg);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-xl);
            margin-bottom: var(--space-4);
            overflow: hidden;
            cursor: pointer;
            transition: all var(--transition-base);
        }

        .faq-item:hover {
            border-color: var(--primary-400);
        }

        .faq-question {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-5) var(--space-6);
            font-weight: 600;
        }

        .faq-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 50%;
            color: var(--primary-400);
            transition: all var(--transition-base);
        }

        .faq-item.active .faq-icon {
            transform: rotate(45deg);
            background: var(--primary-500);
            color: white;
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: all var(--transition-base);
        }

        .faq-item.active .faq-answer {
            max-height: 200px;
        }

        .faq-answer p {
            padding: 0 var(--space-6) var(--space-5);
            color: var(--text-muted);
        }

        /* CTA Enhanced */
        .cta-section {
            padding: var(--space-24) 0;
        }

        .cta-card {
            position: relative;
            padding: var(--space-16);
            text-align: center;
            overflow: hidden;
        }

        .cta-background {
            position: absolute;
            inset: 0;
            background: var(--gradient-primary);
            opacity: 0.1;
        }

        .cta-icon {
            font-size: 4rem;
            margin-bottom: var(--space-6);
        }

        .cta-content {
            position: relative;
            z-index: 1;
        }

        .cta-content h2 {
            margin-bottom: var(--space-4);
        }

        .cta-content p {
            color: var(--text-muted);
            margin-bottom: var(--space-8);
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-buttons {
            display: flex;
            justify-content: center;
            gap: var(--space-4);
            margin-bottom: var(--space-6);
            flex-wrap: wrap;
        }

        .btn-arrow {
            margin-left: var(--space-2);
            transition: transform var(--transition-base);
        }

        .btn:hover .btn-arrow {
            transform: translateX(4px);
        }

        .cta-features {
            display: flex;
            justify-content: center;
            gap: var(--space-6);
            flex-wrap: wrap;
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        }

        .cta-features span {
            display: flex;
            align-items: center;
            gap: var(--space-2);
        }

        /* Newsletter */
        .newsletter-section {
            padding: var(--space-16) 0;
        }

        .newsletter-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--space-8);
            padding: var(--space-8);
            background: var(--glass-bg);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-2xl);
            flex-wrap: wrap;
        }

        .newsletter-content h3 {
            margin-bottom: var(--space-2);
        }

        .newsletter-content p {
            color: var(--text-muted);
        }

        .newsletter-form {
            display: flex;
            gap: var(--space-3);
            flex: 1;
            max-width: 400px;
        }

        .newsletter-form .form-input {
            flex: 1;
        }

        @media (max-width: 768px) {
            .newsletter-card {
                flex-direction: column;
                text-align: center;
            }

            .newsletter-form {
                width: 100%;
                max-width: none;
            }
        }

        /* Scroll Animations */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.6s ease-out;
        }

        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }

        /* Glass Card */
        .glass-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
        }

        /* Choice card enhancements */
        .choice-card {
            position: relative;
        }

        .choice-badge {
            position: absolute;
            top: -10px;
            right: var(--space-6);
            padding: var(--space-1) var(--space-3);
            background: var(--gradient-secondary);
            border-radius: var(--radius-full);
            font-size: var(--font-size-xs);
            font-weight: 600;
            color: white;
        }

        .choice-features {
            text-align: left;
            margin: var(--space-4) 0;
        }

        .choice-features li {
            padding: var(--space-2) 0;
            font-size: var(--font-size-sm);
            color: var(--text-muted);
        }

        /* Hero Stats Grid */
        .hero-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-4);
        }

        /* Features Grid */
        .features-section {
            padding: var(--space-24) 0;
        }

        .section-header {
            margin-bottom: var(--space-12);
        }

        .section-header h2 {
            margin-bottom: var(--space-4);
        }

        .section-header p {
            color: var(--text-muted);
            font-size: var(--font-size-lg);
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-6);
        }

        @media (max-width: 968px) {
            .features-grid {
                grid-template-columns: 1fr;
            }

            .hero-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .floating-elements {
                display: none;
            }
        }
    `;
    document.head.appendChild(styles);
}
