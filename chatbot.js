(function () {
    'use strict';

    // ── Cart State ──────────────────────────────────────────────
    const cart = [];
    let orderState = null; // null | {step, data}

    // ── Product Catalogue ────────────────────────────────────────
    const PRODUCTS = [
        { id: 1, name: 'Indoor Plants',   price: 45, img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=400&auto=format&fit=crop', link: '#shop' },
        { id: 2, name: 'Hanging Plants',  price: 35, img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop', link: '#shop' },
        { id: 3, name: 'Tabletop Décor',  price: 55, img: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?q=80&w=400&auto=format&fit=crop', link: '#shop' },
        { id: 4, name: 'Wall Greens',     price: 65, img: 'https://images.unsplash.com/photo-1491147334573-44cbb4602074?q=80&w=400&auto=format&fit=crop', link: '#shop' },
        { id: 5, name: 'Luxe Fern',       price: 50, img: 'https://images.unsplash.com/photo-1501004318641-729e8c22bd8e?q=80&w=400&auto=format&fit=crop', link: '#best-sellers' },
        { id: 6, name: 'Monstera Chic',   price: 60, img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=400&auto=format&fit=crop', link: '#best-sellers' },
        { id: 7, name: 'Sage Corner',     price: 40, img: 'https://images.unsplash.com/photo-1520412099561-64831ebaeeec?q=80&w=400&auto=format&fit=crop', link: '#best-sellers' },
    ];

    // ── Intent Map ────────────────────────────────────────────────
    const INTENTS = [
        { keys: ['hello','hi','hey','hii','helo','hola','sup','what\'s up','whats up','start'], fn: welcomeReply },
        { keys: ['product','show','collection','catalog','what do you have','what do you sell','browse','available'], fn: showAllProducts },
        { keys: ['indoor','room plant','desk plant','inside plant'], fn: () => showProduct(1) },
        { keys: ['hanging','ceiling plant','porch plant'], fn: () => showProduct(2) },
        { keys: ['tabletop','table decor','desk decor'], fn: () => showProduct(3) },
        { keys: ['wall green','wall plant','vertical'], fn: () => showProduct(4) },
        { keys: ['fern','luxe fern'], fn: () => showProduct(5) },
        { keys: ['monstera','chic plant'], fn: () => showProduct(6) },
        { keys: ['sage','sage corner'], fn: () => showProduct(7) },
        { keys: ['best','trending','popular','top sell','best seller','favourite','most loved','which one','recommend'], fn: bestReply },
        { keys: ['cart','my cart','what\'s in my cart','show cart','view cart'], fn: showCartReply },
        { keys: ['remove','delete from cart','clear cart'], fn: clearCartReply },
        { keys: ['order','place order','checkout','buy now','purchase','confirm order'], fn: startOrder },
        { keys: ['price','cost','how much','rate','pricing','affordable'], fn: priceReply },
        { keys: ['ship','delivery','when will','how long','dispatch','courier'], fn: () => text('🚚 We offer **free shipping** on orders above $75. Standard delivery takes **3–5 business days**. Express delivery (1–2 days) is available at checkout for a small fee.') },
        { keys: ['return','refund','exchange','money back','send back'], fn: () => text('↩️ We have a **30-day hassle-free return policy**. Just contact us and we\'ll arrange free pickup and a full refund — no questions asked.') },
        { keys: ['material','made of','quality','real','realistic','fake','artificial'], fn: () => text('🌿 Our plants use **ultra-realistic, UV-resistant, pet-safe synthetic materials** — so lifelike that guests won\'t even know they\'re artificial!') },
        { keys: ['maintain','water','sunlight','care','clean','dust'], fn: () => text('✨ **Zero maintenance needed!** Just wipe down with a soft dry cloth every few weeks. No water, no sunlight — that\'s the whole point of Home Deco! 💚') },
        { keys: ['discount','coupon','promo','offer','sale','off','deal'], fn: () => text('🎉 Subscribe to our newsletter and get **15% off your first order**! We also run seasonal flash sales — follow us on Instagram @HomeDecoOfficial to never miss a deal.') },
        { keys: ['pay','payment','card','paypal','apple pay','google pay','upi'], fn: () => text('💳 We accept **Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay,** and UPI. All payments are 100% secure and encrypted.') },
        { keys: ['eco','environment','sustainable','green','recycle'], fn: () => text('♻️ Our plants are made with **recyclable, eco-friendly materials**. We are committed to sustainability at every step of our supply chain.') },
        { keys: ['contact','email','support','help','reach','talk to'], fn: () => text('📧 Reach us at **hello@homedeco.com** or DM us on Instagram @HomeDecoOfficial. We reply within **24 hours** — usually much faster! 🌿') },
        { keys: ['about','who are you','what is home deco'], fn: aboutReply },
        { keys: ['thank','thanks','awesome','great','perfect','cool','nice','wow'], fn: () => text(['You\'re welcome! 🌿 Happy decorating!', 'Glad I could help! 💚 Anything else?', 'Anytime! Let me know if you need more help 🌱'][Math.floor(Math.random()*3)]) },
        { keys: ['bye','goodbye','cya','see you','later'], fn: () => text('Goodbye! 🌿 Thanks for visiting Home Deco. May your home always feel like a garden. Come back soon! 💚') },
    ];

    // ── Response helpers ─────────────────────────────────────────
    function text(t) { return { type: 'text', text: t }; }

    function welcomeReply() {
        return text('Hey! 👋 Welcome to **Home Deco** — your go-to for premium artificial plants & home décor.\n\nI can help you:\n🛍️ Browse & add products to your cart\n📦 Place an order\n🚚 Track shipping info\n💬 Answer any question\n\nWhat are you looking for today?');
    }

    function aboutReply() {
        return text('🌿 **Home Deco** sells premium artificial plants designed for modern homes.\n\n✅ Zero maintenance\n🌱 Ultra-realistic quality\n♻️ Eco-friendly materials\n🏠 Perfect for any space\n\nOur motto: *Make every home greener, one aesthetic plant at a time.*');
    }

    function priceReply() {
        const lines = PRODUCTS.map(p => `🌿 ${p.name} — **$${p.price}.00**`).join('\n');
        return text(`Here\'s our full price list:\n\n${lines}\n\n🎉 Newsletter subscribers get **15% off** their first order!`);
    }

    function bestReply() {
        return {
            type: 'products',
            text: '🔥 Our top picks right now — customers absolutely love these:',
            products: [PRODUCTS[4], PRODUCTS[5], PRODUCTS[0]]
        };
    }

    function showAllProducts() {
        return {
            type: 'products',
            text: '🛍️ Here\'s our full collection! Click **Add to Cart** on anything you like:',
            products: PRODUCTS
        };
    }

    function showProduct(id) {
        const p = PRODUCTS.find(x => x.id === id);
        return {
            type: 'products',
            text: `Here\'s our **${p.name}** — a top seller! 🌿`,
            products: [p]
        };
    }

    function showCartReply() {
        if (cart.length === 0) return text('🛒 Your cart is empty! Browse our collection and add something you love. 🌿\n\nType **"show products"** to explore.');
        const lines = cart.map((c, i) => `${i+1}. ${c.name} × ${c.qty} — **$${(c.price * c.qty).toFixed(2)}**`).join('\n');
        const total = cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2);
        return text(`🛒 **Your Cart:**\n\n${lines}\n\n💰 **Total: $${total}**\n\nType **"place order"** to checkout or **"clear cart"** to start fresh.`);
    }

    function clearCartReply() {
        cart.length = 0;
        return text('🗑️ Your cart has been cleared. Start fresh by browsing our collection! 🌿');
    }

    function startOrder() {
        if (cart.length === 0) return text('🛒 Your cart is empty! Please add some products first.\n\nType **"show products"** to browse.');
        const total = cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2);
        orderState = { step: 'name', data: {} };
        return text(`Great! Let\'s place your order 🎉\n\n🛒 **Order Total: $${total}**\n\nFirst, what\'s your **full name**?`);
    }

    function handleOrderFlow(input) {
        const { step, data } = orderState;
        if (step === 'name') {
            if (input.trim().length < 2) return text('Please enter your full name to continue.');
            data.name = input.trim();
            orderState.step = 'email';
            return text(`Nice to meet you, **${data.name}**! 😊\n\nWhat\'s your **email address** so we can send your order confirmation?`);
        }
        if (step === 'email') {
            if (!input.includes('@')) return text('That doesn\'t look like a valid email. Please try again.');
            data.email = input.trim();
            orderState.step = 'address';
            return text('Got it! 📧\n\nNow, what\'s your **delivery address**? (Include city, state & PIN/ZIP)');
        }
        if (step === 'address') {
            if (input.trim().length < 10) return text('Please enter your full delivery address so we can ship correctly.');
            data.address = input.trim();
            orderState.step = 'confirm';
            const items = cart.map(c => `• ${c.name} × ${c.qty} — $${(c.price*c.qty).toFixed(2)}`).join('\n');
            const total = cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2);
            return text(`📋 **Order Summary:**\n\n${items}\n\n💰 **Total: $${total}**\n📦 **Ship to:** ${data.address}\n📧 **Email:** ${data.email}\n\nType **"confirm"** to place your order or **"cancel"** to go back.`);
        }
        if (step === 'confirm') {
            if (input.toLowerCase().includes('confirm')) {
                const orderId = 'HD' + Math.floor(10000 + Math.random() * 90000);
                cart.length = 0;
                orderState = null;
                return text(`✅ **Order Placed Successfully!**\n\n🎉 Thank you, **${data.name}**!\n📦 Order ID: **${orderId}**\n📧 Confirmation sent to **${data.email}**\n🚚 Estimated delivery: **3–5 business days**\n\nThank you for choosing Home Deco! 🌿💚`);
            }
            if (input.toLowerCase().includes('cancel')) {
                orderState = null;
                return text('Order cancelled. Your cart is still saved — type **"show cart"** to review it. 🛒');
            }
            return text('Please type **"confirm"** to place your order or **"cancel"** to go back.');
        }
    }

    function addToCart(productId) {
        const p = PRODUCTS.find(x => x.id === productId);
        if (!p) return;
        const existing = cart.find(c => c.id === productId);
        if (existing) { existing.qty++; }
        else { cart.push({ ...p, qty: 1 }); }
        const total = cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2);
        appendMessage('bot', text(`✅ **${p.name}** added to cart!\n\n🛒 Cart total: **$${total}**\n\nType **"show cart"** to review or **"place order"** to checkout.`));
    }

    // ── Intent resolver ──────────────────────────────────────────
    function resolve(input) {
        const lower = input.toLowerCase();
        for (const intent of INTENTS) {
            if (intent.keys.some(k => lower.includes(k))) return intent.fn();
        }
        return text(`I\'m not sure about that — but I\'m here to help! 🌿\n\nYou can ask me about:\n• **Products & pricing**\n• **Shipping & returns**\n• **Your cart & orders**\n\nOr try: *"show me your plants"*, *"what's best for my bedroom?"*`);
    }

    // ── DOM helpers ───────────────────────────────────────────────
    function getTime() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

    function fmt(t) {
        return t
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    function scrollBottom() {
        const el = document.getElementById('chatbot-messages');
        if (el) el.scrollTop = el.scrollHeight;
    }

    function appendMessage(role, content) {
        const msgs = document.getElementById('chatbot-messages');
        if (!msgs) return;
        const isBot = role === 'bot';
        const wrap = document.createElement('div');
        wrap.className = `chat-msg ${isBot ? 'bot-msg' : 'user-msg'}`;
        wrap.style.animation = 'msgSlide 0.35s cubic-bezier(0.34,1.56,0.64,1)';

        if (content.type === 'products') {
            const avatarHtml = isBot ? '<div class="msg-avatar">🌿</div>' : '';
            let inner = `${avatarHtml}<div style="display:flex;flex-direction:column;gap:8px;">
                <div class="msg-bubble"><p>${fmt(content.text)}</p></div>`;
            content.products.forEach(p => {
                inner += `<div class="chat-product-card">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <div class="chat-product-info">
                        <h5>${p.name}</h5>
                        <p class="chat-price">$${p.price}.00</p>
                        <div style="display:flex;gap:6px;">
                            <button class="chat-shop-btn chat-cart-btn" data-id="${p.id}" style="background:linear-gradient(135deg,#2E7D32,#1B5E20);">🛒 Add to Cart</button>
                            <button class="chat-shop-btn" onclick="window.location.href='${p.link}'" style="background:#E8F5E9;color:#2E7D32;">View</button>
                        </div>
                    </div>
                </div>`;
            });
            inner += `<div class="msg-time">${getTime()}</div></div>`;
            wrap.innerHTML = inner;
            // bind cart buttons after insert
            setTimeout(() => {
                wrap.querySelectorAll('.chat-cart-btn').forEach(btn => {
                    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
                });
            }, 0);
        } else {
            const avatarHtml = isBot ? '<div class="msg-avatar">🌿</div>' : '';
            wrap.innerHTML = `${avatarHtml}
                <div style="display:flex;flex-direction:column;">
                    <div class="msg-bubble"><p>${fmt(content.text)}</p></div>
                    <div class="msg-time">${getTime()}</div>
                </div>`;
        }

        msgs.appendChild(wrap);
        scrollBottom();
    }

    function showTyping() {
        const msgs = document.getElementById('chatbot-messages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'typing-indicator'; el.id = 'typing-indicator';
        el.innerHTML = `<div class="msg-avatar">🌿</div>
            <div class="typing-dots">
                <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
            </div>`;
        msgs.appendChild(el);
        scrollBottom();
    }
    function removeTyping() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

    function send(userText) {
        if (!userText || !userText.trim()) return;
        appendMessage('user', { type: 'text', text: userText.trim() });
        const input = document.getElementById('chatbot-input');
        if (input) input.value = '';
        showTyping();
        const delay = 600 + Math.random() * 600;
        setTimeout(() => {
            removeTyping();
            const response = orderState ? handleOrderFlow(userText) : resolve(userText);
            appendMessage('bot', response);
        }, delay);
    }

    // ── Build UI ──────────────────────────────────────────────────
    function build() {
        // Toggle button
        const btn = document.createElement('button');
        btn.id = 'chatbot-toggle';
        btn.setAttribute('aria-label', 'Open Chat');
        btn.innerHTML = `<span class="notif-badge"></span>
            <i class="fas fa-leaf toggle-icon show" id="toggle-open"></i>
            <i class="fas fa-times toggle-icon hide" id="toggle-close"></i>`;

        // Window
        const win = document.createElement('div');
        win.id = 'chatbot-window';
        win.setAttribute('role', 'dialog');
        win.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-avatar">🌿</div>
                <div class="chatbot-header-info">
                    <h4>Leaf — Home Deco</h4>
                    <span>🟢 Online · Replies instantly</span>
                </div>
                <div class="chatbot-header-actions">
                    <button class="header-action-btn" id="cb-minimize" title="Minimize"><i class="fas fa-minus"></i></button>
                    <button class="header-action-btn" id="cb-close" title="Close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="chatbot-suggestions">
                <button class="suggestion-chip" data-msg="Show me your products">🛍️ Products</button>
                <button class="suggestion-chip" data-msg="What is your best plant?">⭐ Best Pick</button>
                <button class="suggestion-chip" data-msg="What are your prices?">💰 Pricing</button>
                <button class="suggestion-chip" data-msg="Tell me about shipping">🚚 Shipping</button>
                <button class="suggestion-chip" data-msg="Show my cart">🛒 My Cart</button>
                <button class="suggestion-chip" data-msg="Place order">📦 Order</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages"></div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Ask me anything…" autocomplete="off" maxlength="300">
                <button id="chatbot-send-btn" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
            </div>
            <div class="chatbot-footer">Powered by <span>Home Deco</span> AI 🌱</div>`;

        document.body.appendChild(btn);
        document.body.appendChild(win);

        // Toggle open/close
        function openChat() {
            win.classList.add('open');
            document.getElementById('toggle-open').classList.replace('show','hide');
            document.getElementById('toggle-close').classList.replace('hide','show');
            const badge = btn.querySelector('.notif-badge');
            if (badge) badge.remove();
            if (document.getElementById('chatbot-messages').children.length === 0) {
                showTyping();
                setTimeout(() => { removeTyping(); appendMessage('bot', welcomeReply()); }, 800);
            }
        }
        function closeChat() {
            win.classList.remove('open');
            document.getElementById('toggle-open').classList.replace('hide','show');
            document.getElementById('toggle-close').classList.replace('show','hide');
        }

        btn.addEventListener('click', () => win.classList.contains('open') ? closeChat() : openChat());
        document.getElementById('cb-close').addEventListener('click', closeChat);
        document.getElementById('cb-minimize').addEventListener('click', closeChat);

        document.getElementById('chatbot-send-btn').addEventListener('click', () => send(document.getElementById('chatbot-input').value));
        document.getElementById('chatbot-input').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(document.getElementById('chatbot-input').value); } });

        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => { if (!win.classList.contains('open')) openChat(); send(chip.dataset.msg); });
        });
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', build); }
    else { build(); }
})();
