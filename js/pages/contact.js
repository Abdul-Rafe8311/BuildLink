/**
 * Contact Page
 * Contact form with company information
 */

function renderContactPage() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <div class="contact-page">
            <div class="container">
                <div class="section-header text-center">
                    <span class="section-badge">Get In Touch</span>
                    <h1>Contact <span class="text-gradient">Us</span></h1>
                    <p>Have questions? We'd love to hear from you. Send us a message!</p>
                </div>

                <div class="contact-grid">
                    <!-- Contact Information -->
                    <div class="contact-info-card">
                        <h3>Let's Connect</h3>
                        <p style="color: var(--text-muted); margin-bottom: var(--space-8);">
                            Whether you're a property owner looking for builders or a contractor seeking new opportunities, 
                            we're here to help you succeed.
                        </p>

                        <div class="contact-info-item">
                            <div class="icon">📧</div>
                            <div>
                                <h4>Email Us</h4>
                                <p><a href="mailto:hello@buildquotepro.com">hello@buildquotepro.com</a></p>
                            </div>
                        </div>

                        <div class="contact-info-item">
                            <div class="icon">📞</div>
                            <div>
                                <h4>Call Us</h4>
                                <p><a href="tel:+1-800-BUILD-PRO">+1-800-BUILD-PRO</a></p>
                                <p style="font-size: var(--font-size-xs);">Mon-Fri 9AM-6PM EST</p>
                            </div>
                        </div>

                        <div class="contact-info-item">
                            <div class="icon">📍</div>
                            <div>
                                <h4>Visit Us</h4>
                                <p>123 Construction Avenue<br>Suite 500<br>New York, NY 10001</p>
                            </div>
                        </div>

                        <div class="contact-info-item">
                            <div class="icon">💬</div>
                            <div>
                                <h4>Live Chat</h4>
                                <p>Chat with our AI assistant 24/7</p>
                                <button class="btn btn-sm btn-primary" onclick="ChatBot?.toggleChat()" style="margin-top: var(--space-2);">
                                    Open Chat 🤖
                                </button>
                            </div>
                        </div>

                        <div class="social-links">
                            <a href="#" class="social-link" title="Facebook">📘</a>
                            <a href="#" class="social-link" title="Twitter">🐦</a>
                            <a href="#" class="social-link" title="LinkedIn">💼</a>
                            <a href="#" class="social-link" title="Instagram">📷</a>
                            <a href="#" class="social-link" title="YouTube">🎬</a>
                        </div>
                    </div>

                    <!-- Contact Form -->
                    <div class="contact-form-card">
                        <h3>Send a Message</h3>
                        <p style="color: var(--text-muted); margin-bottom: var(--space-6);">
                            Fill out the form below and we'll get back to you within 24 hours.
                        </p>

                        <form class="contact-form" onsubmit="handleContactSubmit(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">First Name *</label>
                                    <input type="text" class="form-input" name="firstName" required placeholder="John">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Last Name *</label>
                                    <input type="text" class="form-input" name="lastName" required placeholder="Doe">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Email Address *</label>
                                <input type="email" class="form-input" name="email" required placeholder="john@example.com">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" class="form-input" name="phone" placeholder="+1 (555) 000-0000">
                            </div>

                            <div class="form-group">
                                <label class="form-label">I am a...</label>
                                <select class="form-select" name="userType">
                                    <option value="property-owner">Property Owner</option>
                                    <option value="builder">Builder/Contractor</option>
                                    <option value="investor">Real Estate Investor</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Subject *</label>
                                <select class="form-select" name="subject" required>
                                    <option value="">Select a topic</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="quote">Getting Quotes</option>
                                    <option value="builder">Becoming a Builder</option>
                                    <option value="support">Technical Support</option>
                                    <option value="partnership">Partnership Opportunity</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Message *</label>
                                <textarea class="form-textarea" name="message" rows="5" required 
                                    placeholder="Tell us how we can help you..."></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-lg btn-full btn-glow">
                                Send Message 📤
                            </button>
                        </form>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div style="margin-top: var(--space-16);">
                    <div class="section-header text-center">
                        <h2>Frequently Asked <span class="text-gradient">Questions</span></h2>
                    </div>
                    <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
                        ${renderContactFAQs()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderContactFAQs() {
    const faqs = [
        {
            q: 'How quickly will I get a response?',
            a: 'We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.'
        },
        {
            q: 'Is BuildQuote Pro available in my area?',
            a: 'BuildQuote Pro operates nationwide in the US and is expanding internationally. Enter your location when signing up to see available builders.'
        },
        {
            q: 'How do I report an issue with a builder?',
            a: 'You can report issues through your dashboard or by contacting our support team. We take all complaints seriously and investigate promptly.'
        },
        {
            q: 'Can I schedule a demo?',
            a: 'Absolutely! Select "Partnership Opportunity" in the form above and mention you\'d like a demo. We\'ll set up a personalized walkthrough.'
        }
    ];

    return faqs.map((faq, i) => `
        <div class="faq-item" onclick="toggleContactFAQ(${i})">
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

function toggleContactFAQ(index) {
    const faqItems = document.querySelectorAll('.contact-page .faq-item');
    faqItems.forEach((item, i) => {
        if (i === index) {
            item.classList.toggle('active');
        } else {
            item.classList.remove('active');
        }
    });
}

async function handleContactSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending... ⏳';

    try {
        // Save to backend or localStorage
        if (Config.shouldUseBackend()) {
            await APIService.submitContactMessage({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone || null,
                userType: data.userType,
                subject: data.subject,
                message: data.message
            });
        } else {
            await DB.insert('contact_messages', {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone || null,
                user_type: data.userType,
                subject: data.subject,
                message: data.message,
                status: 'new'
            });
        }

        showToast('Message sent successfully! We\'ll get back to you soon. 📧', 'success');
        event.target.reset();
    } catch (error) {
        console.error('Contact form submission error:', error);
        showToast('Failed to send message. Please try again.', 'error');
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

