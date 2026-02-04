/**
 * Customer Portal Pages
 */

// Customer Dashboard
function renderCustomerDashboard() {
    const user = Auth.getCurrentUser();
    const profile = Auth.getCurrentProfile();

    if (!user || user.role !== 'customer') {
        navigateTo('login');
        return;
    }

    const plots = DB.getByField('plots', 'customer_id', user.id);
    const quoteRequests = DB.getByField('quote_requests', 'customer_id', user.id);
    const allQuotes = quoteRequests.flatMap(req =>
        DB.getByField('quotes', 'quote_request_id', req.id)
    );

    const pendingQuotes = allQuotes.filter(q => q.status === 'pending').length;
    const acceptedQuotes = allQuotes.filter(q => q.status === 'accepted').length;

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('dashboard')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Welcome, ${profile?.full_name || 'User'}!</h1>
                        <p class="dashboard-subtitle">Manage your plots and track your quote requests</p>
                    </div>
                    <button class="btn btn-primary" onclick="navigateTo('add-plot')">
                        + Add New Plot
                    </button>
                </div>

                <div class="stats-grid">
                    <div class="card stat-card">
                        <div class="value">${plots.length}</div>
                        <div class="label">Total Plots</div>
                    </div>
                    <div class="card stat-card">
                        <div class="value">${quoteRequests.length}</div>
                        <div class="label">Quote Requests</div>
                    </div>
                    <div class="card stat-card">
                        <div class="value">${pendingQuotes}</div>
                        <div class="label">Pending Quotes</div>
                    </div>
                    <div class="card stat-card">
                        <div class="value">${acceptedQuotes}</div>
                        <div class="label">Accepted</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header-row">
                        <h2>Your Plots</h2>
                        <a href="#" onclick="navigateTo('my-plots')" class="btn btn-outline btn-sm">View All</a>
                    </div>
                    ${plots.length === 0 ? `
                        <div class="empty-state">
                            <div class="icon">🏗️</div>
                            <h3>No plots yet</h3>
                            <p>Add your first plot to start receiving quotes from builders</p>
                            <button class="btn btn-primary" onclick="navigateTo('add-plot')">Add Your First Plot</button>
                        </div>
                    ` : `
                        <div class="grid-3">
                            ${plots.slice(0, 3).map(plot => renderPlotCard(plot)).join('')}
                        </div>
                    `}
                </div>

                ${quoteRequests.length > 0 ? `
                    <div class="section mt-8">
                        <div class="section-header-row">
                            <h2>Recent Quote Requests</h2>
                            <a href="#" onclick="navigateTo('my-quotes')" class="btn btn-outline btn-sm">View All</a>
                        </div>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Quotes</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${quoteRequests.slice(0, 5).map(req => {
        const plot = DB.getById('plots', req.plot_id);
        const quotes = DB.getByField('quotes', 'quote_request_id', req.id);
        return `
                                            <tr onclick="navigateTo('view-quotes', '${req.id}')" style="cursor:pointer">
                                                <td>${plot?.title || 'Unknown'}</td>
                                                <td>${req.project_type}</td>
                                                <td>${getStatusBadge(req.status)}</td>
                                                <td>${quotes.length}</td>
                                                <td>${formatDate(req.created_at)}</td>
                                            </tr>
                                        `;
    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    addDashboardStyles();
}

function renderCustomerSidebar(active) {
    const links = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard', page: 'customer-dashboard' },
        { id: 'plots', icon: '🏗️', label: 'My Plots', page: 'my-plots' },
        { id: 'quotes', icon: '📝', label: 'My Quotes', page: 'my-quotes' },
        { id: 'budget-advisor', icon: '🤖', label: 'Budget Advisor', page: 'budget-advisor' },
        { id: 'profile', icon: '👤', label: 'Profile', page: 'customer-profile' }
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

function renderPlotCard(plot) {
    const quoteRequests = DB.getByField('quote_requests', 'plot_id', plot.id);
    const hasOpenRequest = quoteRequests.some(r => r.status === 'open');

    return `
        <div class="card plot-card">
            <div class="plot-card-header">
                <h4>${plot.title}</h4>
                ${getStatusBadge(hasOpenRequest ? 'open' : 'closed')}
            </div>
            <div class="plot-card-body">
                <div class="plot-info">
                    <div class="plot-info-row">
                        <span class="label">Location</span>
                        <span>${plot.city}, ${plot.state}</span>
                    </div>
                    <div class="plot-info-row">
                        <span class="label">Area</span>
                        <span>${plot.area_sqft.toLocaleString()} sq ft</span>
                    </div>
                    <div class="plot-info-row">
                        <span class="label">Type</span>
                        <span>${plot.plot_type}</span>
                    </div>
                </div>
                <p style="font-size: var(--font-size-sm); color: var(--gray-400);">
                    ${plot.description?.slice(0, 80)}${plot.description?.length > 80 ? '...' : ''}
                </p>
            </div>
            <div class="plot-card-footer">
                <button class="btn btn-outline btn-sm" onclick="navigateTo('edit-plot', '${plot.id}')">Edit</button>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('request-quote', '${plot.id}')">Request Quote</button>
            </div>
        </div>
    `;
}

// My Plots Page
function renderMyPlots() {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'customer') { navigateTo('login'); return; }

    const plots = DB.getByField('plots', 'customer_id', user.id);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('plots')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">My Plots</h1>
                        <p class="dashboard-subtitle">Manage all your property plots</p>
                    </div>
                    <button class="btn btn-primary" onclick="navigateTo('add-plot')">+ Add New Plot</button>
                </div>
                ${plots.length === 0 ? `
                    <div class="empty-state">
                        <div class="icon">🏗️</div>
                        <h3>No plots yet</h3>
                        <p>Add your first plot to start receiving quotes</p>
                        <button class="btn btn-primary" onclick="navigateTo('add-plot')">Add Your First Plot</button>
                    </div>
                ` : `
                    <div class="grid-3">${plots.map(plot => renderPlotCard(plot)).join('')}</div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

// Add/Edit Plot Page
function renderPlotForm(plotId = null) {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'customer') { navigateTo('login'); return; }

    const plot = plotId ? DB.getById('plots', plotId) : null;
    const isEdit = !!plot;

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('plots')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">${isEdit ? 'Edit Plot' : 'Add New Plot'}</h1>
                        <p class="dashboard-subtitle">${isEdit ? 'Update your plot details' : 'Enter your plot details to start receiving quotes'}</p>
                    </div>
                </div>
                <div class="card" style="max-width: 800px;">
                    <div class="card-body">
                        <form id="plot-form" onsubmit="handlePlotSubmit(event, ${isEdit ? `'${plotId}'` : 'null'})">
                            <div class="form-group">
                                <label class="form-label">Plot Title *</label>
                                <input type="text" name="title" class="form-input" placeholder="e.g., Downtown Residential Plot" value="${plot?.title || ''}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Street Address *</label>
                                    <input type="text" name="address" class="form-input" placeholder="123 Main Street" value="${plot?.address || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">City *</label>
                                    <input type="text" name="city" class="form-input" placeholder="City" value="${plot?.city || ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">State *</label>
                                    <input type="text" name="state" class="form-input" placeholder="State" value="${plot?.state || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Plot Area (sq ft) *</label>
                                    <input type="number" name="area_sqft" class="form-input" placeholder="e.g., 5000" value="${plot?.area_sqft || ''}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Plot Type *</label>
                                <select name="plot_type" class="form-select" required>
                                    <option value="">Select plot type</option>
                                    <option value="residential" ${plot?.plot_type === 'residential' ? 'selected' : ''}>Residential</option>
                                    <option value="commercial" ${plot?.plot_type === 'commercial' ? 'selected' : ''}>Commercial</option>
                                    <option value="industrial" ${plot?.plot_type === 'industrial' ? 'selected' : ''}>Industrial</option>
                                    <option value="mixed" ${plot?.plot_type === 'mixed' ? 'selected' : ''}>Mixed Use</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <textarea name="description" class="form-textarea" placeholder="Describe your plot, any special features, existing structures, etc.">${plot?.description || ''}</textarea>
                            </div>
                            <div class="form-actions" style="display: flex; gap: var(--space-4); margin-top: var(--space-6);">
                                <button type="button" class="btn btn-outline" onclick="navigateTo('my-plots')">Cancel</button>
                                <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Add Plot'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    addDashboardStyles();
}

function handlePlotSubmit(event, plotId) {
    event.preventDefault();
    const form = event.target;
    const user = Auth.getCurrentUser();

    const data = {
        customer_id: user.id,
        title: form.title.value,
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        area_sqft: parseFloat(form.area_sqft.value),
        plot_type: form.plot_type.value,
        description: form.description.value,
        accepting_quotes: true
    };

    if (plotId) {
        DB.update('plots', plotId, data);
        showToast('Plot updated successfully!', 'success');
    } else {
        DB.insert('plots', data);
        showToast('Plot added successfully!', 'success');
    }

    navigateTo('my-plots');
}

// Request Quote Page
function renderRequestQuote(plotId) {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'customer') { navigateTo('login'); return; }

    const plot = DB.getById('plots', plotId);
    if (!plot) { navigateTo('my-plots'); return; }

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('quotes')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Request Quotes</h1>
                        <p class="dashboard-subtitle">for ${plot.title}</p>
                    </div>
                </div>
                <div class="card" style="max-width: 800px;">
                    <div class="card-body">
                        <form id="quote-request-form" onsubmit="handleQuoteRequest(event, '${plotId}')">
                            <div class="form-group">
                                <label class="form-label">Project Type *</label>
                                <select name="project_type" class="form-select" required>
                                    <option value="">Select project type</option>
                                    <option value="New Construction">New Construction</option>
                                    <option value="Renovation">Renovation</option>
                                    <option value="Extension">Extension</option>
                                    <option value="Interior Work">Interior Work</option>
                                    <option value="Landscaping">Landscaping</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Project Requirements *</label>
                                <textarea name="requirements" class="form-textarea" placeholder="Describe your project requirements in detail..." required></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Expected Start Date</label>
                                    <input type="date" name="expected_start" class="form-input">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Budget Range</label>
                                    <select name="budget_range" class="form-select">
                                        <option value="">Select budget range</option>
                                        <option value="Under $50,000">Under $50,000</option>
                                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                                        <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                                        <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                                        <option value="Over $500,000">Over $500,000</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-actions" style="display: flex; gap: var(--space-4); margin-top: var(--space-6);">
                                <button type="button" class="btn btn-outline" onclick="navigateTo('my-plots')">Cancel</button>
                                <button type="submit" class="btn btn-primary">Submit Quote Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    addDashboardStyles();
}

