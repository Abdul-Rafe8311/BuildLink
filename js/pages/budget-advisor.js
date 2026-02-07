/**
 * Budget Advisor Page for Plot Owners
 * Provides AI-powered budget opinions and suggestions
 */

function renderBudgetAdvisor(plotId = null) {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'customer') { navigateTo('login'); return; }

    const plots = DB.getByField('plots', 'customer_id', user.id);
    const selectedPlot = plotId ? DB.getById('plots', plotId) : null;
    const apiConfigured = AIService.isConfigured();

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="dashboard">
            ${renderCustomerSidebar('budget-advisor')}
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div>
                        <h1 class="dashboard-title">🤖 AI Budget Advisor</h1>
                        <p class="dashboard-subtitle">Get intelligent budget opinions and suggestions for your construction projects</p>
                    </div>
                </div>

                ${!apiConfigured ? renderAPIKeySetup() : ''}

                <div class="budget-advisor-container ${!apiConfigured ? 'disabled-section' : ''}">
                    <!-- Plot Selection -->
                    <div class="card mb-6">
                        <div class="card-body">
                            <h3 class="card-title">📍 Select Your Plot</h3>
                            ${plots.length === 0 ? `
                                <div class="empty-state-mini">
                                    <p>You don't have any plots yet. Add a plot first to get budget advice.</p>
                                    <button class="btn btn-primary btn-sm" onclick="navigateTo('add-plot')">Add Plot</button>
                                </div>
                            ` : `
                                <div class="plot-selector">
                                    ${plots.map(plot => `
                                        <div class="plot-select-card ${selectedPlot?.id === plot.id ? 'selected' : ''}" onclick="navigateTo('budget-advisor', '${plot.id}')">
                                            <div class="plot-select-icon">🏗️</div>
                                            <div class="plot-select-info">
                                                <h4>${plot.title}</h4>
                                                <p>${plot.city}, ${plot.state} • ${plot.area_sqft?.toLocaleString()} sq ft</p>
                                            </div>
                                            ${selectedPlot?.id === plot.id ? '<span class="selected-badge">✓ Selected</span>' : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>
                    </div>

                    ${selectedPlot ? renderBudgetAnalysisForm(selectedPlot) : ''}
                    
                    <!-- AI Response Container -->
                    <div id="ai-response-container" style="display: none;"></div>

                    <!-- Chat with AI -->
                    ${selectedPlot ? renderBudgetChat(selectedPlot) : ''}
                </div>
            </div>
        </div>
    `;
    addBudgetAdvisorStyles();
    addDashboardStyles();
}

function renderAPIKeySetup() {
    const savedKey = AIService.getApiKey();
    return `
        <div class="card api-key-card mb-6">
            <div class="card-body">
                <div class="api-setup-header">
                    <div class="api-icon">🔑</div>
                    <div>
                        <h3>Configure API Key</h3>
                        <p>Enter your Gemini API key to enable AI-powered budget analysis</p>
                    </div>
                </div>
                <div class="api-key-form">
                    <input type="password" id="api-key-input" class="form-input" 
                           placeholder="Enter your Gemini API key" value="${savedKey}">
                    <button class="btn btn-primary" onclick="saveApiKey()">
                        ${savedKey ? 'Update Key' : 'Save Key'}
                    </button>
                </div>
                <p class="api-help-text">
                    Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>
                </p>
            </div>
        </div>
    `;
}

function saveApiKey() {
    const keyInput = document.getElementById('api-key-input');
    const key = keyInput.value.trim();

    if (!key) {
        showToast('Please enter an API key', 'error');
        return;
    }

    AIService.setApiKey(key);
    showToast('API key saved successfully!', 'success');

    // Refresh the page to update UI
    const currentPlotId = window.currentBudgetPlotId || null;
    renderBudgetAdvisor(currentPlotId);
}

function renderBudgetAnalysisForm(plot) {
    window.currentBudgetPlotId = plot.id;

    return `
        <div class="card analysis-form-card mb-6">
            <div class="card-body">
                <h3 class="card-title">📊 Get Budget Analysis</h3>
                <p class="card-subtitle">Tell us about your project to get personalized budget recommendations</p>
                
                <form id="budget-analysis-form" onsubmit="submitBudgetAnalysis(event, '${plot.id}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Project Type *</label>
                            <select name="projectType" class="form-select" required>
                                <option value="">Select project type</option>
                                <option value="New Construction - Residential">New Construction - Residential</option>
                                <option value="New Construction - Commercial">New Construction - Commercial</option>
                                <option value="Major Renovation">Major Renovation</option>
                                <option value="Extension/Addition">Extension/Addition</option>
                                <option value="Interior Remodeling">Interior Remodeling</option>
                                <option value="Landscaping Project">Landscaping Project</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Quality Level</label>
                            <select name="qualityLevel" class="form-select">
                                <option value="Economy">Economy (Budget-Friendly)</option>
                                <option value="Standard" selected>Standard</option>
                                <option value="Premium">Premium</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Expected Timeline</label>
                            <select name="timeline" class="form-select">
                                <option value="Flexible">Flexible</option>
                                <option value="3-6 months">3-6 months</option>
                                <option value="6-12 months">6-12 months</option>
                                <option value="1-2 years">1-2 years</option>
                                <option value="ASAP">ASAP - Rush Project</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Your Budget Estimate (Optional)</label>
                            <select name="budgetRange" class="form-select">
                                <option value="">Not sure yet</option>
                                <option value="Under $50,000">Under $50,000</option>
                                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                                <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                                <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                                <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                                <option value="Over $1,000,000">Over $1,000,000</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Specific Requirements or Features</label>
                        <textarea name="requirements" class="form-textarea" 
                                  placeholder="Describe any specific requirements, features you want, number of floors, special materials, sustainability goals, etc."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg" id="analyze-btn">
                        <span class="btn-icon">🤖</span>
                        Get AI Budget Opinion
                    </button>
                </form>
            </div>
        </div>
    `;
}

async function submitBudgetAnalysis(event, plotId) {
    event.preventDefault();

    if (!AIService.isConfigured()) {
        showToast('Please configure your API key first', 'error');
        return;
    }

    const form = event.target;
    const plot = DB.getById('plots', plotId);
    const analyzeBtn = document.getElementById('analyze-btn');
    const responseContainer = document.getElementById('ai-response-container');

    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="spinner"></span> Analyzing...';
    responseContainer.style.display = 'block';
    responseContainer.innerHTML = renderLoadingState();

    const projectDetails = {
        projectType: form.projectType.value,
        qualityLevel: form.qualityLevel.value,
        timeline: form.timeline.value,
        budgetRange: form.budgetRange.value,
        requirements: form.requirements.value
    };

    try {
        const analysis = await AIService.getBudgetOpinion(plot, projectDetails);
        responseContainer.innerHTML = renderAIAnalysisResult(analysis, plot);

        // Save analysis to database for future reference
        DB.insert('budget_analyses', {
            plot_id: plotId,
            customer_id: Auth.getCurrentUser().id,
            project_details: projectDetails,
            analysis_result: analysis
        });

        showToast('Budget analysis complete!', 'success');
    } catch (error) {
        responseContainer.innerHTML = renderErrorState(error.message);
        showToast('Analysis failed: ' + error.message, 'error');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="btn-icon">🤖</span> Get AI Budget Opinion';
    }
}

function renderLoadingState() {
    return `
        <div class="card loading-card">
            <div class="card-body">
                <div class="loading-animation">
                    <div class="ai-pulse"></div>
                    <h3>Analyzing Your Project...</h3>
                    <p>Our AI is evaluating market conditions, material costs, and project requirements</p>
                    <div class="loading-steps">
                        <div class="step active">📊 Analyzing plot data</div>
                        <div class="step">💰 Calculating estimates</div>
                        <div class="step">📝 Generating recommendations</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderErrorState(message) {
    return `
        <div class="card error-card">
            <div class="card-body">
                <div class="error-icon">❌</div>
                <h3>Analysis Failed</h3>
                <p>${message}</p>
                <button class="btn btn-outline" onclick="document.getElementById('ai-response-container').style.display='none'">
                    Dismiss
                </button>
            </div>
        </div>
    `;
}

function renderAIAnalysisResult(analysis, plot) {
    const budget = analysis.estimatedBudgetRange;

    return `
        <div class="analysis-result">
            <div class="card result-header-card mb-6">
                <div class="card-body">
                    <div class="result-header">
                        <div class="result-icon">🤖</div>
                        <div>
                            <h2>AI Budget Analysis Complete</h2>
                            <p>for ${plot.title}</p>
                        </div>
                    </div>
                    
                    ${budget ? `
                        <div class="budget-estimate-box">
                            <div class="estimate-label">Estimated Budget Range</div>
                            <div class="estimate-value">
                                ${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}
                            </div>
                            <div class="estimate-confidence">
                                Confidence: <span class="badge badge-${budget.confidence === 'high' ? 'success' : budget.confidence === 'medium' ? 'warning' : 'error'}">${budget.confidence}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${analysis.budgetBreakdown?.length > 0 ? `
                <div class="card mb-6">
                    <div class="card-body">
                        <h3 class="card-title">💰 Budget Breakdown</h3>
                        <div class="breakdown-grid">
                            ${analysis.budgetBreakdown.map(item => `
                                <div class="breakdown-item">
                                    <div class="breakdown-bar" style="--percentage: ${item.percentage}%"></div>
                                    <div class="breakdown-info">
                                        <span class="category">${item.category}</span>
                                        <span class="percentage">${item.percentage}%</span>
                                    </div>
                                    <div class="breakdown-amount">${item.estimatedAmount}</div>
                                    ${item.notes ? `<div class="breakdown-note">${item.notes}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}

            ${analysis.keyFactors?.length > 0 ? `
                <div class="card mb-6">
                    <div class="card-body">
                        <h3 class="card-title">🔑 Key Cost Factors</h3>
                        <ul class="factors-list">
                            ${analysis.keyFactors.map(factor => `<li>${factor}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            ` : ''}

            ${analysis.recommendations?.length > 0 ? `
                <div class="card mb-6">
                    <div class="card-body">
                        <h3 class="card-title">💡 Recommendations</h3>
                        <div class="recommendations-grid">
                            ${analysis.recommendations.map(rec => `
                                <div class="recommendation-card">
                                    <h4>${rec.title}</h4>
                                    <p>${rec.description}</p>
                                    ${rec.potentialSavings ? `<span class="savings-badge">💵 Potential Savings: ${rec.potentialSavings}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}

            ${analysis.riskFactors?.length > 0 ? `
                <div class="card mb-6">
                    <div class="card-body">
                        <h3 class="card-title">⚠️ Risk Factors</h3>
                        <div class="risks-list">
                            ${analysis.riskFactors.map(risk => `
                                <div class="risk-item risk-${risk.impact}">
                                    <div class="risk-header">
                                        <span class="risk-label">${risk.risk}</span>
                                        <span class="risk-badge">${risk.impact} impact</span>
                                    </div>
                                    <div class="risk-mitigation">💡 ${risk.mitigation}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}

            ${analysis.marketInsights ? `
                <div class="card mb-6">
                    <div class="card-body">
                        <h3 class="card-title">📈 Market Insights</h3>
                        <p class="market-insights">${analysis.marketInsights}</p>
                    </div>
                </div>
            ` : ''}

            ${analysis.overallAdvice ? `
                <div class="card advice-card">
                    <div class="card-body">
                        <h3 class="card-title">📋 Overall Advice</h3>
                        <p class="overall-advice">${analysis.overallAdvice}</p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderBudgetChat(plot) {
    return `
        <div class="card chat-card mt-6">
            <div class="card-body">
                <h3 class="card-title">💬 Ask Budget Questions</h3>
                <p class="card-subtitle">Have specific questions about your budget? Ask our AI advisor!</p>
                
                <div id="chat-messages" class="chat-messages"></div>
                
                <div class="chat-input-container">
                    <input type="text" id="chat-input" class="form-input" 
                           placeholder="Ask a question about your construction budget..."
                           onkeypress="if(event.key === 'Enter') askBudgetQuestion('${plot.id}')">
                    <button class="btn btn-primary" onclick="askBudgetQuestion('${plot.id}')">
                        Send
                    </button>
                </div>
                
                <div class="quick-questions">
                    <span class="quick-label">Quick questions:</span>
                    <button class="quick-btn" onclick="askQuickQuestion('${plot.id}', 'What are the main cost drivers for this project?')">Cost drivers</button>
                    <button class="quick-btn" onclick="askQuickQuestion('${plot.id}', 'How can I reduce my construction budget without compromising quality?')">Save money</button>
                    <button class="quick-btn" onclick="askQuickQuestion('${plot.id}', 'What permits and fees should I budget for?')">Permits & fees</button>
                </div>
            </div>
        </div>
    `;
}

async function askBudgetQuestion(plotId) {
    const input = document.getElementById('chat-input');
    const question = input.value.trim();

    if (!question) return;

    if (!AIService.isConfigured()) {
        showToast('Please configure your API key first', 'error');
        return;
    }

    await processQuestion(plotId, question);
    input.value = '';
}

function askQuickQuestion(plotId, question) {
    document.getElementById('chat-input').value = question;
    askBudgetQuestion(plotId);
}

async function processQuestion(plotId, question) {
    const plot = DB.getById('plots', plotId);
    const messagesContainer = document.getElementById('chat-messages');

    // Add user message
    messagesContainer.innerHTML += `
        <div class="chat-message user-message">
            <div class="message-content">${question}</div>
        </div>
    `;

    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    messagesContainer.innerHTML += `
        <div class="chat-message ai-message" id="${loadingId}">
            <div class="message-content">
                <span class="typing-indicator">●●●</span>
            </div>
        </div>
    `;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await AIService.askBudgetQuestion(plot, question);
        document.getElementById(loadingId).innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">${formatAIResponse(response)}</div>
        `;
    } catch (error) {
        document.getElementById(loadingId).innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content error">Sorry, I couldn't process your question. ${error.message}</div>
        `;
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatAIResponse(text) {
    // Convert markdown-like formatting to HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function addBudgetAdvisorStyles() {
    if (document.getElementById('budget-advisor-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'budget-advisor-styles';
    styles.textContent = `
        .budget-advisor-container.disabled-section {
            opacity: 0.5;
            pointer-events: none;
        }

        .api-key-card {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .api-setup-header {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            margin-bottom: var(--space-4);
        }

        .api-icon {
            font-size: 2.5rem;
        }

        .api-setup-header h3 {
            margin: 0;
            color: var(--white);
        }

        .api-setup-header p {
            margin: 0;
            color: var(--gray-400);
            font-size: var(--font-size-sm);
        }

        .api-key-form {
            display: flex;
            gap: var(--space-3);
            margin-bottom: var(--space-3);
        }

        .api-key-form .form-input {
            flex: 1;
        }

        .api-help-text {
            font-size: var(--font-size-sm);
            color: var(--gray-400);
        }

        .api-help-text a {
            color: var(--primary);
        }

        /* Plot Selector */
        .plot-selector {
            display: grid;
            gap: var(--space-3);
        }

        .plot-select-card {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            padding: var(--space-4);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .plot-select-card:hover {
            border-color: var(--primary);
            transform: translateX(4px);
        }

        .plot-select-card.selected {
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.1);
        }

        .plot-select-icon {
            font-size: 2rem;
        }

        .plot-select-info h4 {
            margin: 0;
            color: var(--white);
        }

        .plot-select-info p {
            margin: 0;
            color: var(--gray-400);
            font-size: var(--font-size-sm);
        }

        .selected-badge {
            margin-left: auto;
            color: var(--success);
            font-weight: 600;
        }

        /* Analysis Form */
        .analysis-form-card .card-subtitle {
            color: var(--gray-400);
            margin-bottom: var(--space-6);
        }

        .btn-lg {
            padding: var(--space-4) var(--space-6);
            font-size: var(--font-size-lg);
        }

        .btn-icon {
            margin-right: var(--space-2);
        }

        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Loading State */
        .loading-card {
            text-align: center;
            padding: var(--space-8);
        }

        .loading-animation h3 {
            margin: var(--space-4) 0;
            color: var(--white);
        }

        .ai-pulse {
            width: 80px;
            height: 80px;
            margin: 0 auto;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
        }

        .loading-steps {
            display: flex;
            justify-content: center;
            gap: var(--space-4);
            margin-top: var(--space-6);
        }

        .loading-steps .step {
            padding: var(--space-2) var(--space-4);
            background: var(--glass-bg);
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            opacity: 0.5;
        }

        .loading-steps .step.active {
            opacity: 1;
            background: rgba(99, 102, 241, 0.2);
        }

        /* Result Styles */
        .result-header {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            margin-bottom: var(--space-6);
        }

        .result-icon {
            font-size: 3rem;
        }

        .result-header h2 {
            margin: 0;
            color: var(--white);
        }

        .result-header p {
            margin: 0;
            color: var(--gray-400);
        }

        .budget-estimate-box {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            text-align: center;
        }

        .estimate-label {
            color: var(--gray-400);
            font-size: var(--font-size-sm);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .estimate-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--success);
            margin: var(--space-2) 0;
        }

        .estimate-confidence {
            color: var(--gray-300);
        }

        /* Breakdown */
        .breakdown-grid {
            display: grid;
            gap: var(--space-4);
        }

        .breakdown-item {
            position: relative;
            padding: var(--space-4);
            background: var(--glass-bg);
            border-radius: var(--radius-md);
            overflow: hidden;
        }

        .breakdown-bar {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: var(--percentage);
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05));
        }

        .breakdown-info {
            position: relative;
            display: flex;
            justify-content: space-between;
            margin-bottom: var(--space-1);
        }

        .breakdown-info .category {
            font-weight: 600;
            color: var(--white);
        }

        .breakdown-info .percentage {
            color: var(--primary);
            font-weight: 600;
        }

        .breakdown-amount {
            position: relative;
            color: var(--gray-300);
            font-size: var(--font-size-sm);
        }

        .breakdown-note {
            position: relative;
            color: var(--gray-400);
            font-size: var(--font-size-xs);
            margin-top: var(--space-2);
        }

        /* Factors */
        .factors-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .factors-list li {
            padding: var(--space-3);
            border-bottom: 1px solid var(--glass-border);
            color: var(--gray-200);
        }

        .factors-list li:last-child {
            border-bottom: none;
        }

        .factors-list li::before {
            content: "→";
            margin-right: var(--space-2);
            color: var(--primary);
        }

        /* Recommendations */
        .recommendations-grid {
            display: grid;
            gap: var(--space-4);
        }

        .recommendation-card {
            padding: var(--space-4);
            background: rgba(34, 197, 94, 0.05);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: var(--radius-md);
        }

        .recommendation-card h4 {
            margin: 0 0 var(--space-2);
            color: var(--success);
        }

        .recommendation-card p {
            margin: 0;
            color: var(--gray-300);
            font-size: var(--font-size-sm);
        }

        .savings-badge {
            display: inline-block;
            margin-top: var(--space-3);
            padding: var(--space-1) var(--space-3);
            background: rgba(34, 197, 94, 0.2);
            border-radius: var(--radius-full);
            font-size: var(--font-size-xs);
            color: var(--success);
        }

        /* Risks */
        .risks-list {
            display: grid;
            gap: var(--space-3);
        }

        .risk-item {
            padding: var(--space-4);
            border-radius: var(--radius-md);
        }

        .risk-item.risk-high {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .risk-item.risk-medium {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .risk-item.risk-low {
            background: rgba(156, 163, 175, 0.1);
            border: 1px solid rgba(156, 163, 175, 0.3);
        }

        .risk-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-2);
        }

        .risk-label {
            font-weight: 600;
            color: var(--white);
        }

        .risk-badge {
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: var(--font-size-xs);
            text-transform: uppercase;
        }

        .risk-mitigation {
            color: var(--gray-300);
            font-size: var(--font-size-sm);
        }

        /* Advice Card */
        .advice-card {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .overall-advice, .market-insights {
            color: var(--gray-200);
            line-height: 1.7;
        }

        /* Chat */
        .chat-messages {
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: var(--space-4);
            padding: var(--space-4);
            background: var(--glass-bg);
            border-radius: var(--radius-md);
            min-height: 100px;
        }

        .chat-message {
            display: flex;
            gap: var(--space-3);
            margin-bottom: var(--space-4);
        }

        .chat-message.user-message {
            justify-content: flex-end;
        }

        .chat-message.user-message .message-content {
            background: var(--primary);
            color: white;
        }

        .message-avatar {
            font-size: 1.5rem;
        }

        .message-content {
            max-width: 80%;
            padding: var(--space-3) var(--space-4);
            background: var(--gray-800);
            border-radius: var(--radius-lg);
            color: var(--gray-200);
            line-height: 1.6;
        }

        .message-content.error {
            background: rgba(239, 68, 68, 0.2);
            color: var(--error);
        }

        .typing-indicator {
            animation: blink 1.4s infinite both;
        }

        @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
        }

        .chat-input-container {
            display: flex;
            gap: var(--space-3);
        }

        .chat-input-container .form-input {
            flex: 1;
        }

        .quick-questions {
            margin-top: var(--space-4);
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
            align-items: center;
        }

        .quick-label {
            color: var(--gray-400);
            font-size: var(--font-size-sm);
        }

        .quick-btn {
            padding: var(--space-1) var(--space-3);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-full);
            color: var(--gray-300);
            font-size: var(--font-size-sm);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .quick-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        .empty-state-mini {
            text-align: center;
            padding: var(--space-4);
        }

        .empty-state-mini p {
            color: var(--gray-400);
            margin-bottom: var(--space-4);
        }

        .mb-6 {
            margin-bottom: var(--space-6);
        }

        .mt-6 {
            margin-top: var(--space-6);
        }
    `;
    document.head.appendChild(styles);
}
