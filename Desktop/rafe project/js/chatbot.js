/* ============================================
   SMART CHATBOT - No API Key Required
   Intelligent Rule-Based Chat System
   With Multi-Currency Support
   ============================================ */

const ChatBot = {
    isOpen: false,
    messageHistory: [],
    currentCurrency: 'USD',

    // Currency data with exchange rates (base: USD)
    currencies: {
        USD: { symbol: '$', name: 'US Dollar', rate: 1, flag: '🇺🇸' },
        EUR: { symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
        GBP: { symbol: '£', name: 'British Pound', rate: 0.79, flag: '🇬🇧' },
        PKR: { symbol: 'Rs', name: 'Pakistani Rupee', rate: 278.50, flag: '🇵🇰' },
        INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.12, flag: '🇮🇳' },
        AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67, flag: '🇦🇪' },
        SAR: { symbol: 'ر.س', name: 'Saudi Riyal', rate: 3.75, flag: '🇸🇦' },
        CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.36, flag: '🇨🇦' },
        AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.53, flag: '🇦🇺' },
        CNY: { symbol: '¥', name: 'Chinese Yuan', rate: 7.24, flag: '🇨🇳' },
        JPY: { symbol: '¥', name: 'Japanese Yen', rate: 149.50, flag: '🇯🇵' },
        MYR: { symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.47, flag: '🇲🇾' },
        SGD: { symbol: 'S$', name: 'Singapore Dollar', rate: 1.34, flag: '🇸🇬' },
        BDT: { symbol: '৳', name: 'Bangladeshi Taka', rate: 109.75, flag: '🇧🇩' },
        PHP: { symbol: '₱', name: 'Philippine Peso', rate: 56.20, flag: '🇵🇭' },
        NGN: { symbol: '₦', name: 'Nigerian Naira', rate: 1550, flag: '🇳🇬' },
        ZAR: { symbol: 'R', name: 'South African Rand', rate: 18.65, flag: '🇿🇦' },
        BRL: { symbol: 'R$', name: 'Brazilian Real', rate: 4.97, flag: '🇧🇷' },
        MXN: { symbol: 'MX$', name: 'Mexican Peso', rate: 17.15, flag: '🇲🇽' },
        TRY: { symbol: '₺', name: 'Turkish Lira', rate: 30.25, flag: '🇹🇷' }
    },

    // Convert USD amount to selected currency
    convertPrice(usdAmount) {
        const currency = this.currencies[this.currentCurrency];
        const converted = usdAmount * currency.rate;
        return this.formatCurrency(converted);
    },

    // Format currency with proper symbol and formatting
    formatCurrency(amount) {
        const currency = this.currencies[this.currentCurrency];
        const formatted = amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return `${currency.symbol}${formatted}`;
    },

    // Convert price range (e.g., "$15,000 - $75,000")
    convertPriceRange(minUSD, maxUSD) {
        return `${this.convertPrice(minUSD)} - ${this.convertPrice(maxUSD)}`;
    },

    // Convert per sq ft price
    convertPerSqFt(minUSD, maxUSD) {
        return `${this.convertPrice(minUSD)} - ${this.convertPrice(maxUSD)}/sq ft`;
    },

    // Get knowledge base with converted prices
    getKnowledgeBase() {
        return {
            greetings: {
                patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
                responses: [
                    "Hello! 👋 Welcome to BuildQuote Pro! I'm your construction assistant. How can I help you today?",
                    "Hi there! 🏗️ I'm here to help you with all your construction project needs. What would you like to know?",
                    "Hey! 👋 Great to see you! Ready to help you find the perfect builder or answer any construction questions!"
                ]
            },

            farewell: {
                patterns: ['bye', 'goodbye', 'see you', 'take care', 'later', 'quit', 'exit'],
                responses: [
                    "Goodbye! 👋 Thanks for chatting with BuildQuote Pro. Good luck with your project!",
                    "See you later! 🏠 Don't hesitate to come back if you have more questions!",
                    "Take care! 🔨 Wishing you success with your construction project!"
                ]
            },

            thanks: {
                patterns: ['thank', 'thanks', 'appreciate', 'grateful', 'thx'],
                responses: [
                    "You're welcome! 😊 Happy to help! Is there anything else you'd like to know?",
                    "My pleasure! 🌟 Let me know if you need any more assistance!",
                    "Glad I could help! 💪 Feel free to ask more questions anytime!"
                ]
            },

            currency: {
                patterns: ['currency', 'change currency', 'other currency', 'dollar', 'euro', 'pound', 'rupee', 'pkr', 'inr', 'aed', 'sar', 'money'],
                responses: [
                    `Currently showing prices in ${this.currencies[this.currentCurrency].flag} **${this.currencies[this.currentCurrency].name}** (${this.currentCurrency}).\n\nTo change currency, click the currency selector (🌍) in the chat header, or type one of these:\n\n• "use USD" - US Dollar 🇺🇸\n• "use EUR" - Euro 🇪🇺\n• "use GBP" - British Pound 🇬🇧\n• "use PKR" - Pakistani Rupee 🇵🇰\n• "use INR" - Indian Rupee 🇮🇳\n• "use AED" - UAE Dirham 🇦🇪\n\nAnd many more! Just type "use [currency code]".`
                ]
            },

            quote: {
                patterns: ['quote', 'price', 'cost', 'estimate', 'how much', 'pricing', 'budget'],
                responses: [
                    "Great question! 💰 To get accurate quotes, you can:\n\n1️⃣ Sign up as a customer\n2️⃣ Submit your project details\n3️⃣ Receive quotes from verified builders\n\nWould you like me to guide you through the signup process?",
                    "Getting a quote is easy! 📋 Our platform connects you with local builders who will provide competitive quotes for your project. The best part? It's completely free to submit a request!\n\nClick 'Get Started' to begin!",
                    `Construction costs vary based on project scope, materials, and location. 🏗️ Our verified builders provide transparent quotes.\n\n**Average ranges (${this.currencies[this.currentCurrency].flag} ${this.currentCurrency}):**\n\n🏠 Home renovation: ${this.convertPerSqFt(50, 200)}\n🔨 Kitchen remodel: ${this.convertPriceRange(15000, 75000)}\n🛁 Bathroom: ${this.convertPriceRange(10000, 30000)}\n\nWant me to connect you with builders for an exact quote?`
                ]
            },

            builder: {
                patterns: ['builder', 'contractor', 'find builder', 'hire', 'professional', 'construction company'],
                responses: [
                    "Looking for a builder? 👷 You're in the right place! BuildQuote Pro connects you with verified, licensed contractors in your area.\n\n✅ Background checked\n✅ Licensed & insured\n✅ Customer reviews\n✅ Competitive pricing\n\nWould you like to browse builders or submit a project request?",
                    "We have a network of trusted builders! 🏗️ All our contractors are:\n\n⭐ Verified & vetted\n⭐ Locally based\n⭐ Competitively priced\n\nTell me about your project and I'll help match you with the right professionals!",
                    "Finding the right builder is crucial! 🔍 Our platform makes it easy:\n\n1. Describe your project\n2. Get matched with suitable builders\n3. Compare quotes & reviews\n4. Choose the best fit\n\nWhat type of project are you planning?"
                ]
            },

            renovation: {
                patterns: ['renovation', 'remodel', 'renovate', 'remodeling', 'upgrade', 'improve'],
                responses: [
                    "Planning a renovation? Exciting! 🏠✨ Here are some tips:\n\n📌 Set a realistic budget (add 15-20% contingency)\n📌 Prioritize structural work first\n📌 Get multiple quotes (we can help!)\n📌 Check permits requirements\n\nWhat type of renovation are you considering?",
                    "Renovations can transform your space! 🔨 Popular projects include:\n\n🍳 Kitchen updates\n🛁 Bathroom remodels\n🏗️ Room additions\n🎨 Interior updates\n\nWhich area are you looking to renovate?"
                ]
            },

            kitchen: {
                patterns: ['kitchen', 'cooking', 'cabinets', 'countertop'],
                responses: [
                    `Kitchen renovations are one of the best investments! 🍳\n\n💡 Key considerations:\n• Layout efficiency\n• Cabinet quality & storage\n• Countertop materials (granite, quartz, marble)\n• Appliance upgrades\n• Lighting design\n\n**Estimated costs (${this.currencies[this.currentCurrency].flag} ${this.currentCurrency}):**\nAverage timeline: 6-12 weeks\nBudget range: ${this.convertPriceRange(15000, 75000)}\n\nWant to get quotes from kitchen specialists?`,
                    "A great kitchen makes a home! 👨‍🍳 Top trends:\n\n✨ Open floor plans\n✨ Smart appliances\n✨ Quartz countertops\n✨ Custom cabinetry\n✨ Statement lighting\n\nI can connect you with kitchen renovation experts!"
                ]
            },

            bathroom: {
                patterns: ['bathroom', 'bath', 'shower', 'toilet', 'vanity'],
                responses: [
                    `Bathroom remodels add serious value! 🛁\n\n📋 Common updates:\n• Walk-in showers\n• Double vanities\n• Heated floors\n• Modern fixtures\n• Better ventilation\n\n**Estimated costs (${this.currencies[this.currentCurrency].flag} ${this.currentCurrency}):**\nTypical cost: ${this.convertPriceRange(10000, 30000)}\nTimeline: 3-6 weeks\n\nShall I help you find bathroom renovation specialists?`
                ]
            },

            howItWorks: {
                patterns: ['how it works', 'how does it work', 'process', 'explain', 'what do you do', 'help me understand'],
                responses: [
                    "Here's how BuildQuote Pro works! 🎯\n\n**For Customers:**\n1️⃣ Submit your project details\n2️⃣ Receive quotes from verified builders\n3️⃣ Compare prices & reviews\n4️⃣ Choose your builder\n5️⃣ Project gets completed! ✅\n\n**For Builders:**\n1️⃣ Create your profile\n2️⃣ Browse available projects\n3️⃣ Submit competitive quotes\n4️⃣ Win new business! 💼\n\nReady to get started?"
                ]
            },

            materials: {
                patterns: ['material', 'wood', 'concrete', 'steel', 'brick', 'tiles', 'flooring'],
                responses: [
                    `Great question about materials! 🧱\n\n**Popular choices (${this.currencies[this.currentCurrency].flag} ${this.currentCurrency}):**\n\n🪵 **Wood**: Warm, versatile, ${this.convertPerSqFt(3, 12)}\n🧱 **Brick**: Durable, classic, ${this.convertPerSqFt(10, 30)}\n🔩 **Steel**: Strong, modern, ${this.convertPerSqFt(40, 70)}\n🪨 **Concrete**: Affordable, sturdy, ${this.convertPerSqFt(2, 8)}\n\nMaterial choice depends on:\n• Budget\n• Climate\n• Design style\n• Durability needs\n\nOur builders can recommend the best materials for your project!`
                ]
            },

            timeline: {
                patterns: ['how long', 'timeline', 'duration', 'time', 'weeks', 'months', 'schedule'],
                responses: [
                    "Project timelines vary by scope! ⏱️\n\n📅 **Typical durations:**\n\n• Minor repairs: 1-3 days\n• Bathroom remodel: 3-6 weeks\n• Kitchen renovation: 6-12 weeks\n• Room addition: 2-4 months\n• Full home renovation: 4-8 months\n• New construction: 6-12 months\n\n💡 Tip: Weather, permits, and material availability can affect timelines.\n\nWant a more specific estimate for your project?"
                ]
            },

            permit: {
                patterns: ['permit', 'license', 'legal', 'approval', 'zoning', 'regulation'],
                responses: [
                    "Good thinking about permits! 📋\n\n**When you typically need permits:**\n✅ Structural changes\n✅ Electrical work\n✅ Plumbing modifications\n✅ HVAC installations\n✅ Room additions\n✅ Deck building\n\n**Usually no permit needed:**\n• Painting\n• Flooring replacement\n• Cabinet refacing\n• Minor repairs\n\nOur verified builders handle permit applications for you!"
                ]
            },

            payment: {
                patterns: ['payment', 'pay', 'deposit', 'financing', 'loan', 'credit'],
                responses: [
                    "Great question about payments! 💳\n\n**Typical payment structure:**\n📌 10-15% deposit upfront\n📌 Progress payments at milestones\n📌 Final payment on completion\n\n**Financing options:**\n• Home equity loans\n• Personal loans\n• Contractor financing\n• Credit cards (for smaller projects)\n\n💡 Never pay 100% upfront! Our platform offers secure milestone payments."
                ]
            },

            signup: {
                patterns: ['sign up', 'signup', 'register', 'create account', 'join', 'get started'],
                responses: [
                    "Ready to join? Awesome! 🎉\n\n**Choose your path:**\n\n👤 **Customer Signup**\n• Post projects for free\n• Receive multiple quotes\n• Access verified builders\n\n👷 **Builder Signup**\n• Create your profile\n• Bid on local projects\n• Grow your business\n\nClick 'Get Started' in the top menu to begin!\n\nNeed help choosing?"
                ]
            },

            warranty: {
                patterns: ['warranty', 'guarantee', 'protection', 'insurance', 'covered'],
                responses: [
                    "Protection matters! 🛡️\n\n**BuildQuote Pro ensures:**\n\n✅ Licensed & insured builders\n✅ Workmanship guarantees\n✅ Material warranties\n✅ Dispute resolution support\n\n**Typical warranties:**\n• Structural: 10+ years\n• Systems (HVAC, plumbing): 1-5 years\n• Finishes: 1-2 years\n\nAlways discuss warranty terms before starting work!"
                ]
            },

            emergency: {
                patterns: ['emergency', 'urgent', 'asap', 'immediately', 'leak', 'flood', 'broken'],
                responses: [
                    "🚨 Emergency repair needed?\n\n**Immediate steps:**\n1. Turn off water/power if needed\n2. Document damage with photos\n3. Contact emergency services if safety risk\n\n**We can help with:**\n• Emergency plumber referrals\n• 24/7 contractor contacts\n• Quick quote turnaround\n\nDescribe your emergency and I'll help connect you with available contractors ASAP!"
                ]
            },

            about: {
                patterns: ['about', 'who are you', 'what are you', 'company', 'buildquote'],
                responses: [
                    "I'm BuildBot, your AI assistant! 🤖\n\n**About BuildQuote Pro:**\nWe're a platform connecting property owners with verified construction professionals.\n\n🎯 **Our Mission:**\nMake finding quality builders easy, transparent, and stress-free!\n\n⭐ **What we offer:**\n• Verified builder network\n• Free quote requests\n• Secure communications\n• Review & rating system\n\nHow can I assist with your project today?"
                ]
            },

            default: {
                responses: [
                    "I'm not quite sure I understood that. 🤔 Could you try rephrasing? Or you can ask me about:\n\n• Getting quotes\n• Finding builders\n• Renovation tips\n• Project timelines\n• Costs & budgets",
                    "Hmm, I don't have specific info on that. 💭 But I can help with:\n\n🏗️ Construction queries\n💰 Pricing & quotes\n👷 Finding contractors\n📋 Project planning\n\nWhat would you like to know?",
                    "I'm still learning! 📚 While I process that, here's what I can definitely help with:\n\n• How to get quotes\n• Builder recommendations\n• Renovation ideas\n• Timeline estimates\n\nTry asking about any of these!"
                ]
            }
        };
    },

    // Initialize the chatbot
    init() {
        this.loadCurrency();
        this.createChatbotHTML();
        this.attachEventListeners();
        this.showWelcomeMessage();
        console.log('🤖 ChatBot initialized successfully with multi-currency support!');
    },

    // Load saved currency preference
    loadCurrency() {
        const saved = localStorage.getItem('chatbot_currency');
        if (saved && this.currencies[saved]) {
            this.currentCurrency = saved;
        }
    },

    // Save currency preference
    saveCurrency() {
        localStorage.setItem('chatbot_currency', this.currentCurrency);
    },

    // Set new currency
    setCurrency(code) {
        if (this.currencies[code]) {
            this.currentCurrency = code;
            this.saveCurrency();
            this.updateCurrencyDisplay();
            return true;
        }
        return false;
    },

    // Update currency display in header
    updateCurrencyDisplay() {
        const display = document.getElementById('currency-display');
        if (display) {
            const currency = this.currencies[this.currentCurrency];
            display.innerHTML = `${currency.flag} ${this.currentCurrency}`;
        }
    },

    // Create chatbot HTML structure
    createChatbotHTML() {
        const currency = this.currencies[this.currentCurrency];
        const currencyOptions = Object.entries(this.currencies).map(([code, data]) =>
            `<option value="${code}" ${code === this.currentCurrency ? 'selected' : ''}>${data.flag} ${code} - ${data.name}</option>`
        ).join('');

        const chatbotHTML = `
            <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat">
                <span class="toggle-icon">💬</span>
            </button>
            
            <div class="chatbot-container" id="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">🤖</div>
                    <div class="chatbot-info">
                        <h3 class="chatbot-name">BuildBot Assistant</h3>
                        <span class="chatbot-status">
                            <span class="status-dot"></span>
                            Always here to help
                        </span>
                    </div>
                    <div class="currency-selector-wrapper">
                        <select class="currency-selector" id="currency-selector" title="Select currency">
                            ${currencyOptions}
                        </select>
                        <span class="currency-icon">🌍</span>
                    </div>
                    <button class="chatbot-close" id="chatbot-close" aria-label="Close chat">×</button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be inserted here -->
                </div>
                
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbot-input" 
                        placeholder="Type your message..."
                        autocomplete="off"
                    >
                    <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
                        ➤
                    </button>
                </div>
            </div>
        `;

        const chatbotWrapper = document.createElement('div');
        chatbotWrapper.id = 'chatbot-wrapper';
        chatbotWrapper.innerHTML = chatbotHTML;
        document.body.appendChild(chatbotWrapper);
    },

    // Attach event listeners
    attachEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const currencySelector = document.getElementById('currency-selector');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Currency selector change
        currencySelector.addEventListener('change', (e) => {
            const newCurrency = e.target.value;
            this.setCurrency(newCurrency);
            const currency = this.currencies[newCurrency];
            this.addMessage(`Currency changed to ${currency.flag} **${currency.name}** (${newCurrency}).\nAll prices will now be shown in ${currency.symbol}.`, 'bot');
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChat();
            }
        });
    },

    // Toggle chat open/close
    toggleChat() {
        const container = document.getElementById('chatbot-container');
        const toggle = document.getElementById('chatbot-toggle');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            container.classList.add('active');
            toggle.classList.add('active');
            toggle.innerHTML = '<span class="toggle-icon">✕</span>';
            document.getElementById('chatbot-input').focus();
        } else {
            container.classList.remove('active');
            toggle.classList.remove('active');
            toggle.innerHTML = '<span class="toggle-icon">💬</span>';
        }
    },

    // Show welcome message
    showWelcomeMessage() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const currency = this.currencies[this.currentCurrency];

        const welcomeHTML = `
            <div class="welcome-card">
                <h4>👋 Welcome to BuildQuote Pro!</h4>
                <p>I'm BuildBot, your AI construction assistant. I can help you with quotes, finding builders, project advice, and more!</p>
                <div class="currency-notice">
                    <span class="currency-badge">${currency.flag} ${this.currentCurrency}</span>
                    <span>Prices shown in ${currency.name}</span>
                </div>
            </div>
            <div class="suggestions-grid">
                <div class="suggestion-item" onclick="ChatBot.handleSuggestion('How do I get a quote?')">
                    <span class="icon">💰</span>
                    <span class="text">Get a Quote</span>
                </div>
                <div class="suggestion-item" onclick="ChatBot.handleSuggestion('How do I find a builder?')">
                    <span class="icon">👷</span>
                    <span class="text">Find Builders</span>
                </div>
                <div class="suggestion-item" onclick="ChatBot.handleSuggestion('I need renovation advice')">
                    <span class="icon">🏠</span>
                    <span class="text">Renovation Tips</span>
                </div>
                <div class="suggestion-item" onclick="ChatBot.handleSuggestion('Change currency')">
                    <span class="icon">🌍</span>
                    <span class="text">Change Currency</span>
                </div>
            </div>
        `;

        messagesContainer.innerHTML = welcomeHTML;
    },

    // Handle suggestion click
    handleSuggestion(text) {
        document.getElementById('chatbot-input').value = text;
        this.sendMessage();
    },

    // Send message
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Check for currency change command
        const currencyMatch = message.toLowerCase().match(/use\s+([a-z]{3})/i);
        if (currencyMatch) {
            const code = currencyMatch[1].toUpperCase();
            if (this.currencies[code]) {
                this.setCurrency(code);
                document.getElementById('currency-selector').value = code;
                setTimeout(() => {
                    const currency = this.currencies[code];
                    this.addMessage(`✅ Currency changed to ${currency.flag} **${currency.name}** (${code})!\n\nAll prices will now be displayed in ${currency.symbol}. Ask me about costs to see the new prices!`, 'bot');
                }, 500);
                return;
            }
        }

        // Show typing indicator
        this.showTyping();

        // Generate and show response after delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 800 + Math.random() * 700);
    },

    // Add message to chat
    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageHTML = `
            <div class="chat-message ${type}">
                <div class="message-avatar">${type === 'bot' ? '🤖' : '👤'}</div>
                <div class="message-content">
                    ${this.formatMessage(content)}
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messageHistory.push({ type, content, time });
    },

    // Format message with markdown-like styling
    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    },

    // Show typing indicator
    showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="chat-message bot" id="typing-indicator">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    // Hide typing indicator
    hideTyping() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    // Generate response based on user input
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const knowledgeBase = this.getKnowledgeBase();

        // Check each category in knowledge base
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (category === 'default') continue;

            const hasMatch = data.patterns.some(pattern => message.includes(pattern));

            if (hasMatch) {
                const responses = data.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }

        // Return default response if no match found
        const defaults = knowledgeBase.default.responses;
        return defaults[Math.floor(Math.random() * defaults.length)];
    }
};

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ChatBot.init();
});