function handleQuoteRequest(event, plotId) {
    event.preventDefault();
    const form = event.target;
    const user = Auth.getCurrentUser();

    const data = {
        plot_id: plotId,
        customer_id: user.id,
        project_type: form.project_type.value,
        requirements: form.requirements.value,
        expected_start: form.expected_start.value,
        budget_range: form.budget_range.value,
        status: 'open'
    };

    DB.insert('quote_requests', data);
    showToast('Quote request submitted! Builders will start sending quotes soon.', 'success');
    navigateTo('my-quotes');
}

// My Quotes Page
function renderMyQuotes() {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'customer') { navigateTo('login'); return; }

    const quoteRequests = DB.getByField('quote_requests', 'customer_id', user.id);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('quotes')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">My Quote Requests</h1>
                        <p class="dashboard-subtitle">Track and manage your quote requests</p>
                    </div>
                </div>
                ${quoteRequests.length === 0 ? `
                    <div class="empty-state">
                        <div class="icon">📝</div>
                        <h3>No quote requests yet</h3>
                        <p>Create a quote request for one of your plots to get bids from builders</p>
                        <button class="btn btn-primary" onclick="navigateTo('my-plots')">View My Plots</button>
                    </div>
                ` : `
                    <div class="grid-3">
                        ${quoteRequests.map(req => renderQuoteRequestCard(req)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

function renderQuoteRequestCard(request) {
    const plot = DB.getById('plots', request.plot_id);
    const quotes = DB.getByField('quotes', 'quote_request_id', request.id);

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
                        <span class="label">Budget</span>
                        <span>${request.budget_range || 'Not specified'}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Quotes Received</span>
                        <span>${quotes.length}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Created</span>
                        <span>${timeAgo(request.created_at)}</span>
                    </div>
                </div>
            </div>
            <div class="request-card-footer">
                <button class="btn btn-primary btn-sm btn-full" onclick="navigateTo('view-quotes', '${request.id}')">
                    View Quotes (${quotes.length})
                </button>
            </div>
        </div>
    `;
}

