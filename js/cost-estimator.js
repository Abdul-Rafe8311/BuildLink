/**
 * Interactive Cost Estimator Widget
 * Quick project cost calculator for home page
 */

const CostEstimator = {
    // Base prices in USD per square foot
    basePrices: {
        residential: { economy: 80, standard: 120, premium: 180, luxury: 280 },
        commercial: { economy: 100, standard: 150, premium: 220, luxury: 350 },
        renovation: { economy: 50, standard: 85, premium: 140, luxury: 220 },
        addition: { economy: 90, standard: 130, premium: 190, luxury: 300 }
    },

    currentValues: {
        sqft: 1500,
        projectType: 'residential',
        quality: 'standard'
    },

    // Get currency from ChatBot if available
    getCurrency() {
        if (typeof ChatBot !== 'undefined' && ChatBot.currencies) {
            return ChatBot.currencies[ChatBot.currentCurrency] || { symbol: '$', rate: 1 };
        }
        return { symbol: '$', rate: 1, name: 'US Dollar' };
    },

    formatPrice(usdAmount) {
        const currency = this.getCurrency();
        const converted = Math.round(usdAmount * currency.rate);
        return currency.symbol + converted.toLocaleString();
    },

    calculateEstimate() {
        const { sqft, projectType, quality } = this.currentValues;
        const pricePerSqFt = this.basePrices[projectType][quality];
        const basePrice = sqft * pricePerSqFt;

        // Add variance for more realistic estimate
        const lowEstimate = basePrice * 0.9;
        const highEstimate = basePrice * 1.15;

        return {
            low: Math.round(lowEstimate),
            mid: Math.round(basePrice),
            high: Math.round(highEstimate)
        };
    },

    render() {
        const currency = this.getCurrency();
        const currencyName = currency.name || 'US Dollar';

        return `
            <section class="estimator-section" id="cost-estimator-section">
                <div class="container">
                    <div class="section-header text-center">
                        <span class="section-badge">Quick Estimate</span>
                        <h2>Project <span class="text-gradient">Cost Calculator</span></h2>
                        <p>Get an instant estimate for your construction project</p>
                    </div>
                    <div class="cost-estimator" id="cost-estimator">
                        <div class="estimator-grid">
                            <div class="estimator-field">
                                <label>Project Size (sq ft)</label>
                                <div class="slider-container">
                                    <input type="range" id="sqft-slider" min="500" max="10000" step="100" value="${this.currentValues.sqft}" 
                                           oninput="CostEstimator.updateSqFt(this.value)">
                                </div>
                                <div class="value-display" id="sqft-display">${this.currentValues.sqft.toLocaleString()} sq ft</div>
                            </div>
                            <div class="estimator-field">
                                <label>Project Type</label>
                                <select id="project-type" onchange="CostEstimator.updateProjectType(this.value)">
                                    <option value="residential" ${this.currentValues.projectType === 'residential' ? 'selected' : ''}>🏠 New Residential Home</option>
                                    <option value="commercial" ${this.currentValues.projectType === 'commercial' ? 'selected' : ''}>🏢 Commercial Building</option>
                                    <option value="renovation" ${this.currentValues.projectType === 'renovation' ? 'selected' : ''}>🔨 Renovation/Remodel</option>
                                    <option value="addition" ${this.currentValues.projectType === 'addition' ? 'selected' : ''}>🏗️ Room Addition</option>
                                </select>
                            </div>
                            <div class="estimator-field">
                                <label>Quality Level</label>
                                <select id="quality-level" onchange="CostEstimator.updateQuality(this.value)">
                                    <option value="economy" ${this.currentValues.quality === 'economy' ? 'selected' : ''}>💵 Economy</option>
                                    <option value="standard" ${this.currentValues.quality === 'standard' ? 'selected' : ''}>⭐ Standard</option>
                                    <option value="premium" ${this.currentValues.quality === 'premium' ? 'selected' : ''}>✨ Premium</option>
                                    <option value="luxury" ${this.currentValues.quality === 'luxury' ? 'selected' : ''}>👑 Luxury</option>
                                </select>
                            </div>
                            <div class="estimator-field">
                                <label>Currency</label>
                                <select id="estimator-currency" onchange="CostEstimator.updateCurrency(this.value)">
                                    ${this.renderCurrencyOptions()}
                                </select>
                            </div>
                        </div>
                        <div class="estimator-result" id="estimator-result">
                            ${this.renderResult()}
                        </div>
                        <div class="estimator-actions">
                            <button class="btn btn-outline btn-lg" onclick="CostEstimator.reset()">
                                🔄 Reset
                            </button>
                            <button class="btn btn-primary btn-lg btn-glow" onclick="navigateTo('customer-signup')">
                                Get Accurate Quotes →
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    renderCurrencyOptions() {
        if (typeof ChatBot !== 'undefined' && ChatBot.currencies) {
            return Object.entries(ChatBot.currencies).map(([code, data]) =>
                `<option value="${code}" ${ChatBot.currentCurrency === code ? 'selected' : ''}>${data.flag} ${code} - ${data.name}</option>`
            ).join('');
        }
        return '<option value="USD">🇺🇸 USD - US Dollar</option>';
    },

    renderResult() {
        const estimate = this.calculateEstimate();
        return `
            <div class="result-label">Estimated Project Cost</div>
            <div class="result-value" id="estimate-value">${this.formatPrice(estimate.mid)}</div>
            <div class="result-note">Range: ${this.formatPrice(estimate.low)} - ${this.formatPrice(estimate.high)}</div>
        `;
    },

    updateSqFt(value) {
        this.currentValues.sqft = parseInt(value);
        document.getElementById('sqft-display').textContent = parseInt(value).toLocaleString() + ' sq ft';
        this.updateEstimateDisplay();
    },

    updateProjectType(value) {
        this.currentValues.projectType = value;
        this.updateEstimateDisplay();
    },

    updateQuality(value) {
        this.currentValues.quality = value;
        this.updateEstimateDisplay();
    },

    updateCurrency(code) {
        if (typeof ChatBot !== 'undefined') {
            ChatBot.setCurrency(code);
        }
        this.updateEstimateDisplay();
        // Update currency selector to match
        const currencySelect = document.getElementById('estimator-currency');
        if (currencySelect) {
            currencySelect.value = code;
        }
    },

    updateEstimateDisplay() {
        const resultDiv = document.getElementById('estimator-result');
        if (resultDiv) {
            resultDiv.innerHTML = this.renderResult();
        }
    },

    reset() {
        this.currentValues = {
            sqft: 1500,
            projectType: 'residential',
            quality: 'standard'
        };

        document.getElementById('sqft-slider').value = 1500;
        document.getElementById('sqft-display').textContent = '1,500 sq ft';
        document.getElementById('project-type').value = 'residential';
        document.getElementById('quality-level').value = 'standard';

        this.updateEstimateDisplay();
    }
};

// Export for use in home.js
window.CostEstimator = CostEstimator;
