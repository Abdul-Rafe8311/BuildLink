/**
 * Authentication Pages
 */

// Login Page
function renderLoginPage() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <div class="auth-page">
            <div class="auth-container">
                <div class="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account to continue</p>
                </div>
                <div class="auth-card">
                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" name="password" class="form-input" placeholder="Enter your password" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full btn-lg">
                            Sign In
                        </button>
                    </form>
                </div>
                <div class="auth-footer">
                    Don't have an account? <a href="#" onclick="navigateTo('signup-choice')">Sign up</a>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
        showLoading();
        const user = await Auth.login(email, password);
        hideLoading();
        showToast('Welcome back!', 'success');

        // Redirect based on role
        if (user.role === 'customer') {
            navigateTo('customer-dashboard');
        } else if (user.role === 'builder') {
            navigateTo('builder-dashboard');
        }
    } catch (error) {
        hideLoading();
        showToast(error.message, 'error');
    }
}

// Customer Signup Page
function renderCustomerSignupPage() {
    const main = document.getElementById('main-content');

    main.innerHTML = `
        <div class="auth-page">
            <div class="auth-container">
                <div class="auth-header">
                    <h1>Create Your Account</h1>
                    <p>Join as a property owner and start getting quotes</p>
                </div>
                <div class="auth-card">
                    <form id="customer-signup-form" onsubmit="handleCustomerSignup(event)">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" name="full_name" class="form-input" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number</label>
                            <input type="tel" name="phone" class="form-input" placeholder="Enter your phone number" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address</label>
                            <input type="text" name="address" class="form-input" placeholder="Enter your address">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" name="password" class="form-input" placeholder="Create a password" required minlength="6">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" name="confirm_password" class="form-input" placeholder="Confirm password" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full btn-lg">
                            Create Account
                        </button>
                    </form>
                </div>
                <div class="auth-footer">
                    Already have an account? <a href="#" onclick="navigateTo('login')">Log in</a>
                </div>
            </div>
        </div>
    `;
}

async function handleCustomerSignup(event) {
    event.preventDefault();
    const form = event.target;

    const formData = {
        full_name: form.full_name.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        password: form.password.value,
        confirm_password: form.confirm_password.value
    };

    // Validate
    const validation = validateForm(formData, {
        full_name: { required: true, label: 'Full name' },
        email: { required: true, email: true, label: 'Email' },
        phone: { required: true, label: 'Phone number' },
        password: { required: true, minLength: 6, label: 'Password' },
        confirm_password: { required: true, match: 'password', label: 'Passwords' }
    });

    if (!validation.isValid) {
        showFormErrors(validation.errors, form);
        return;
    }

    try {
        showLoading();
        await Auth.signupCustomer(formData);
        hideLoading();
        showToast('Account created successfully!', 'success');
        navigateTo('customer-dashboard');
    } catch (error) {
        hideLoading();
        showToast(error.message, 'error');
    }
}

// Builder Signup Page
function renderBuilderSignupPage() {
    const main = document.getElementById('main-content');

    const specializationOptions = [
        'Residential', 'Commercial', 'Industrial', 'Renovation',
        'Interior Design', 'Landscaping', 'Green Building', 'Custom Homes'
    ];

    main.innerHTML = `
        <div class="auth-page">
            <div class="auth-container" style="max-width: 600px;">
                <div class="auth-header">
                    <h1>Join as a Builder</h1>
                    <p>Create your company profile and start receiving project requests</p>
                </div>
                <div class="auth-card">
                    <form id="builder-signup-form" onsubmit="handleBuilderSignup(event)">
                        <div class="form-group">
                            <label class="form-label">Company Name</label>
                            <input type="text" name="company_name" class="form-input" placeholder="Enter your company name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" name="email" class="form-input" placeholder="Enter your business email" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" name="phone" class="form-input" placeholder="Business phone" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">License Number</label>
                                <input type="text" name="license_number" class="form-input" placeholder="Your license #" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Business Address</label>
                            <input type="text" name="address" class="form-input" placeholder="Enter your business address">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Company Description</label>
                            <textarea name="description" class="form-textarea" placeholder="Describe your company, experience, and expertise..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Specializations</label>
                            <div class="specializations-grid">
                                ${specializationOptions.map(spec => `
                                    <label class="form-check">
                                        <input type="checkbox" name="specializations" value="${spec}">
                                        <span class="form-check-label">${spec}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" name="password" class="form-input" placeholder="Create a password" required minlength="6">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" name="confirm_password" class="form-input" placeholder="Confirm password" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full btn-lg">
                            Create Builder Account
                        </button>
                    </form>
                </div>
                <div class="auth-footer">
                    Already have an account? <a href="#" onclick="navigateTo('login')">Log in</a>
                </div>
            </div>
        </div>
    `;

    addBuilderSignupStyles();
}

function addBuilderSignupStyles() {
    if (document.getElementById('builder-signup-styles')) return;
    const styles = document.createElement('style');
    styles.id = 'builder-signup-styles';
    styles.textContent = `
        .specializations-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-3);
        }
        @media (max-width: 480px) {
            .specializations-grid { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(styles);
}

async function handleBuilderSignup(event) {
    event.preventDefault();
    const form = event.target;

    const specializations = Array.from(form.querySelectorAll('input[name="specializations"]:checked'))
        .map(input => input.value);

    const formData = {
        company_name: form.company_name.value,
        email: form.email.value,
        phone: form.phone.value,
        license_number: form.license_number.value,
        address: form.address.value,
        description: form.description.value,
        specializations: specializations,
        password: form.password.value,
        confirm_password: form.confirm_password.value
    };

    const validation = validateForm(formData, {
        company_name: { required: true, label: 'Company name' },
        email: { required: true, email: true, label: 'Email' },
        phone: { required: true, label: 'Phone number' },
        license_number: { required: true, label: 'License number' },
        description: { required: true, label: 'Description' },
        password: { required: true, minLength: 6, label: 'Password' },
        confirm_password: { required: true, match: 'password', label: 'Passwords' }
    });

    if (!validation.isValid) {
        showFormErrors(validation.errors, form);
        return;
    }

    try {
        showLoading();
        await Auth.signupBuilder(formData);
        hideLoading();
        showToast('Builder account created successfully!', 'success');
        navigateTo('builder-dashboard');
    } catch (error) {
        hideLoading();
        showToast(error.message, 'error');
    }
}
