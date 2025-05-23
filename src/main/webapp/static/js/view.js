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
            tea: 'Чай',
            desserts: 'Десерты'
        };
        const categories = model.menu.categories.map(category => `
            <button class="category-btn ${category === 'all' ? 'active' : ''}" data-category="${category}">
                ${categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        `).join('');
        const items = model.menu.items.map(item => {
            const productKey = Object.keys(model.drinkKeyMapping).find(key => model.drinkNames[model.drinkKeyMapping[key]] === item.name) || item.name;
            return `
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
                                    data-product="${productKey}"
                                    data-size="${size.volume}"
                                    data-name="${item.name}"
                                    data-price="${parseInt(size.price)}"
                                >В корзину</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        }).join('');
        menu.innerHTML = `
            <h2>Меню</h2>
            <div class="menu-categories">${categories}</div>
            <div class="menu-grid">${items}</div>
        `;
        viewModel.initAddToCartListeners();
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
                        <p class="card-subtitle">${getCardSubtitle(card)}</p>
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
        const cart = shoppingModel.getCart();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderSection.innerHTML = `
            <h2>Оформить заказ</h2>
            ${currentUser ? `
                <p>Добро пожаловать, ${currentUser}! Выберите филиал и стол для вашего заказа.</p>
                <form id="order-form">
                    <div class="form-group">
                        <label for="branch">Филиал:</label>
                        <select id="branch" required>
                            <option value="">Выберите филиал</option>
                            ${model.branches.map(branch => `<option value="${branch.id}">${branch.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="table">Стол:</label>
                        <select id="table" required>
                            <option value="">Выберите стол</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <h3>Ваш заказ</h3>
                        ${cart.length > 0 ? `
                            <ul class="order-items">
                                ${cart.map(item => `
                                    <li>
                                        ${item.name} (${item.size}) x${item.quantity} - ${item.price * item.quantity} ₽
                                    </li>
                                `).join('')}
                            </ul>
                            <p><strong>Итого:</strong> ${total} ₽</p>
                        ` : '<p>Корзина пуста. Добавьте товары из меню.</p>'}
                    </div>
                    <button type="submit" class="modal-button" ${cart.length === 0 ? 'disabled' : ''}>Оформить заказ</button>
                </form>
            ` : `
                <p>Пожалуйста, войдите или зарегистрируйтесь, чтобы оформить заказ.</p>
                <button id="open-login-from-order" class="modal-button">Войти</button>
            `}
        `;
        if (currentUser) {
            const branchSelect = orderSection.querySelector('#branch');
            if (branchSelect) {
                branchSelect.addEventListener('change', () => {
                    const branchId = branchSelect.value;
                    viewModel.updateTableOptions(branchId);
                });
            }
        }
        const openLoginBtn = orderSection.querySelector('#open-login-from-order');
        if (openLoginBtn) {
            openLoginBtn.addEventListener('click', () => {
                document.getElementById('login-modal').style.display = 'block';
            });
        }
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
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) {
            console.error('Элемент .auth-buttons не найден');
            return;
        }
        const cart = shoppingModel.getCart();
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const currentUser = localStorage.getItem('currentUser');
        authButtons.innerHTML = `
            ${currentUser ? `
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
                <span class="user-greeting">Привет, ${currentUser}!</span>
                <button id="logout-btn" class="modal-button icon-btn" title="Выйти">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            ` : `
                <a href="#" class="login-link" title="Вход" id="login-btn">
                    <i class="fas fa-sign-in-alt"></i>
                </a>
                <a href="#" class="register-link" title="Регистрация" id="register-btn">
                    <i class="fas fa-user-plus"></i>
                </a>
            `}
        `;
    },
    renderLoginModal() {
        let loginModal = document.getElementById('login-modal');
        if (!loginModal) {
            loginModal = document.createElement('div');
            loginModal.id = 'login-modal';
            loginModal.className = 'modal';
            document.body.appendChild(loginModal);
        }
        loginModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Вход в ProBarista</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-username">Имя пользователя</label>
                        <input type="text" id="login-username" placeholder="Введите имя" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Пароль</label>
                        <input type="password" id="login-password" placeholder="Введите пароль" required>
                    </div>
                    <button type="submit" class="modal-button">Войти</button>
                </form>
                <p class="modal-footer">Нет аккаунта? <a href="#" id="switch-to-register">Зарегистрируйтесь</a></p>
            </div>
        `;
        const switchToRegister = loginModal.querySelector('#switch-to-register');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'none';
                document.getElementById('register-modal').style.display = 'block';
            });
        }
    },
    renderRegisterModal() {
        let registerModal = document.getElementById('register-modal');
        if (!registerModal) {
            registerModal = document.createElement('div');
            registerModal.id = 'register-modal';
            registerModal.className = 'modal';
            document.body.appendChild(registerModal);
        }
        registerModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Регистрация</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label for="register-username">Имя пользователя</label>
                        <input type="text" id="register-username" placeholder="Введите имя" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input type="email" id="register-email" placeholder="Введите email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Пароль</label>
                        <input type="password" id="register-password" placeholder="Введите пароль" required>
                    </div>
                    <button type="submit" class="modal-button">Зарегистрироваться</button>
                </form>
                <p class="modal-footer">Уже есть аккаунт? <a href="#" id="switch-to-login">Войдите</a></p>
            </div>
        `;
        const switchToLogin = registerModal.querySelector('#switch-to-login');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                registerModal.style.display = 'none';
                document.getElementById('login-modal').style.display = 'block';
            });
        }
    },
    renderCartModal() {
        let cartModal = document.getElementById('cart-modal');
        if (!cartModal) {
            cartModal = document.createElement('div');
            cartModal.id = 'cart-modal';
            cartModal.className = 'modal';
            document.body.appendChild(cartModal);
        }
        const cart = shoppingModel.getCart();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Ваша корзина</h2>
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
                ${cart.length > 0 ? `
                    <form id="cart-order-form">
                        <div class="form-group">
                            <label for="cart-branch">Филиал:</label>
                            <select id="cart-branch" required>
                                <option value="">Выберите филиал</option>
                                ${model.branches.map(branch => `<option value="${branch.id}">${branch.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cart-table">Стол:</label>
                            <select id="cart-table" required>
                                <option value="">Выберите стол</option>
                            </select>
                        </div>
                        <button type="submit" class="modal-button" id="place-order-btn">Оформить заказ</button>
                        <button type="button" class="modal-button secondary" id="clear-cart-btn">Очистить корзину</button>
                    </form>
                ` : ''}
            </div>
        `;
        if (cart.length > 0) {
            const branchSelect = cartModal.querySelector('#cart-branch');
            if (branchSelect) {
                branchSelect.addEventListener('change', () => {
                    const branchId = branchSelect.value;
                    viewModel.updateCartTableOptions(branchId);
                });
            }
            const clearCartBtn = cartModal.querySelector('#clear-cart-btn');
            if (clearCartBtn) {
                clearCartBtn.addEventListener('click', () => {
                    shoppingModel.clearCart();
                    this.renderCartModal();
                    this.renderShoppingButton();
                    alert('Корзина очищена');
                });
            }
        }
    },
    renderProfileModal() {
        let profileModal = document.getElementById('profile-modal');
        if (!profileModal) {
            profileModal = document.createElement('div');
            profileModal.id = 'profile-modal';
            profileModal.className = 'modal';
            document.body.appendChild(profileModal);
        }
        const currentUser = localStorage.getItem('currentUser');
        profileModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Личный кабинет</h2>
                ${currentUser ? `
                    <p><strong>Имя:</strong> ${currentUser}</p>
                    <p><strong>Email:</strong> ${localStorage.getItem('userEmail') || 'Не указан'}</p>
                    <h3>История заказов</h3>
                    <div id="order-history"></div>
                ` : `
                    <p>Пожалуйста, войдите в аккаунт</p>
                    <button id="open-login-from-profile" class="modal-button">Войти</button>
                `}
            </div>
        `;
        if (currentUser) {
            viewModel.loadOrderHistory();
        }
        const openLoginBtn = profileModal.querySelector('#open-login-from-profile');
        if (openLoginBtn) {
            openLoginBtn.addEventListener('click', () => {
                profileModal.style.display = 'none';
                document.getElementById('login-modal').style.display = 'block';
            });
        }
    },
    updateTableOptions(tables) {
        const tableSelect = document.getElementById('table');
        if (!tableSelect) return;
        tableSelect.innerHTML = `
            <option value="">Выберите стол</option>
            ${tables.map(table => `<option value="${table.id}">${table.number}</option>`).join('')}
        `;
    },
    updateCartTableOptions(tables) {
        const tableSelect = document.getElementById('cart-table');
        if (!tableSelect) return;
        tableSelect.innerHTML = `
            <option value="">Выберите стол</option>
            ${tables.map(table => `<option value="${table.id}">${table.number}</option>`).join('')}
        `;
    },
    updateOrderHistory(orders) {
        const orderHistory = document.getElementById('order-history');
        if (!orderHistory) return;
        orderHistory.innerHTML = orders.length > 0 ? `
            <ul>
                ${orders.map(order => `
                    <li>
                        Заказ #${order.id} (${new Date(order.timestamp).toLocaleString()})<br>
                        ${order.items.map(item => `${item.name} (${item.size}) x${item.quantity}`).join(', ')}<br>
                        Итого: ${order.total} ₽<br>
                        Статус: ${order.status}
                    </li>
                `).join('')}
            </ul>
        ` : '<p>Нет предыдущих заказов</p>';
    }
};