function getCardSubtitle(card) {
    return card.subtitle || 'Подробности о карте';
}

const view = {
    renderNav() {
        const nav = document.getElementById('nav');
        if (!nav) {
            console.error('Элемент #nav не найден');
            return;
        }
        nav.innerHTML = model.navLinks.map(link => `<a href="${link.href}">${link.text}</a>`).join('');
    },
    renderHero() {
        const heroContent = document.getElementById('hero-content');
        if (!heroContent) {
            console.error('Элемент #hero-content не найден');
            return;
        }
        heroContent.innerHTML = `
            <h1 class="handwritten-title">${model.hero.title}</h1>
            <p class="handwritten-text">${model.hero.description}</p>
            <a href="${model.hero.ctaHref}" class="cta-button">${model.hero.ctaText}</a>
        `;
    },
    renderMenu() {
        const menu = document.getElementById('menu');
        if (!menu) {
            console.error('Элемент #menu не найден');
            return;
        }
        const categoryLabels = {
            all: 'Все',
            coffee: 'Кофе',
            'author-drinks': 'Авторские напитки',
            lemonades: 'Лимонады',
            juices: 'Соки',
            milkshakes: 'Молочные коктейли',
            protein: 'Протеиновые коктейли',
            iced: 'Холодные напитки',
            tea: 'Чай',
            additives: 'Добавки'
        };
        const categories = model.menu.categories.map(category => `
            <button class="category-btn ${category === 'all' ? 'active' : ''}" data-category="${category}">
                ${categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        `).join('');
        const items = model.menu.items.map(item => `
            <div class="menu-card" data-category="${item.category}">
                <div class="menu-card-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="menu-card-content">
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p>
                    <ul class="sizes">
                        ${item.sizes.map(size => `
                            <li>
                                <span>${size.volume}</span>
                                <span>${size.price}</span>
                                <button
                                    class="add-to-cart-btn"
                                    data-product="${item.key || item.name}"
                                    data-size="${size.key || size.volume}"
                                    data-name="${item.name}"
                                    data-price="${parseInt(size.price)}"
                                >В корзину</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
        menu.innerHTML = `
            <h2>Меню</h2>
            <div class="menu-categories">${categories}</div>
            <div class="menu-grid">${items}</div>
        `;
    },
    renderAbout() {
        const about = document.getElementById('about');
        if (!about) {
            console.error('Элемент #about не найден');
            return;
        }
        about.innerHTML = `
            <h2>О нас</h2>
            <p>${model.about.description}</p>
            <div class="about-features">
                ${model.about.features.map(feature => `
                    <div class="feature">
                        <i class="${feature.icon}"></i>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },
    renderLoyalty() {
        const loyalty = document.getElementById('loyalty');
        if (!loyalty) {
            console.error('Элемент #loyalty не найден');
            return;
        }
        loyalty.innerHTML = `
            <h2>Система лояльности</h2>
            <div class="loyalty-cards">
                ${model.loyaltyCards.map(card => `
                    <div class="loyalty-card">
                        <i class="${card.icon} loyalty-icon"></i>
                        <h3>${card.title}</h3>
                        <p class="card-subtitle">${card.subtitle}</p>
                        <p>${card.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },
    renderCalculator() {
        const calculator = document.getElementById('calculator');
        if (!calculator) {
            console.error('Элемент #calculator не найден');
            return;
        }
        calculator.innerHTML = `
            <h2>Калькулятор КБЖУ</h2>
            <form id="calc-form">
                <div class="form-group">
                    <label for="drink">Выберите напиток:</label>
                    <select id="drink">
                        ${Object.keys(model.drinkNames).map(key => `<option value="${key}">${model.drinkNames[key]}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="size">Размер:</label>
                    <select id="size"></select>
                </div>
                <button type="submit" class="calc-button">Рассчитать</button>
            </form>
            <div class="calc-result">
                <div class="result-card">
                    <div class="result-item">
                        <span class="result-label">Калории</span>
                        <span class="result-value" id="calories">0</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Белки</span>
                        <span class="result-value" id="proteins">0</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Жиры</span>
                        <span class="result-value" id="fats">0</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Углеводы</span>
                        <span class="result-value" id="carbs">0</span>
                    </div>
                </div>
            </div>
        `;
        this.updateSizeOptions();
    },
    updateSizeOptions() {
        const drinkSelect = document.getElementById('drink');
        const sizeSelect = document.getElementById('size');
        if (!drinkSelect || !sizeSelect) {
            console.error('Элементы #drink или #size не найдены');
            return;
        }
        const sizeLabels = {
            small: 'Маленький',
            medium: 'Средний',
            large: 'Большой',
            xlarge: 'Очень большой',
            single: 'Одна порция'
        };
        const updateSizes = () => {
            const drinkKey = drinkSelect.value;
            const kbjuKey = model.drinkKeyMapping[drinkKey] || drinkKey;
            const availableSizes = model.kbju[kbjuKey] ? Object.keys(model.kbju[kbjuKey]) : [];
            if (availableSizes.length === 0) {
                sizeSelect.innerHTML = '<option value="">Размеры недоступны</option>';
                sizeSelect.disabled = true;
                return;
            }
            sizeSelect.disabled = false;
            sizeSelect.innerHTML = availableSizes.map(size => {
                const label = sizeLabels[size] || size;
                return `<option value="${size}">${label}</option>`;
            }).join('');
            sizeSelect.value = availableSizes[0];
        };
        updateSizes();
        drinkSelect.addEventListener('change', updateSizes);
    },
    renderOrderSection() {
        const orderSection = document.getElementById('order');
        if (!orderSection) {
            console.error('Элемент #order не найден');
            return;
        }
        const currentUser = localStorage.getItem('currentUser');
        orderSection.style.display = currentUser ? 'block' : 'none';
        orderSection.innerHTML = `
            <h2>Ваш заказ</h2>
            <p>Добро пожаловать, ${currentUser || 'гость'}! Здесь вы сможете оформить заказ, выбрав любимые напитки и филиал.</p>
            <p>Функционал заказа находится в разработке. Скоро вы сможете добавлять напитки в корзину и оформлять заказ!</p>
        `;
    },
    renderContacts() {
        const contacts = document.getElementById('contacts');
        if (!contacts) {
            console.error('Элемент #contacts не найден');
            return;
        }
        contacts.innerHTML = `
            <h2>Контакты</h2>
            <div class="contacts-container">
                <div class="contacts-info">
                    <div class="contact-card">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Адреса</h3>
                        ${model.contacts.addresses.map(address => `<p>${address}</p>`).join('')}
                    </div>
                    <div class="contact-card">
                        <i class="fas fa-phone"></i>
                        <h3>Телефон</h3>
                        <p>${model.contacts.phone}</p>
                    </div>
                    <div class="contact-card">
                        <i class="fas fa-envelope"></i>
                        <h3>Email</h3>
                        <p>${model.contacts.email}</p>
                    </div>
                    <div class="contact-card">
                        <i class="fas fa-clock"></i>
                        <h3>Режим работы</h3>
                        ${model.contacts.hours.map(hour => `<p>${hour}</p>`).join('')}
                    </div>
                </div>
                <div class="map" id="map"></div>
            </div>
        `;
    },
    renderFooter() {
        const footer = document.getElementById('footer');
        if (!footer) {
            console.error('Элемент #footer не найден');
            return;
        }
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${model.footer.brand}</h3>
                    <p>${model.footer.tagline}</p>
                </div>
                <div class="footer-section">
                    <h3>Социальные сети</h3>
                    <div class="social-links">
                        ${model.footer.socialLinks.map(link => `<a href="${link.href}" class="fab fa-${link.platform}"></a>`).join('')}
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Подписка на новости</h3>
                    <div class="newsletter-form">
                        <input type="email" placeholder="Ваш email">
                        <button>Подписаться</button>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>${model.footer.copyright}</p>
            </div>
        `;
    },
    updateKBJU(data) {
        const elements = {
            calories: document.getElementById('calories'),
            proteins: document.getElementById('proteins'),
            fats: document.getElementById('fats'),
            carbs: document.getElementById('carbs')
        };
        const resultCard = document.querySelector('.calc-result');
        if (!resultCard || Object.values(elements).some(el => !el)) {
            console.error('Не найдены элементы для обновления КБЖУ или .calc-result');
            return;
        }
        elements.calories.textContent = data.calories || 0;
        elements.proteins.textContent = data.proteins || 0;
        elements.fats.textContent = data.fats || 0;
        elements.carbs.textContent = data.carbs || 0;
    },
    renderShoppingButton() {
        const shoppingButton = document.querySelector('.shopping-button');
        if (!shoppingButton) {
            console.error('Элемент .shopping-button не найден');
            return;
        }
        const cart = shoppingModel.getCart ? shoppingModel.getCart() : [];
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        shoppingButton.innerHTML = `
            <a href="#" class="cart-link" title="Корзина" id="cart-btn">
                <i class="fas fa-shopping-cart cart-icon"></i>
                ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''}
            </a>
            <a href="#" class="profile-link" title="Личный кабинет" id="profile-btn">
                <i class="fas fa-user"></i>
            </a>
            <a href="#" class="qr-link" title="QR-код" id="qr-btn">
                <i class="fas fa-qrcode"></i>
            </a>
        `;
    },
    renderLoginModal() {
        const loginModal = document.createElement('div');
        loginModal.id = 'login-modal';
        loginModal.className = 'modal';
        loginModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title">Вход</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-username">Имя пользователя</label>
                        <input type="text" id="login-username" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Пароль</label>
                        <input type="password" id="login-password" required>
                    </div>
                    <button type="submit" class="modal-button">Войти</button>
                </form>
            </div>
        `;
        document.body.appendChild(loginModal);
    },
    renderRegisterModal() {
        const registerModal = document.createElement('div');
        registerModal.id = 'register-modal';
        registerModal.className = 'modal';
        registerModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title">Регистрация</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label for="register-username">Имя пользователя</label>
                        <input type="text" id="register-username" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input type="email" id="register-email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Пароль</label>
                        <input type="password" id="register-password" required>
                    </div>
                    <button type="submit" class="modal-button">Зарегистрироваться</button>
                </form>
            </div>
        `;
        document.body.appendChild(registerModal);
    },
    renderCartModal() {
        const cartModal = document.createElement('div');
        cartModal.id = 'cart-modal';
        cartModal.className = 'modal';
        const cart = shoppingModel.getCart();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title">Корзина</h2>
                <div class="cart-items">
                    ${cart.length > 0 ? cart.map(item => `
                        <div class="cart-item">
                            <span>${item.name} (${item.size})</span>
                            <span>${item.quantity} x ${item.price} ₽ = ${item.quantity * item.price} ₽</span>
                        </div>
                    `).join('') : '<p>Корзина пуста</p>'}
                </div>
                <div class="cart-total">
                    <strong>Итого: ${total} ₽</strong>
                </div>
                <button id="place-order-btn" class="modal-button">Заказать</button>
            </div>
        `;
        document.body.appendChild(cartModal);
    },
    renderProfileModal() {
        const profileModal = document.createElement('div');
        profileModal.id = 'profile-modal';
        profileModal.className = 'modal';
        const currentUser = localStorage.getItem('currentUser');
        let userData = {};
        if (currentUser) {
            const user = model.users.find(u => u.name === currentUser);
            if (user) userData = user;
        }
        profileModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title">Личный кабинет</h2>
                ${currentUser ? `
                    <p><strong>Имя:</strong> ${userData.name || currentUser}</p>
                    <p><strong>Email:</strong> ${userData.email || 'Не указан'}</p>
                    <p><strong>Баллы лояльности:</strong> ${userData.loyaltyPoints || 0}</p>
                    <h3>История заказов</h3>
                    ${userData.prevOrders && userData.prevOrders.length > 0 ? `
                        <ul>
                            ${userData.prevOrders.map(order => `
                                <li>
                                    Заказ #${order.orderId} (${order.timestamp})<br>
                                    ${order.items.map(item => `${item.name} (${item.size}) x${item.quantity}`).join(', ')}<br>
                                    Итого: ${order.total}<br>
                                    Статус: ${order.status}
                                </li>
                            `).join('')}
                        </ul>
                    ` : '<p>Нет предыдущих заказов</p>'}
                ` : '<p>Пожалуйста, войдите в аккаунт</p>'}
            </div>
        `;
        document.body.appendChild(profileModal);
    },
    renderQRModal() {
        const qrModal = document.createElement('div');
        qrModal.id = 'qr-modal';
        qrModal.className = 'modal';
        qrModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title">QR-код</h2>
                <p>Сканируйте QR-код для получения скидки!</p>
                <div class="qr-placeholder">
                    <p>[Здесь будет QR-код]</p>
                </div>
            </div>
        `;
        document.body.appendChild(qrModal);
    }
};