/**
 * Customer Portal Pages
 */

// Customer Dashboard
async function renderCustomerDashboard() {
    const user = await Auth.getCurrentUser();

    if (!user || user.role !== 'customer' && user.role !== 'owner') {
        navigateTo('login');
        return;
    }

    const plots = await DB.getByField('plots', 'customer_id', user.id);
    const quoteRequests = await DB.getByField('quote_requests', 'customer_id', user.id);

    // Gather all quotes across all requests (async)
    const allQuotes = [];
    for (const req of quoteRequests) {
        const quotes = await DB.getByField('quotes', 'quote_request_id', req.id);
        allQuotes.push(...quotes);
    }

    const pendingQuotes = allQuotes.filter(q => q.status === 'pending').length;
    const acceptedQuotes = allQuotes.filter(q => q.status === 'accepted').length;

    // Pre-build plot cards (async - can't use .map().join() with async functions)
    const plotCardsHtml = [];
    for (const plot of plots.slice(0, 3)) {
        plotCardsHtml.push(await renderPlotCard(plot));
    }

    // Pre-build table rows (async lookups can't run inside template literals)
    let tableRowsHtml = '';
    for (const req of quoteRequests.slice(0, 5)) {
        const plot = await DB.getById('plots', req.plot_id);
        const quotes = await DB.getByField('quotes', 'quote_request_id', req.id);
        tableRowsHtml += `
            <tr onclick="navigateTo('view-quotes', '${req.id}')" style="cursor:pointer">
                <td>${plot?.title || 'Unknown'}</td>
                <td>${req.project_type}</td>
                <td>${getStatusBadge(req.status)}</td>
                <td>${quotes.length}</td>
                <td>${formatDate(req.created_at)}</td>
            </tr>
        `;
    }

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('dashboard')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Welcome, ${user.firstName || 'User'}!</h1>
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
                            ${plotCardsHtml.join('')}
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
                                    ${tableRowsHtml}
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

async function renderPlotCard(plot) {
    const plotId = plot._id || plot.id;
    const area = (plot.length && plot.width) ? (plot.length * plot.width) : null;
    const title = plot.streetAddress || plot.title || 'Untitled plot';
    const region = plot.province || plot.state || '';
    const status = plot.status || 'active';

    return `
        <div class="card plot-card">
            <div class="plot-card-header">
                <h4>${title}</h4>
                ${getStatusBadge(status)}
            </div>
            <div class="plot-card-body">
                <div class="plot-info">
                    <div class="plot-info-row">
                        <span class="label">Location</span>
                        <span>${plot.city || ''}${region ? ', ' + region : ''}</span>
                    </div>
                    <div class="plot-info-row">
                        <span class="label">Dimensions</span>
                        <span>${plot.length || '?'} × ${plot.width || '?'} ft</span>
                    </div>
                    <div class="plot-info-row">
                        <span class="label">Area</span>
                        <span>${area ? area.toLocaleString() + ' sq ft' : 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="plot-card-footer">
                <button class="btn btn-outline btn-sm" onclick="navigateTo('edit-plot', '${plotId}')">Edit</button>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('request-quote', '${plotId}')">Request Quote</button>
            </div>
        </div>
    `;
}

// My Plots Page
async function renderMyPlots() {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'customer' && user.role !== 'owner') { navigateTo('login'); return; }

    const plots = await DB.getByField('plots', 'customer_id', user.id);

    // Pre-build plot cards (async)
    const plotCardsHtml = [];
    for (const plot of plots) {
        plotCardsHtml.push(await renderPlotCard(plot));
    }

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
                    <div class="grid-3">${plotCardsHtml.join('')}</div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

// Add/Edit Plot Page
async function renderPlotForm(plotId = null) {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'customer' && user.role !== 'owner') { navigateTo('login'); return; }

    const plot = plotId ? await DB.getById('plots', plotId) : null;
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
                                <label class="form-label">Street Address *</label>
                                <input type="text" name="streetAddress" class="form-input" placeholder="123 Main Street" value="${plot?.streetAddress || ''}" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">City *</label>
                                    <input type="text" name="city" class="form-input" placeholder="City" value="${plot?.city || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Province / State *</label>
                                    <input type="text" name="province" class="form-input" placeholder="Province or State" value="${plot?.province || ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Postal / Zip Code</label>
                                    <input type="text" name="postalCode" class="form-input" placeholder="e.g., 12345" value="${plot?.postalCode || ''}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Country</label>
                                    <input type="text" name="country" class="form-input" placeholder="Country" value="${plot?.country || ''}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Length (ft) *</label>
                                    <input type="number" step="0.01" name="length" class="form-input" placeholder="e.g., 80" value="${plot?.length ?? ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Width (ft) *</label>
                                    <input type="number" step="0.01" name="width" class="form-input" placeholder="e.g., 60" value="${plot?.width ?? ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Soil Type</label>
                                    <select name="soilType" class="form-select">
                                        <option value="unknown" ${(plot?.soilType || 'unknown') === 'unknown' ? 'selected' : ''}>Unknown</option>
                                        <option value="clay"  ${plot?.soilType === 'clay'  ? 'selected' : ''}>Clay</option>
                                        <option value="sand"  ${plot?.soilType === 'sand'  ? 'selected' : ''}>Sand</option>
                                        <option value="loam"  ${plot?.soilType === 'loam'  ? 'selected' : ''}>Loam</option>
                                        <option value="rock"  ${plot?.soilType === 'rock'  ? 'selected' : ''}>Rock</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Topography</label>
                                    <select name="topography" class="form-select">
                                        <option value="flat"   ${(plot?.topography || 'flat') === 'flat' ? 'selected' : ''}>Flat</option>
                                        <option value="sloped" ${plot?.topography === 'sloped' ? 'selected' : ''}>Sloped</option>
                                        <option value="hilly"  ${plot?.topography === 'hilly'  ? 'selected' : ''}>Hilly</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Utilities Available</label>
                                <div style="display:flex; gap: var(--space-4); flex-wrap: wrap;">
                                    <label><input type="checkbox" name="hasWater"       ${plot?.hasWater       ? 'checked' : ''}> Water</label>
                                    <label><input type="checkbox" name="hasElectricity" ${plot?.hasElectricity ? 'checked' : ''}> Electricity</label>
                                    <label><input type="checkbox" name="hasGas"         ${plot?.hasGas         ? 'checked' : ''}> Gas</label>
                                    <label><input type="checkbox" name="hasSewer"       ${plot?.hasSewer       ? 'checked' : ''}> Sewer</label>
                                </div>
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

async function handlePlotSubmit(event, plotId) {
    event.preventDefault();
    const form = event.target;

    const data = {
        streetAddress:  form.streetAddress.value,
        city:           form.city.value,
        province:       form.province.value,
        postalCode:     form.postalCode.value || null,
        country:        form.country.value || null,
        length:         parseFloat(form.length.value),
        width:          parseFloat(form.width.value),
        soilType:       form.soilType.value,
        topography:     form.topography.value,
        hasWater:       form.hasWater.checked,
        hasElectricity: form.hasElectricity.checked,
        hasGas:         form.hasGas.checked,
        hasSewer:       form.hasSewer.checked,
        status:         'active'
    };

    try {
        if (plotId) {
            await DB.update('plots', plotId, data);
            showToast('Plot updated successfully!', 'success');
        } else {
            await DB.insert('plots', data);
            showToast('Plot added successfully!', 'success');
        }
        navigateTo('my-plots');
    } catch (err) {
        console.error('Plot save failed:', err);
        showToast(err.message || 'Failed to save plot. Please try again.', 'error');
    }
}

// Request Quote Page
async function renderRequestQuote(plotId) {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'customer' && user.role !== 'owner') { navigateTo('login'); return; }

    const plot = await DB.getById('plots', plotId);
    if (!plot) { navigateTo('my-plots'); return; }

    const plotLabel = plot.streetAddress || plot.title || 'this plot';
    const defaultArea = (plot.length && plot.width) ? (plot.length * plot.width) : '';

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('quotes')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">Request Quotes</h1>
                        <p class="dashboard-subtitle">for ${plotLabel}</p>
                    </div>
                </div>
                <div class="card" style="max-width: 800px;">
                    <div class="card-body">
                        <form id="quote-request-form" onsubmit="handleQuoteRequest(event, '${plotId}')">
                            <div class="form-group">
                                <label class="form-label">Project Type *</label>
                                <select name="projectType" class="form-select" required>
                                    <option value="">Select project type</option>
                                    <option value="New Construction">New Construction</option>
                                    <option value="Renovation">Renovation</option>
                                    <option value="Extension">Extension</option>
                                    <option value="Interior Work">Interior Work</option>
                                    <option value="Landscaping">Landscaping</option>
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Number of Floors</label>
                                    <input type="number" name="numberOfFloors" class="form-input" min="1" value="1">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Total Built Area (sq ft)</label>
                                    <input type="number" step="0.01" name="totalArea" class="form-input" placeholder="e.g., 2400" value="${defaultArea}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Budget Min (USD)</label>
                                    <input type="number" step="100" name="budgetMin" class="form-input" placeholder="e.g., 50000">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Budget Max (USD)</label>
                                    <input type="number" step="100" name="budgetMax" class="form-input" placeholder="e.g., 100000">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Expected Start Date</label>
                                    <input type="date" name="timelineStartDate" class="form-input">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Expected Duration (months)</label>
                                    <input type="number" name="expectedDurationMonths" class="form-input" placeholder="e.g., 6">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Project Description *</label>
                                <textarea name="description" class="form-textarea" placeholder="Describe your project, materials, finish quality, special requirements..." required></textarea>
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

async function handleQuoteRequest(event, plotId) {
    event.preventDefault();
    const form = event.target;

    const data = {
        plotId: plotId,
        projectType:            form.projectType.value,
        numberOfFloors:         parseInt(form.numberOfFloors.value, 10) || 1,
        totalArea:              form.totalArea.value ? parseFloat(form.totalArea.value) : null,
        budgetMin:              form.budgetMin.value ? parseFloat(form.budgetMin.value) : null,
        budgetMax:              form.budgetMax.value ? parseFloat(form.budgetMax.value) : null,
        timelineStartDate:      form.timelineStartDate.value || null,
        expectedDurationMonths: form.expectedDurationMonths.value ? parseInt(form.expectedDurationMonths.value, 10) : null,
        description:            form.description.value
    };

    try {
        await DB.insert('quote_requests', data);
        showToast('Quote request submitted! Builders will start sending quotes soon.', 'success');
        navigateTo('my-quotes');
    } catch (err) {
        console.error('Quote request failed:', err);
        showToast(err.message || 'Failed to submit quote request.', 'error');
    }
}

// My Quotes Page
async function renderMyQuotes() {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'customer' && user.role !== 'owner') { navigateTo('login'); return; }

    const quoteRequests = await DB.getByField('quote_requests', 'customer_id', user.id);

    // Pre-build quote request cards (async)
    const requestCardsHtml = [];
    for (const req of quoteRequests) {
        requestCardsHtml.push(await renderQuoteRequestCard(req));
    }

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
                        ${requestCardsHtml.join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

async function renderQuoteRequestCard(request) {
    const requestId = request._id || request.id;
    // Backend populates `plot`; localStorage path used `plot_id`.
    const plot = (request.plot && typeof request.plot === 'object')
        ? request.plot
        : await DB.getById('plots', request.plot || request.plot_id);
    const plotLabel = plot?.streetAddress || plot?.title || 'Unknown plot';
    const projectType = request.projectType || request.project_type || '';
    const budgetText = (request.budgetMin || request.budgetMax)
        ? `$${(request.budgetMin || 0).toLocaleString()} - $${(request.budgetMax || 0).toLocaleString()}`
        : (request.budget_range || 'Not specified');
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
                        <span class="label">Budget</span>
                        <span>${budgetText}</span>
                    </div>
                    <div class="request-info-row">
                        <span class="label">Created</span>
                        <span>${createdAt ? timeAgo(createdAt) : '—'}</span>
                    </div>
                </div>
            </div>
            <div class="request-card-footer">
                <button class="btn btn-primary btn-sm btn-full" onclick="navigateTo('view-quotes', '${requestId}')">
                    View Quotes
                </button>
            </div>
        </div>
    `;
}

// View Quotes for a Request
async function renderViewQuotes(requestId) {
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'customer' && user.role !== 'owner') { navigateTo('login'); return; }

    const request = await DB.getById('quote_requests', requestId);
    if (!request) { navigateTo('my-quotes'); return; }

    const plot = await DB.getById('plots', request.plot_id);
    const quotes = await DB.getByField('quotes', 'quote_request_id', requestId);

    // Pre-build quote cards (async)
    const quoteCardsHtml = [];
    for (const quote of quotes) {
        quoteCardsHtml.push(await renderQuoteCard(quote));
    }

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
                        ${quoteCardsHtml.join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    addDashboardStyles();
}

async function renderQuoteCard(quote) {
    const builder = await DB.getOneByField('builder_profiles', 'user_id', quote.builder_id);

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

async function handleQuoteAction(quoteId, action) {
    await DB.update('quotes', quoteId, { status: action });

    if (action === 'accepted') {
        const quote = await DB.getById('quotes', quoteId);
        await DB.update('quote_requests', quote.quote_request_id, { status: 'closed' });
        showToast('Quote accepted! The builder will contact you soon.', 'success');
    } else {
        showToast('Quote declined.', 'info');
    }

    // Re-render the page
    const quote = await DB.getById('quotes', quoteId);
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
