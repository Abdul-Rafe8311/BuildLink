/**
 * About Page
 * Company story, team, and values
 */

function renderAboutPage() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <div class="about-page">
            <div class="container">
                <!-- Hero Section -->
                <div class="about-hero">
                    <span class="section-badge">Our Story</span>
                    <h1>About <span class="text-gradient">BuildQuote Pro</span></h1>
                    <p>We're on a mission to revolutionize how property owners connect with trusted construction professionals. Building dreams, one quote at a time.</p>
                </div>

                <!-- Stats Section -->
                <div class="about-stats">
                    <div class="about-stat">
                        <div class="value">0</div>
                        <div class="label">Verified Builders</div>
                    </div>
                    <div class="about-stat">
                        <div class="value">0</div>
                        <div class="label">Projects Completed</div>
                    </div>
                    <div class="about-stat">
                        <div class="value">$0</div>
                        <div class="label">Total Contract Value</div>
                    </div>
                    <div class="about-stat">
                        <div class="value">N/A</div>
                        <div class="label">Average Rating</div>
                    </div>
                </div>

                <!-- Mission Section -->
                <div class="values-section" style="margin-bottom: var(--space-16);">
                    <div class="section-header text-center" style="margin-bottom: var(--space-8);">
                        <h2>Our <span class="text-gradient">Mission</span></h2>
                    </div>
                    <p style="text-align: center; max-width: 800px; margin: 0 auto; font-size: var(--font-size-lg); color: var(--text-secondary); line-height: 1.8;">
                        At BuildQuote Pro, we believe that finding the right builder shouldn't be a gamble. 
                        We're creating a platform that brings transparency, trust, and efficiency to the construction industry. 
                        Whether you're building your dream home or renovating an office space, we'll connect you with 
                        verified professionals who deliver quality work at fair prices.
                    </p>
                </div>

                <!-- Timeline Section -->
                <div class="timeline-section">
                    <div class="section-header text-center">
                        <span class="section-badge">Our Journey</span>
                        <h2>Company <span class="text-gradient">Timeline</span></h2>
                    </div>
                    <div class="timeline">
                        <div class="timeline-item animate-on-scroll">
                            <div class="timeline-year">2026</div>
                            <h4>Platform Launch</h4>
                            <p>BuildQuote Pro is launching with a vision to revolutionize how property owners connect with construction professionals.</p>
                        </div>
                        <div class="timeline-item animate-on-scroll">
                            <div class="timeline-year">Coming Soon</div>
                            <h4>First Builders</h4>
                            <p>We'll onboard our first verified builders and start connecting them with property owners.</p>
                        </div>
                        <div class="timeline-item animate-on-scroll">
                            <div class="timeline-year">Future</div>
                            <h4>AI Features</h4>
                            <p>AI-powered budget advisor and smart matching algorithms to help customers plan projects more effectively.</p>
                        </div>
                        <div class="timeline-item animate-on-scroll">
                            <div class="timeline-year">Vision</div>
                            <h4>National Expansion</h4>
                            <p>Our goal is to expand operations nationwide with verified builders in every major city.</p>
                        </div>
                    </div>
                </div>

                <!-- Team Section -->
                <div class="team-section">
                    <div class="section-header text-center">
                        <span class="section-badge">Leadership</span>
                        <h2>Meet Our <span class="text-gradient">Team</span></h2>
                        <p>The people behind BuildQuote Pro's success</p>
                    </div>
                    <div class="team-grid">
                        <div class="team-card animate-on-scroll">
                            <div class="team-avatar">JM</div>
                            <h4>James Morrison</h4>
                            <div class="role">CEO & Co-Founder</div>
                            <p>Former construction manager with 15 years of industry experience. Passionate about bringing tech to traditional industries.</p>
                        </div>
                        <div class="team-card animate-on-scroll">
                            <div class="team-avatar">SC</div>
                            <h4>Sarah Chen</h4>
                            <div class="role">CTO & Co-Founder</div>
                            <p>Ex-Google engineer specializing in marketplace platforms. Built scalable systems serving millions of users.</p>
                        </div>
                        <div class="team-card animate-on-scroll">
                            <div class="team-avatar">MR</div>
                            <h4>Michael Rodriguez</h4>
                            <div class="role">VP of Operations</div>
                            <p>Operations expert who previously scaled logistics for a Fortune 500 company. Ensures smooth builder onboarding.</p>
                        </div>
                        <div class="team-card animate-on-scroll">
                            <div class="team-avatar">AP</div>
                            <h4>Aisha Patel</h4>
                            <div class="role">Head of Customer Success</div>
                            <p>Customer experience specialist dedicated to making every interaction memorable and helpful.</p>
                        </div>
                    </div>
                </div>

                <!-- Values Section -->
                <div class="values-section">
                    <div class="section-header text-center" style="margin-bottom: var(--space-8);">
                        <h2>Our Core <span class="text-gradient">Values</span></h2>
                    </div>
                    <div class="values-grid">
                        <div class="value-card animate-on-scroll">
                            <div class="value-icon">🛡️</div>
                            <h4>Trust & Transparency</h4>
                            <p>Every builder is verified. Every quote is honest. We believe in complete transparency in all our dealings.</p>
                        </div>
                        <div class="value-card animate-on-scroll">
                            <div class="value-icon">🎯</div>
                            <h4>Quality First</h4>
                            <p>We only partner with builders who meet our rigorous quality standards. Your project deserves the best.</p>
                        </div>
                        <div class="value-card animate-on-scroll">
                            <div class="value-icon">🤝</div>
                            <h4>Customer Obsession</h4>
                            <p>Every feature we build, every decision we make is centered around providing the best experience for our users.</p>
                        </div>
                        <div class="value-card animate-on-scroll">
                            <div class="value-icon">🚀</div>
                            <h4>Innovation</h4>
                            <p>We're constantly pushing boundaries with AI, automation, and new technologies to improve construction.</p>
                        </div>
                        <div class="value-card animate-on-scroll">
                            <div class="value-icon">🌱</div>
                            <h4>Sustainability</h4>
                            <p>We promote eco-friendly building practices and connect users with green-certified builders.</p>
                        </div>
                        <div class="value-card animate-on-scroll">
                            <div class="value-icon">💪</div>
                            <h4>Community</h4>
                            <p>We're building more than a platform—we're creating a community of builders and property owners.</p>
                        </div>
                    </div>
                </div>

                <!-- CTA Section -->
                <div style="text-align: center; margin-top: var(--space-16);">
                    <h2 style="margin-bottom: var(--space-4);">Ready to Join Our Community?</h2>
                    <p style="color: var(--text-muted); margin-bottom: var(--space-6);">
                        Whether you're building your dream home or growing your construction business, we're here to help.
                    </p>
                    <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary btn-lg btn-glow" onclick="navigateTo('customer-signup')">
                            Get Quotes Now 🚀
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="navigateTo('builder-signup')">
                            Join as Builder 👷
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize scroll animations
    initAboutAnimations();
}

function initAboutAnimations() {
    const elements = document.querySelectorAll('.about-page .animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}
