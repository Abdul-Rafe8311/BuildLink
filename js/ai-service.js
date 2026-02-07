/**
 * AI Budget Advisor Service
 * Uses Gemini API to provide intelligent budget opinions and suggestions for plot owners
 */

const AIService = {
    // Gemini API Configuration
    API_KEY: '', // User will need to set their API key
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',

    // Set API Key
    setApiKey(key) {
        this.API_KEY = key;
        localStorage.setItem('gemini_api_key', key);
    },

    // Get stored API Key
    getApiKey() {
        if (!this.API_KEY) {
            this.API_KEY = localStorage.getItem('gemini_api_key') || '';
        }
        return this.API_KEY;
    },

    // Check if API key is configured
    isConfigured() {
        return this.getApiKey().length > 0;
    },

    // Generate budget opinion using Gemini API
    async getBudgetOpinion(plotData, projectDetails) {
        if (!this.isConfigured()) {
            throw new Error('API key not configured. Please set your Gemini API key in settings.');
        }

        const prompt = this.buildBudgetPrompt(plotData, projectDetails);

        try {
            const response = await fetch(`${this.API_URL}?key=${this.getApiKey()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('No response generated');
            }

            return this.parseAIResponse(text);
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    },

    // Build the prompt for budget analysis
    buildBudgetPrompt(plotData, projectDetails) {
        return `You are an expert construction budget advisor. Analyze the following property and project details to provide a comprehensive budget opinion and suggestions.

**PROPERTY DETAILS:**
- Title: ${plotData.title || 'Not specified'}
- Location: ${plotData.city || 'Unknown'}, ${plotData.state || 'Unknown'}
- Plot Area: ${plotData.area_sqft ? plotData.area_sqft.toLocaleString() + ' sq ft' : 'Not specified'}
- Plot Type: ${plotData.plot_type || 'Not specified'}
- Description: ${plotData.description || 'Not provided'}

**PROJECT REQUIREMENTS:**
- Project Type: ${projectDetails.projectType || 'New Construction'}
- Expected Timeline: ${projectDetails.timeline || 'Flexible'}
- Budget Range Mentioned: ${projectDetails.budgetRange || 'Not specified'}
- Specific Requirements: ${projectDetails.requirements || 'None specified'}
- Quality Level: ${projectDetails.qualityLevel || 'Standard'}

Please provide your analysis in the following JSON format:
{
    "estimatedBudgetRange": {
        "min": <number>,
        "max": <number>,
        "currency": "USD",
        "confidence": "<high/medium/low>"
    },
    "budgetBreakdown": [
        {"category": "<category name>", "percentage": <number>, "estimatedAmount": "<range>", "notes": "<brief note>"}
    ],
    "keyFactors": [
        "<factor affecting the budget>"
    ],
    "recommendations": [
        {"title": "<recommendation title>", "description": "<brief description>", "potentialSavings": "<amount or percentage>"}
    ],
    "riskFactors": [
        {"risk": "<risk description>", "impact": "<high/medium/low>", "mitigation": "<suggestion>"}
    ],
    "marketInsights": "<2-3 sentences about current market conditions for this type of project>",
    "overallAdvice": "<2-3 sentences of overall budget advice>"
}

Ensure your estimates are realistic and based on current construction industry standards. Consider regional variations in costs.`;
    },

    // Parse AI response and extract structured data
    parseAIResponse(text) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            // If no JSON found, return formatted text response
            return {
                overallAdvice: text,
                estimatedBudgetRange: null,
                budgetBreakdown: [],
                keyFactors: [],
                recommendations: [],
                riskFactors: [],
                marketInsights: ''
            };
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return {
                overallAdvice: text,
                estimatedBudgetRange: null,
                budgetBreakdown: [],
                keyFactors: [],
                recommendations: [],
                riskFactors: [],
                marketInsights: ''
            };
        }
    },

    // Get material cost estimates
    async getMaterialEstimates(plotData, constructionType) {
        if (!this.isConfigured()) {
            throw new Error('API key not configured');
        }

        const prompt = `As a construction cost expert, provide material cost estimates for:
        
Location: ${plotData.city}, ${plotData.state}
Area: ${plotData.area_sqft} sq ft
Construction Type: ${constructionType}

Provide estimates in JSON format:
{
    "materials": [
        {"name": "<material>", "quantity": "<estimated quantity>", "unitPrice": "<price range>", "totalEstimate": "<range>"}
    ],
    "laborCosts": {"hourlyRange": "<range>", "estimatedTotal": "<range>"},
    "notes": "<important considerations>"
}`;

        try {
            const response = await fetch(`${this.API_URL}?key=${this.getApiKey()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.5, maxOutputTokens: 1024 }
                })
            });

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return this.parseAIResponse(text);
        } catch (error) {
            throw error;
        }
    },

    // Ask custom budget question
    async askBudgetQuestion(plotData, question) {
        if (!this.isConfigured()) {
            throw new Error('API key not configured');
        }

        const prompt = `As a construction budget expert, answer this question about a property:

Property: ${plotData.title} in ${plotData.city}, ${plotData.state}
Area: ${plotData.area_sqft} sq ft
Type: ${plotData.plot_type}

User Question: ${question}

Provide a helpful, detailed response with specific budget considerations and recommendations.`;

        try {
            const response = await fetch(`${this.API_URL}?key=${this.getApiKey()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
                })
            });

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response';
        } catch (error) {
            throw error;
        }
    }
};

// Initialize API key from storage
AIService.getApiKey();
