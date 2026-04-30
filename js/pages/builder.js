/**
 * Builder Portal Pages
 */

// Builder Dashboard
async function renderBuilderDashboard() {
    const user = await Auth.getCurrentUser();

    if (!user || user.role !== 'builder' && user.role !== 'constructor') {
        navigateTo('login');
        return;
    }

    const myQuotes = await DB.getByField('quotes', 'builder_id', user.id);
    const pendingQuotes = myQuotes.filter(q => q.status === 'pending');
    const acceptedQuotes = myQuotes.filter(q => q.status === 'accepted');
    const rejectedQuotes = myQuotes.filter(q => q.status === 'rejected');

    // Pre-build table rows (async lookups can't run inside template literals)
    let tableRowsHtml = '';
    for (const quote of myQuotes.slice(0, 5)) {
        const request = await DB.getById('quote_requests', quote.quote_request_id);
        const plot = request ? await DB.getById('plots', request.plot_id) : null;
        tableRowsHtml += `
            <tr>
                <td>${plot?.title || 'Unknown'}</td>
                <td>${formatCurrency(quote.amount)}</td>
                <td>${getStatusBadge(quote.status)}</td>
                <td>${timeAgo(quote.created_at)}</td>
            </tr>
        `;
    }

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('dashboard')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Welcome, ${user.firstName || 'Builder'}!</h1>
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
                                    ${tableRowsHtml}
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
async function renderOpenRequests() {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'builder' && user.role !== 'constructor') { navigateTo('login'); return; }

    // Backend filters out requests this constructor has already quoted on.
    // Falls back to localStorage filtering if running in offline mode.
    let availableRequests = [];
    try {
        if (typeof APIService !== 'undefined' && Config.shouldUseBackend()) {
            availableRequests = await APIService.getOpenQuoteRequests();
        } else {
            const allRequests = await DB.getByField('quote_requests', 'status', 'pending');
            const myQuotes = await DB.getByField('quotes', 'constructor', user.id);
            const quotedIds = myQuotes.map(q => q.request);
            availableRequests = allRequests.filter(r => !quotedIds.includes(r.id));
        }
    } catch (err) {
        console.error('Failed to load open requests:', err);
        showToast(err.message || 'Failed to load open requests.', 'error');
    }

    // Pre-build request cards (async)
    const requestCardsHtml = [];
    for (const req of availableRequests) {
        requestCardsHtml.push(await renderOpenRequestCard(req));
    }

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
                        ${requestCardsHtml.join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

async function renderOpenRequestCard(request) {
    const requestId = request._id || request.id;
    const plot = (request.plot && typeof request.plot === 'object')
        ? request.plot
        : await DB.getById('plots', request.plot || request.plot_id);
    const plotLabel = plot?.streetAddress || plot?.title || 'Plot';
    const projectType = request.projectType || request.project_type || '';
    const region = plot?.province || plot?.state || '';
    const area = (plot?.length && plot?.width) ? plot.length * plot.width : null;
    const budgetText = (request.budgetMin || request.budgetMax)
        ? `$${(request.budgetMin || 0).toLocaleString()} - $${(request.budgetMax || 0).toLocaleString()}`
        : (request.budget_range || 'Not specified');
    const description = request.description || request.requirements || '';
    const createdAt = request.createdAt || request.created_at;

    return `
        <div class="card request-card">
            <div class="request-card-header">
                <h4>${plotLabel}</h4>
                ${getStatusBadge(request.status)}
            </div>
            <div class="request-card-body">
                <div class="request-info">
                    <div class="request-info-row">
                        <span class="label">Project Type</span>
                        <span>${projectType}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Location</span>
                        <span>${plot?.city || ''}${region ? ', ' + region : ''}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Plot Size</span>
                        <span>${area ? area.toLocaleString() + ' sq ft' : 'N/A'}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Budget</span>
                        <span>${budgetText}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Posted</span>
                        <span>${createdAt ? timeAgo(createdAt) : '—'}</span>
                    </div>
                </div>
                <p style="margin-top: var(--space-4); font-size: var(--font-size-sm); color: var(--gray-300);">
                    ${description.slice(0, 120)}${description.length > 120 ? '...' : ''}
                </p>
            </div>
            <div class="request-card-footer">
                <button class="btn btn-outline btn-sm" onclick="viewRequestDetails('${requestId}')">View Details</button>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('submit-quote', '${requestId}')">Submit Quote</button>
            </div>
        </div>
    `;
}

async function viewRequestDetails(requestId) {
    const request = await DB.getById('quote_requests', requestId);
    if (!request) { showToast('Could not load request.', 'error'); return; }

    const plot = (request.plot && typeof request.plot === 'object')
        ? request.plot
        : await DB.getById('plots', request.plot || request.plot_id);

    const owner = request.owner && typeof request.owner === 'object' ? request.owner : null;
    const ownerName = owner
        ? [owner.firstName, owner.lastName].filter(Boolean).join(' ') || owner.email
        : 'N/A';

    const plotLabel  = plot?.streetAddress || plot?.title || 'Unknown plot';
    const projectType = request.projectType || request.project_type || '';
    const region      = plot?.province || plot?.state || '';
    const area        = (plot?.length && plot?.width) ? plot.length * plot.width : null;
    const budgetText  = (request.budgetMin || request.budgetMax)
        ? `$${(request.budgetMin || 0).toLocaleString()} - $${(request.budgetMax || 0).toLocaleString()}`
        : (request.budget_range || 'Not specified');
    const startDate   = request.timelineStartDate || request.expected_start;
    const description = request.description || request.requirements || '';

    showModal('Project Details', `
        <div class="request-details">
            <h4 style="margin-bottom: var(--space-4);">${plotLabel}</h4>
            <div class="request-info" style="margin-bottom: var(--space-6);">
                <div class="request-info-row">
                    <span class="label">Owner</span>
                    <span>${ownerName}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Project Type</span>
                    <span>${projectType}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Location</span>
                    <span>${[plot?.streetAddress, plot?.city, region, plot?.country].filter(Boolean).join(', ') || '—'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Plot Size</span>
                    <span>${area ? area.toLocaleString() + ' sq ft' : 'N/A'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Floors</span>
                    <span>${request.numberOfFloors || 1}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Total Built Area</span>
                    <span>${request.totalArea ? request.totalArea.toLocaleString() + ' sq ft' : 'N/A'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Budget Range</span>
                    <span>${budgetText}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Expected Start</span>
                    <span>${startDate ? formatDate(startDate) : 'Flexible'}</span>
                </div>
                <div class="request-info-row">
                    <span class="label">Expected Duration</span>
                    <span>${request.expectedDurationMonths ? request.expectedDurationMonths + ' months' : 'Flexible'}</span>
                </div>
            </div>
            <h5 style="margin-bottom: var(--space-2);">Description</h5>
            <p style="color: var(--gray-300); font-size: var(--font-size-sm);">${description}</p>
        </div>
    `, [
        { text: 'Close', class: 'btn-outline', onclick: 'closeModal()' },
        { text: 'Submit Quote', class: 'btn-primary', onclick: `closeModal(); navigateTo('submit-quote', '${requestId}')` }
    ]);
}

// Submit Quote Page
async function renderSubmitQuote(requestId) {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'builder' && user.role !== 'constructor') { navigateTo('login'); return; }

    const request = await DB.getById('quote_requests', requestId);
    if (!request) {
        showToast('Could not load that request.', 'error');
        navigateTo('open-requests');
        return;
    }

    // Backend populates `plot`; fall back to a separate lookup if not.
    const plot = (request.plot && typeof request.plot === 'object')
        ? request.plot
        : await DB.getById('plots', request.plot || request.plot_id);

    const plotLabel  = plot?.streetAddress || plot?.title || 'Project';
    const projectType = request.projectType || request.project_type || '';
    const region      = plot?.province || plot?.state || '';
    const area        = (plot?.length && plot?.width) ? plot.length * plot.width : null;
    const budgetText  = (request.budgetMin || request.budgetMax)
        ? `$${(request.budgetMin || 0).toLocaleString()} - $${(request.budgetMax || 0).toLocaleString()}`
        : (request.budget_range || 'Not specified');
    const description = request.description || request.requirements || '';

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderBuilderSidebar('requests')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Submit Quote</h1>
                        <p class="dashboard-subtitle">for ${plotLabel}${projectType ? ' - ' + projectType : ''}</p>
                    </div>
                </div>
                <div class="card" style="max-width: 800px;">
                    <div class="card-body">
                        <div class="project-summary" style="background: rgba(0,0,0,0.2); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
                            <h5 style="margin-bottom: var(--space-2);">Project Summary</h5>
                            <p style="font-size: var(--font-size-sm); color: var(--gray-400); margin-bottom: var(--space-2);">
                                <strong>Location:</strong> ${plot?.city || '—'}${region ? ', ' + region : ''} |
                                <strong>Size:</strong> ${area ? area.toLocaleString() + ' sq ft' : 'N/A'} |
                                <strong>Budget:</strong> ${budgetText}
                            </p>
                            <p style="font-size: var(--font-size-sm); color: var(--gray-300);">${description}</p>
                        </div>
                        <form id="submit-quote-form" onsubmit="handleSubmitQuote(event, '${requestId}')">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Materials Cost ($) *</label>
                                    <input type="number" step="100" min="0" name="materialsCost" class="form-input" placeholder="e.g., 25000" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Labor Cost ($) *</label>
                                    <input type="number" step="100" min="0" name="laborCost" class="form-input" placeholder="e.g., 15000" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Permits Cost ($)</label>
                                    <input type="number" step="50" min="0" name="permitsCost" class="form-input" placeholder="e.g., 1500" value="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Other Cost ($)</label>
                                    <input type="number" step="50" min="0" name="otherCost" class="form-input" placeholder="e.g., 2000" value="0">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Start Date</label>
                                    <input type="date" name="startDate" class="form-input">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">End Date</label>
                                    <input type="date" name="endDate" class="form-input">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duration (months)</label>
                                <input type="number" min="1" name="durationMonths" class="form-input" placeholder="e.g., 6">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Scope of Work / Notes *</label>
                                <textarea name="description" class="form-textarea" placeholder="What's included, materials grade, payment terms, warranty..." required></textarea>
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

async function handleSubmitQuote(event, requestId) {
    event.preventDefault();
    const form = event.target;

    const data = {
        requestId:      requestId,
        materialsCost:  parseFloat(form.materialsCost.value),
        laborCost:      parseFloat(form.laborCost.value),
        permitsCost:    form.permitsCost.value ? parseFloat(form.permitsCost.value) : 0,
        otherCost:      form.otherCost.value   ? parseFloat(form.otherCost.value)   : 0,
        startDate:      form.startDate.value || null,
        endDate:        form.endDate.value   || null,
        durationMonths: form.durationMonths.value ? parseInt(form.durationMonths.value, 10) : null,
        description:    form.description.value
    };

    try {
        await DB.insert('quotes', data);
        showToast('Quote submitted successfully!', 'success');
        navigateTo('builder-quotes');
    } catch (err) {
        console.error('Submit quote failed:', err);
        showToast(err.message || 'Failed to submit quote.', 'error');
    }
}

// Builder's Quotes Page
async function renderBuilderQuotes() {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'builder' && user.role !== 'constructor') { navigateTo('login'); return; }

    // Backend filters by JWT, so the field name in the filter doesn't matter.
    const myQuotes = await DB.getByField('quotes', 'constructor', user.id);

    // Pre-build table rows (async)
    let tableRowsHtml = '';
    for (const quote of myQuotes) {
        // Backend populates `request`; localStorage path used `quote_request_id`.
        const request = (quote.request && typeof quote.request === 'object')
            ? quote.request
            : await DB.getById('quote_requests', quote.request || quote.quote_request_id);
        const plot = request && request.plot && typeof request.plot === 'object'
            ? request.plot
            : (request ? await DB.getById('plots', request.plot || request.plot_id) : null);

        const projectType = request?.projectType || request?.project_type || 'N/A';
        const total = (quote.materialsCost || 0) + (quote.laborCost || 0)
                    + (quote.permitsCost   || 0) + (quote.otherCost  || 0);
        const amount = total || quote.amount || 0;
        const duration = quote.durationMonths
            ? quote.durationMonths + ' months'
            : (quote.estimated_days ? quote.estimated_days + ' days' : '—');
        const created = quote.createdAt || quote.created_at;

        tableRowsHtml += `
            <tr>
                <td>${plot?.streetAddress || plot?.title || 'Unknown'}</td>
                <td>${projectType}</td>
                <td>${formatCurrency(amount)}</td>
                <td>${duration}</td>
                <td>${getStatusBadge(quote.status)}</td>
                <td>${created ? timeAgo(created) : '—'}</td>
            </tr>
        `;
    }

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
                                ${tableRowsHtml}
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
async function renderBuilderProfile() {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'builder' && user.role !== 'constructor') { navigateTo('login'); return; }

    // Get builder profile from database
    const profile = await DB.getOneByField('builder_profiles', 'user_id', user.id);

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