// View Quotes for a Request
function renderViewQuotes(requestId) {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'customer') { navigateTo('login'); return; }

    const request = DB.getById('quote_requests', requestId);
    if (!request) { navigateTo('my-quotes'); return; }

    const plot = DB.getById('plots', request.plot_id);
    const quotes = DB.getByField('quotes', 'quote_request_id', requestId);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('quotes')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Quotes for ${plot?.title}</h1>
                        <p class="dashboard-subtitle">${request.project_type} - ${request.budget_range || 'Budget not specified'}</p>
                    </div>
                    <button class="btn btn-outline" onclick="navigateTo('my-quotes')">← Back to Requests</button>
                </div>
                ${quotes.length === 0 ? `
                    <div class="empty-state">
                        <div class="icon">⏳</div>
                        <h3>No quotes yet</h3>
                        <p>Builders are reviewing your request. Quotes will appear here.</p>
                    </div>
                ` : `
                    <div class="quotes-grid">
                        ${quotes.map(quote => renderQuoteCard(quote)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

function renderQuoteCard(quote) {
    const builder = DB.getOneByField('builder_profiles', 'user_id', quote.builder_id);

    return `
        <div class="card quote-card">
            <div class="quote-card-header">
                <div class="avatar">${getInitials(builder?.company_name || 'B')}</div>
                <div>
                    <h4>${builder?.company_name || 'Unknown Builder'}</h4>
                    <span style="color: var(--gray-400); font-size: var(--font-size-sm);">
                        ★ ${builder?.rating?.toFixed(1) || 'N/A'}
                    </span>
                </div>
            </div>
            <div class="quote-card-body">
                <div class="quote-amount">${formatCurrency(quote.amount)}</div>
                <div class="quote-details">
                    <div class="quote-detail">
                        <span style="color: var(--gray-400)">Timeline</span>
                        <span>${quote.estimated_days} days</span>
                    </div>
                    <div class="quote-detail">
                        <span style="color: var(--gray-400)">Status</span>
                        ${getStatusBadge(quote.status)}
                    </div>
                </div>
                <p style="margin-top: var(--space-4); font-size: var(--font-size-sm); color: var(--gray-300);">
                    ${quote.scope_of_work?.slice(0, 150)}${quote.scope_of_work?.length > 150 ? '...' : ''}
                </p>
            </div>
            ${quote.status === 'pending' ? `
                <div class="quote-card-footer">
                    <button class="btn btn-outline btn-sm" onclick="handleQuoteAction('${quote.id}', 'rejected')">Decline</button>
                    <button class="btn btn-success btn-sm" onclick="handleQuoteAction('${quote.id}', 'accepted')">Accept</button>
                </div>
            ` : ''}
        </div>
    `;
}

function handleQuoteAction(quoteId, action) {
    DB.update('quotes', quoteId, { status: action });

    if (action === 'accepted') {
        const quote = DB.getById('quotes', quoteId);
        DB.update('quote_requests', quote.quote_request_id, { status: 'closed' });
        showToast('Quote accepted! The builder will contact you soon.', 'success');
    } else {
        showToast('Quote declined.', 'info');
    }

    // Re-render the page
    const quote = DB.getById('quotes', quoteId);
    navigateTo('view-quotes', quote.quote_request_id);
}

function addDashboardStyles() {
    if (document.getElementById('dashboard-styles')) return;
    const styles = document.createElement('style');
    styles.id = 'dashboard-styles';
    styles.textContent = `
        .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
        .section-header-row h2 { margin: 0; }
    `;
    document.head.appendChild(styles);
}
