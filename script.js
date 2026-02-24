document.addEventListener('DOMContentLoaded', function () {
    // Валидация Telegram
    const telegramInput = document.getElementById('telegram');
    const telegramError = document.getElementById('telegramError');
    const cartTelegram = document.getElementById('cartTelegram');
    const cartTelegramError = document.getElementById('cartTelegramError');

    [telegramInput, cartTelegram].forEach(el => {
        if (el) {
            el.addEventListener('input', () => {
                if (el.value.trim()) {
                    (el.id === 'telegram' ? telegramError : cartTelegramError).textContent = '';
                    el.style.borderColor = '#28a745';
                } else {
                    el.style.borderColor = '#e8e8f0';
                }
            });
        }
    });

    // Корзина
    const productName = 'Готовые аккаунты мессенджера MAX';
    const productPrice = 2500;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const addToCartBtn = document.getElementById('addToCart');
    const addQuantitySelect = document.getElementById('addQuantity');
    const cartButton = document.getElementById('cartButton');
    const cartCount = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const clearCartBtn = document.getElementById('clearCart');
    const cartForm = document.getElementById('cartForm');

    const BOT_TOKEN = '8522855932:AAFADa6eKmYKUOUyiSZevRrGh26IsnEC_4o';
    const CHAT_ID = '7975505098';

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        cartItems.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${item.price * item.quantity} ₽</span>
                <button class="remove-item" data-index="${index}">Удалить</button>
            `;
            cartItems.appendChild(div);
            totalPrice += item.price * item.quantity;
        });

        cartTotalPrice.textContent = `${totalPrice} ₽`;

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    addToCartBtn.addEventListener('click', () => {
        const qty = parseInt(addQuantitySelect.value) || 1;
        const existing = cart.find(i => i.name === productName);
        if (existing) existing.quantity += qty;
        else cart.push({ name: productName, price: productPrice, quantity: qty });
        updateCart();
        cartModal.classList.add('active');
    });

    cartButton.addEventListener('click', () => cartModal.classList.add('active'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    window.addEventListener('click', e => { if (e.target === cartModal) cartModal.classList.remove('active'); });

    cartForm.addEventListener('submit', async e => {
        e.preventDefault();
        const tg = document.getElementById('cartTelegram').value.trim();
        if (!tg) {
            document.getElementById('cartTelegramError').textContent = 'Введите Telegram';
            return;
        }
        if (!cart.length) {
            alert('Корзина пуста!');
            return;
        }

        const qty = cart.reduce((s, i) => s + i.quantity, 0);
        const price = cart.reduce((s, i) => s + i.price * i.quantity, 0);

        const msg = `🛒 Новая заявка!\n\nTelegram: ${tg}\nКоличество: ${qty}\nИтого: ${price} ₽`;

        try {
            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
            });
            if (res.ok) {
                alert('Заявка отправлена!');
                cart = [];
                updateCart();
                cartModal.classList.remove('active');
            } else alert('Ошибка отправки');
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });

    // Нижняя форма
    document.getElementById('orderForm').addEventListener('submit', e => {
        e.preventDefault();
        const tg = document.getElementById('telegram').value.trim();
        if (!tg) {
            document.getElementById('telegramError').textContent = 'Введите Telegram';
            return;
        }

        const qty = parseInt(document.getElementById('quantity').value) || 1;
        const comment = document.getElementById('comment').value;

        const existing = cart.find(i => i.name === productName);
        if (existing) existing.quantity += qty;
        else cart.push({ name: productName, price: productPrice, quantity: qty });

        updateCart();
        e.target.reset();
        cartModal.classList.add('active');
    });

    updateCartDisplay();

    // FAQ аккордеон
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            document.querySelectorAll('.faq-item.active').forEach(i => i !== item && i.classList.remove('active'));
            item.classList.toggle('active');
        });
    });

    // Анимация скролла
    const animateEls = document.querySelectorAll('.animate-on-scroll');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
    }, { threshold: 0.1 });

    animateEls.forEach(el => obs.observe(el));
});