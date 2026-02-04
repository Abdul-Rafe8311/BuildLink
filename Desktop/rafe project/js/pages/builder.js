/**
 * Builder Portal Pages
 */

// Builder Dashboard
function renderBuilderDashboard() {
    const user = Auth.getCurrentUser();
    const profile = Auth.getCurrentProfile();

    if (!user || user.role !== 'builder') {
        navigateTo('login');
        return;
    }

    const myQuotes = DB.getByField('quotes', 'builder_id', user.id);
    const pendingQuotes = myQuotes.filter(q => q.status === 'pending');
    const acceptedQuotes = myQuotes.filter(q => q.status === 'accepted');
    const rejectedQuotes = myQuotes.filter(q => q.status === 'rejected');

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('dashboard')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Welcome, ${profile?.company_name || 'Builder'}!</h1>
                        <p class="dashboard-subtitle">Find projects and manage your quotes</p>
                    </div>
                    <button class="btn btn-primary" onclick="navigateTo('open-requests')">
                        Browse Open Requests
                    </button>
                </div>

                <div class="stats-grid">
                    <div class="card stat-card">
                        <div class="value">${myQuotes.length}</div>
                        <div class="label">Total Quotes</div>
                    </div>
                    <div class="card stat-card">
                        <div class="value">${pendingQuotes.length}</div>
                        <div class="label">Pending</div>
                    </div>
                    <div class="card stat-card">
                        <div class="value">${acceptedQuotes.length}</div>
                        <div class="label">Accepted</div>
                    </div>
                    <div class="card stat-card">
                        <div class="value">${rejectedQuotes.length}</div>
                        <div class="label">Rejected</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header-row">
                        <h2>Recent Quotes</h2>
                        <a href="#" onclick="navigateTo('builder-quotes')" class="btn btn-outline btn-sm">View All</a>
                    </div>
                    ${myQuotes.length === 0 ? `
                        <div class="empty-state">
                            <div class="icon">📝</div>
                            <h3>No quotes submitted yet</h3>
                            <p>Browse open quote requests and submit your first quote</p>
                            <button class="btn btn-primary" onclick="navigateTo('open-requests')">Browse Requests</button>
                        </div>
                    ` : `
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${myQuotes.slice(0, 5).map(quote => {
        const request = DB.getById('quote_requests', quote.quote_request_id);
        const plot = request ? DB.getById('plots', request.plot_id) : null;
        return `
                                            <tr>
                                                <td>${plot?.title || 'Unknown'}</td>
                                                <td>${formatCurrency(quote.amount)}</td>
                                                <td>${getStatusBadge(quote.status)}</td>
                                                <td>${timeAgo(quote.created_at)}</td>
                                            </tr>
                                        `;
    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    addDashboardStyles();
}

function renderBuilderSidebar(active) {
    const links = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard', page: 'builder-dashboard' },
        { id: 'requests', icon: '📋', label: 'Open Requests', page: 'open-requests' },
        { id: 'quotes', icon: '📝', label: 'My Quotes', page: 'builder-quotes' },
        { id: 'profile', icon: '🏢', label: 'Company Profile', page: 'builder-profile' }
    ];

    return `
        <aside class="sidebar">
            <nav class="sidebar-nav">
                ${links.map(link => `
                    <a href="#" class="sidebar-link ${active === link.id ? 'active' : ''}" onclick="navigateTo('${link.page}')">
                        <span class="icon">${link.icon}</span>
                        <span>${link.label}</span>
                    </a>
                `).join('')}
                <hr style="border-color: var(--glass-border); margin: var(--space-4) 0;">
                <a href="#" class="sidebar-link" onclick="Auth.logout()">
                    <span class="icon">🚪</span>
                    <span>Logout</span>
                </a>
            </nav>
        </aside>
    `;
}

// Open Quote Requests Page
function renderOpenRequests() {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'builder') { navigateTo('login'); return; }

    // Get all open quote requests that builder hasn't quoted on yet
    const allRequests = DB.getByField('quote_requests', 'status', 'open');
    const myQuotes = DB.getByField('quotes', 'builder_id', user.id);
    const quotedRequestIds = myQuotes.map(q => q.quote_request_id);

    const availableRequests = allRequests.filter(req => !quotedRequestIds.includes(req.id));

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('requests')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Open Quote Requests</h1>
                        <p class="dashboard-subtitle">Browse available projects and submit your quotes</p>
                    </div>
                </div>
                ${availableRequests.length === 0 ? `
                    <div class="empty-state">
                        <div class="icon">🔍</div>
                        <h3>No open requests available</h3>
                        <p>Check back later for new project requests from customers</p>
                    </div>
                ` : `
                    <div class="grid-3">
                        ${availableRequests.map(req => renderOpenRequestCard(req)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

function renderOpenRequestCard(request) {
    const plot = DB.getById('plots', request.plot_id);
    const customer = DB.getOneByField('customer_profiles', 'user_id', request.customer_id);

    return `
        <div class="card request-card">
            <div class="request-card-header">
                <h4>${plot?.title || 'Unknown Plot'}</h4>
                ${getStatusBadge(request.status)}
            </div>
            <div class="request-card-body">
                <div class="request-info">
                    <div class="request-info-row">
                        <span class="label">Project Type</span>
                        <span>${request.project_type}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Location</span>
                        <span>${plot?.city || ''}, ${plot?.state || ''}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Plot Size</span>
                        <span>${plot?.area_sqft?.toLocaleString() || 'N/A'} sq ft</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Budget</span>
                        <span>${request.budget_range || 'Not specified'}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Posted</span>
                        <span>${timeAgo(request.created_at)}</span>
                    </div>
                </div>
                <p style="margin-top: var(--space-4); font-size: var(--font-size-sm); color: var(--gray-300);">
                    ${request.requirements?.slice(0, 120)}${request.requirements?.length > 120 ? '...' : ''}
                </p>
            </div>
            <div class="request-card-footer">
                <button class="btn btn-outline btn-sm" onclick="viewRequestDetails('${request.id}')">View Details</button>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('submit-quote', '${request.id}')">Submit Quote</button>
            </div>
        </div>
    `;
}

function viewRequestDetails(requestId) {
    const request = DB.getById('quote_requests', requestId);
    const plot = DB.getById('plots', request.plot_id);
    const customer = DB.getOneByField('customer_profiles', 'user_id', request.customer_id);

    showModal('Project Details', `
        <div class="request-details">
            <h4 style="margin-bottom: var(--space-4);">${plot?.title || 'Unknown Plot'}</h4>
            <div class="request-info" style="margin-bottom: var(--space-6);">
                <div class="request-info-row">
                    <span class="label">Owner</span>
                    <span>${customer?.full_name || 'N/A'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Project Type</span>
                    <span>${request.project_type}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Location</span>
                    <span>${plot?.address || ''}, ${plot?.city || ''}, ${plot?.state || ''}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Plot Size</span>
                    <span>${plot?.area_sqft?.toLocaleString() || 'N/A'} sq ft</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Plot Type</span>
                    <span>${plot?.plot_type || 'N/A'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Budget Range</span>
                    <span>${request.budget_range || 'Not specified'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Expected Start</span>
                    <span>${request.expected_start ? formatDate(request.expected_start) : 'Flexible'}</span>
                </div>
            </div>
            <h5 style="margin-bottom: var(--space-2);">Requirements</h5>
            <p style="color: var(--gray-300); font-size: var(--font-size-sm);">${request.requirements}</p>
            ${plot?.description ? `
                <h5 style="margin: var(--space-4) 0 var(--space-2);">Plot Description</h5>
                <p style="color: var(--gray-300); font-size: var(--font-size-sm);">${plot.description}</p>
            ` : ''}
        </div>
    `, [
        { text: 'Close', class: 'btn-outline', onclick: 'closeModal()' },
        { text: 'Submit Quote', class: 'btn-primary', onclick: `closeModal(); navigateTo('submit-quote', '${requestId}')` }
    ]);
}

// Submit Quote Page
function renderSubmitQuote(requestId) {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'builder') { navigateTo('login'); return; }

    const request = DB.getById('quote_requests', requestId);
    if (!request) { navigateTo('open-requests'); return; }

    const plot = DB.getById('plots', request.plot_id);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('requests')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Submit Quote</h1>
                        <p class="dashboard-subtitle">for ${plot?.title || 'Project'} - ${request.project_type}</p>
                    </div>
                </div>
                <div class="card" style="max-width: 800px;">
                    <div class="card-body">
                        <div class="project-summary" style="background: rgba(0,0,0,0.2); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
                            <h5 style="margin-bottom: var(--space-2);">Project Summary</h5>
                            <p style="font-size: var(--font-size-sm); color: var(--gray-400); margin-bottom: var(--space-2);">
                                <strong>Location:</strong> ${plot?.city}, ${plot?.state} | 
                                <strong>Size:</strong> ${plot?.area_sqft?.toLocaleString()} sq ft | 
                                <strong>Budget:</strong> ${request.budget_range || 'Not specified'}
                            </p>
                            <p style="font-size: var(--font-size-sm); color: var(--gray-300);">${request.requirements}</p>
                        </div>
                        <form id="submit-quote-form" onsubmit="handleSubmitQuote(event, '${requestId}')">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Quote Amount ($) *</label>
                                    <input type="number" name="amount" class="form-input" placeholder="Enter your quote amount" required min="1">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Estimated Duration (Days) *</label>
                                    <input type="number" name="estimated_days" class="form-input" placeholder="e.g., 90" required min="1">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Scope of Work *</label>
                                <textarea name="scope_of_work" class="form-textarea" placeholder="Describe what's included in your quote..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Terms & Conditions</label>
                                <textarea name="terms" class="form-textarea" placeholder="Any special terms, payment schedules, warranties..."></textarea>
                            </div>
                            <div class="form-actions" style="display: flex; gap: var(--space-4); margin-top: var(--space-6);">
                                <button type="button" class="btn btn-outline" onclick="navigateTo('open-requests')">Cancel</button>
                                <button type="submit" class="btn btn-primary">Submit Quote</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    addDashboardStyles();
}

function handleSubmitQuote(event, requestId) {
    event.preventDefault();
    const form = event.target;
    const user = Auth.getCurrentUser();

    const data = {
        quote_request_id: requestId,
        builder_id: user.id,
        amount: parseFloat(form.amount.value),
        estimated_days: parseInt(form.estimated_days.value),
        scope_of_work: form.scope_of_work.value,
        terms: form.terms.value,
        status: 'pending'
    };

    DB.insert('quotes', data);
    showToast('Quote submitted successfully!', 'success');
    navigateTo('builder-quotes');
}

// Builder's Quotes Page
function renderBuilderQuotes() {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'builder') { navigateTo('login'); return; }

    const myQuotes = DB.getByField('quotes', 'builder_id', user.id);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('quotes')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">My Quotes</h1>
                        <p class="dashboard-subtitle">Track all your submitted quotes</p>
                    </div>
                </div>
                ${myQuotes.length === 0 ? `
                    <div class="empty-state">
                        <div class="icon">📝</div>
                        <h3>No quotes submitted yet</h3>
                        <p>Browse open requests and submit your first quote</p>
                        <button class="btn btn-primary" onclick="navigateTo('open-requests')">Browse Requests</button>
                    </div>
                ` : `
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${myQuotes.map(quote => {
        const request = DB.getById('quote_requests', quote.quote_request_id);
        const plot = request ? DB.getById('plots', request.plot_id) : null;
        return `
                                        <tr>
                                            <td>${plot?.title || 'Unknown'}</td>
                                            <td>${request?.project_type || 'N/A'}</td>
                                            <td>${formatCurrency(quote.amount)}</td>
                                            <td>${quote.estimated_days} days</td>
                                            <td>${getStatusBadge(quote.status)}</td>
                                            <td>${timeAgo(quote.created_at)}</td>
                                        </tr>
                                    `;
    }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

// Builder Profile Page
function renderBuilderProfile() {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'builder') { navigateTo('login'); return; }

    const profile = Auth.getCurrentProfile();

    const specializationOptions = [
        'Residential', 'Commercial', 'Industrial', 'Renovation',
        'Interior Design', 'Landscaping', 'Green Building', 'Custom Homes'
    ];

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('profile')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Company Profile</h1>
                        <p class="dashboard-subtitle">Manage your company information</p>
                    </div>
                </div>
                <div class="card" style="max-width: 800px;">
                    <div class="card-body">
                        <form id="builder-profile-form" onsubmit="handleBuilderProfileUpdate(event)">
                            <div class="form-group">
                                <label class="form-label">Company Name *</label>
                                <input type="text" name="company_name" class="form-input" value="${profile?.company_name || ''}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Phone Number *</label>
                                    <input type="tel" name="phone" class="form-input" value="${profile?.phone || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">License Number *</label>
                                    <input type="text" name="license_number" class="form-input" value="${profile?.license_number || ''}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Business Address</label>
                                <input type="text" name="address" class="form-input" value="${profile?.address || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Company Description *</label>
                                <textarea name="description" class="form-textarea" required>${profile?.description || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Specializations</label>
                                <div class="specializations-grid">
                                    ${specializationOptions.map(spec => `
                                        <label class="form-check">
                                            <input type="checkbox" name="specializations" value="${spec}" 
                                                ${profile?.specializations?.includes(spec) ? 'checked' : ''}>
                                            <span class="form-check-label">${spec}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="form-actions" style="display: flex; gap: var(--space-4); margin-top: var(--space-6);">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    addDashboardStyles();
    addBuilderSignupStyles();
}

function handleBuilderProfileUpdate(event) {
    event.preventDefault();
    const form = event.target;

    const specializations = Array.from(form.querySelectorAll('input[name="specializations"]:checked'))
        .map(input => input.value);

    const data = {
        company_name: form.company_name.value,
        phone: form.phone.value,
        license_number: form.license_number.value,
        address: form.address.value,
        description: form.description.value,
        specializations: specializations
    };

    Auth.updateProfile(data);
    showToast('Profile updated successfully!', 'success');
}
