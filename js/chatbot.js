// ============================================
// OUTFIT ASSISTANT CHATBOT
// ============================================

class OutfitChatbot {
    constructor() {
        this.apiKey = '0f095c58-1ff4-4e16-870a-80c69a3994ca';
        this.apiUrl = 'https://api.cohere.ai/v1/chat';
        this.conversationHistory = [];
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }
    
    createChatbotUI() {
        const chatbotHTML = `
            <!-- Chatbot Button -->
            <button class="chatbot-button" id="chatbotToggle" aria-label="Open Outfit Assistant">
                👗
            </button>
            
            <!-- Chatbot Container -->
            <div class="chatbot-container" id="chatbotContainer">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">🤖</div>
                        <div class="chatbot-title">
                            <h3>Outfit Assistant</h3>
                            <div class="chatbot-status">
                                <span class="status-dot"></span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose" aria-label="Close chatbot">×</button>
                </div>
                
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Messages will appear here -->
                </div>
                
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbotInput" 
                        placeholder="Ask me about outfits, colors, styling..."
                        autocomplete="off"
                    />
                    <button class="chatbot-send-btn" id="chatbotSend" aria-label="Send message">
                        ➤
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbotToggle');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        
        toggleBtn.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    toggleChatbot() {
        const container = document.getElementById('chatbotContainer');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.classList.add('active');
            document.getElementById('chatbotInput').focus();
        } else {
            container.classList.remove('active');
        }
    }
    
    closeChatbot() {
        const container = document.getElementById('chatbotContainer');
        container.classList.remove('active');
        this.isOpen = false;
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', `Hi! 👋 I'm your personal outfit assistant! I can help you with:

• Best outfit suggestions for any occasion
• Color matching and coordination
• Style recommendations based on body type
• Fashion trends and tips
• Wardrobe planning

What would you like to know?`);
            
            this.showQuickSuggestions([
                'Suggest outfit for party',
                'Color matching tips',
                'Casual office wear',
                'Summer outfit ideas'
            ]);
        }, 500);
    }
    
    addMessage(type, content, showTime = true) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message ${type}">
                <div class="message-avatar">${type === 'bot' ? '🤖' : '👤'}</div>
                <div class="message-bubble">
                    <div class="message-content">${content}</div>
                    ${showTime ? `<div class="message-time">${time}</div>` : ''}
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showQuickSuggestions(suggestions) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const suggestionsHTML = `
            <div class="quick-suggestions">
                ${suggestions.map(suggestion => `
                    <button class="suggestion-chip" onclick="outfitChatbot.handleSuggestionClick('${suggestion}')">
                        ${suggestion}
                    </button>
                `).join('')}
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    handleSuggestionClick(suggestion) {
        document.getElementById('chatbotInput').value = suggestion;
        this.sendMessage();
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const typingHTML = `
            <div class="message bot typing-message">
                <div class="message-avatar">🤖</div>
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add bot response
            this.addMessage('bot', response);
            
            // Show contextual suggestions
            this.showContextualSuggestions(message);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.removeTypingIndicator();
            this.addMessage('bot', 'Sorry, I encountered an error. Please try again! 😊');
        }
    }
    
    async getAIResponse(userMessage) {
        const systemPrompt = `You are a highly knowledgeable and friendly fashion stylist and outfit consultant for StyloOutfit. 

Your personality:
- Warm, conversational, and enthusiastic about fashion
- Provide detailed, thoughtful responses like ChatGPT
- Ask follow-up questions to better understand user needs
- Give personalized advice based on context
- Use natural, flowing language

Your expertise includes:
- Outfit recommendations for any occasion (parties, weddings, office, casual, formal, dates)
- Color theory and coordination
- Body type-specific styling advice
- Fashion trends and seasonal recommendations
- Wardrobe planning and organization
- Accessory and footwear suggestions
- Fabric and material guidance
- Budget-friendly fashion tips
- Sustainable fashion choices

Response style:
- Be conversational and engaging
- Provide detailed explanations when helpful
- Use emojis naturally to enhance communication
- Break down complex advice into easy steps
- Offer multiple options when relevant
- Show enthusiasm for helping users look their best

Always be helpful, positive, and encouraging. Make users feel confident about their style choices.`;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    model: 'command-r',
                    preamble: systemPrompt,
                    conversation_id: this.conversationId,
                    temperature: 0.8,
                    max_tokens: 800,
                    chat_history: this.conversationHistory
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            // Store conversation ID and history for context
            if (data.conversation_id) {
                this.conversationId = data.conversation_id;
            }
            
            // Update conversation history
            this.conversationHistory.push({
                role: 'USER',
                message: userMessage
            });
            
            if (data.text) {
                this.conversationHistory.push({
                    role: 'CHATBOT',
                    message: data.text
                });
            }
            
            // Keep only last 10 exchanges to manage context
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }
            
            return data.text || 'I apologize, but I couldn\'t generate a response. Please try again!';
            
        } catch (error) {
            console.error('API Error:', error);
            
            // Fallback responses
            return this.getFallbackResponse(userMessage);
        }
    }
    
    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('party') || lowerMessage.includes('celebration')) {
            return `🎉 For a party outfit, I recommend:

• **Women**: A stylish cocktail dress in bold colors like emerald green or royal blue, paired with statement jewelry and heels.
• **Men**: A well-fitted blazer with dark jeans and dress shoes, or a crisp shirt with chinos.

**Color tip**: Jewel tones work great for evening parties!

Would you like specific color combinations?`;
        }
        
        if (lowerMessage.includes('color') || lowerMessage.includes('match')) {
            return `🎨 Here are some classic color matching tips:

**Complementary Colors:**
• Navy blue + Beige/Cream
• Black + White/Gold
• Burgundy + Gray
• Olive green + Tan

**Pro tip**: Use the 60-30-10 rule - 60% dominant color, 30% secondary, 10% accent!

Need help with a specific color combination?`;
        }
        
        if (lowerMessage.includes('office') || lowerMessage.includes('work') || lowerMessage.includes('professional')) {
            return `💼 Professional office wear suggestions:

**Business Formal:**
• Tailored suit in navy, gray, or black
• Crisp white or light blue shirt
• Conservative tie and leather shoes

**Business Casual:**
• Blazer with chinos/dress pants
• Button-down shirt or blouse
• Loafers or modest heels

**Color palette**: Stick to neutrals with one accent color!

What's your office dress code?`;
        }
        
        if (lowerMessage.includes('summer') || lowerMessage.includes('hot')) {
            return `☀️ Summer outfit ideas:

**Fabrics**: Cotton, linen, breathable materials
**Colors**: Light pastels, whites, bright colors

**Outfit ideas:**
• Flowy maxi dress with sandals
• Linen shirt with shorts
• Light cotton pants with a tank top

**Pro tip**: Choose light colors to reflect heat!

Need specific occasion-based summer outfits?`;
        }
        
        if (lowerMessage.includes('wedding') || lowerMessage.includes('formal')) {
            return `💒 Wedding outfit suggestions:

**For Guests:**
• Elegant dress or suit in jewel tones
• Avoid white (that's for the bride!)
• Dressy shoes and minimal jewelry

**Color recommendations:**
• Burgundy, navy, emerald green
• Blush pink, champagne, dusty blue

**Tip**: Check the dress code on the invitation!

Guest or part of the wedding party?`;
        }
        
        return `I'm here to help with outfit suggestions! 👗

I can assist with:
• Outfit ideas for any occasion
• Color matching advice
• Style recommendations
• Fashion tips

Try asking me about:
"What should I wear to a party?"
"How to match colors?"
"Office outfit ideas"

What would you like to know?`;
    }
    
    showContextualSuggestions(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let suggestions = [];
        
        if (lowerMessage.includes('party')) {
            suggestions = ['Color matching for party', 'Accessories for party outfit', 'Shoes for party wear'];
        } else if (lowerMessage.includes('color')) {
            suggestions = ['Seasonal color trends', 'Colors for my skin tone', 'Neutral color combos'];
        } else if (lowerMessage.includes('office')) {
            suggestions = ['Casual Friday outfit', 'Professional accessories', 'Office shoes guide'];
        } else {
            suggestions = ['Wedding outfit ideas', 'Casual weekend wear', 'Date night outfit'];
        }
        
        if (suggestions.length > 0) {
            this.showQuickSuggestions(suggestions);
        }
    }
}

// Initialize chatbot when DOM is loaded
let outfitChatbot;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        outfitChatbot = new OutfitChatbot();
    });
} else {
    outfitChatbot = new OutfitChatbot();
}
