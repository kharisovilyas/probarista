const viewModel = {
    init() {
        view.renderNav();
        view.renderHero();
        view.renderMenu();
        view.renderAbout();
        view.renderLoyalty();
        view.renderCalculator();
        view.renderOrderSection();
        view.renderContacts();
        view.renderShoppingButton();
        view.renderFooter();
        view.renderLoginModal();
        view.renderRegisterModal();
        view.renderCartModal();
        view.renderProfileModal();
        view.renderQRModal();
        this.initEventListeners();
        this.initMap();
        this.initAuthModals();
        this.initAuthForms();
        this.initOrderForm();
        this.updateAuthUI();
        this.initMenuCategories();
    },
    initEventListeners() {
        const calcForm = document.getElementById('calc-form');
        if (calcForm) {
            calcForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Форма калькулятора отправлена');
                this.calculateKBJU();
            });
        }
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const product = button.dataset.product;
                const size = button.dataset.size;
                const name = button.dataset.name;
                const price = parseInt(button.dataset.price);
                shoppingModel.addToCart(product, size, name, price);
                view.renderShoppingButton();
                alert(`${name} (${size}) добавлен в корзину!`);
            });
        });
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const cartModal = document.getElementById('cart-modal');
                if (cartModal) {
                    cartModal.style.display = 'block';
                }
            });
        }
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const profileModal = document.getElementById('profile-modal');
                if (profileModal) {
                    profileModal.style.display = 'block';
                }
            });
        }
        const qrBtn = document.getElementById('qr-btn');
        if (qrBtn) {
            qrBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const qrModal = document.getElementById('qr-modal');
                if (qrModal) {
                    qrModal.style.display = 'block';
                }
            });
        }
        const placeOrderBtn = document.getElementById('place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                const currentUser = localStorage.getItem('currentUser');
                if (!currentUser) {
                    const loginModal = document.getElementById('login-modal');
                    if (loginModal) {
                        loginModal.style.display = 'block';
                    }
                } else {
                    this.placeCartOrder();
                }
            });
        }
        this.initMenuCategories();
        window.addEventListener('scroll', this.handleScroll);
    },
    calculateKBJU() {
        const drinkKey = document.getElementById('drink').value;
        const size = document.getElementById('size').value;
        const kbjuKey = model.drinkKeyMapping[drinkKey] || drinkKey;
        console.log('Drink:', drinkKey, 'Mapped to:', kbjuKey, 'Size:', size);
        const resultCard = document.querySelector('.calc-result');
        if (!resultCard) {
            console.error('Элемент .calc-result не найден');
            return;
        }
        if (!drinkKey || !size || !model.kbju[kbjuKey] || !model.kbju[kbjuKey][size]) {
            console.warn('КБЖУ недоступно для:', kbjuKey, size);
            resultCard.innerHTML = '<p style="color: red; text-align: center;">КБЖУ для этого напитка или размера недоступно</p>';
            view.updateKBJU({ calories: 0, proteins: 0, fats: 0, carbs: 0 });
            return;
        }
        resultCard.innerHTML = `
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
        `;
        console.log('KBJU data:', model.kbju[kbjuKey][size]);
        view.updateKBJU(model.kbju[kbjuKey][size]);
    },
    initMenuCategories() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const menuCards = document.querySelectorAll('.menu-card');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.dataset.category;
                menuCards.forEach(card => {
                    card.style.display = category === 'all' || card.dataset.category === category ? 'block' : 'none';
                });
            });
        });
    },
    initMap() {
        if (typeof ymaps !== 'undefined') {
            ymaps.ready(() => {
                const map = new ymaps.Map('map', {
                    center: [59.9386, 30.3141],
                    zoom: 11
                });
                model.branches.forEach(branch => {
                    const marker = new ymaps.Placemark(branch.coordinates, {
                        balloonContent: `<strong>${branch.name}</strong><br>${branch.address}`
                    }, {
                        preset: 'islands#greenCoffeeIcon'
                    });
                    map.geoObjects.add(marker);
                });
            });
        }
    },
    handleScroll() {
        const header = document.querySelector('.header-fixed');
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    },
    initAuthModals() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const cartModal = document.getElementById('cart-modal');
        const profileModal = document.getElementById('profile-modal');
        const qrModal = document.getElementById('qr-modal');
        const closeBtns = document.querySelectorAll('.modal .close');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                loginModal.style.display = 'block';
            });
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                registerModal.style.display = 'block';
            });
        }
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.style.display = 'none';
                registerModal.style.display = 'none';
                if (cartModal) cartModal.style.display = 'none';
                if (profileModal) profileModal.style.display = 'none';
                if (qrModal) qrModal.style.display = 'none';
            });
        });
        window.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
            if (event.target === registerModal) {
                registerModal.style.display = 'none';
            }
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
            if (event.target === profileModal) {
                profileModal.style.display = 'none';
            }
            if (event.target === qrModal) {
                qrModal.style.display = 'none';
            }
        });
    },
    initAuthForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const email = document.getElementById('register-email').value;
                this.registerUser(username, password, email);
            });
        }
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                this.loginUser(username, password);
            });
        }
    },
    initOrderForm() {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const branch = document.getElementById('branch').value;
                const item = document.getElementById('order-items').value;
                this.placeOrder(branch, item);
            });
        }
    },
    registerUser(username, password, email) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(user => user.username === username)) {
            alert('Пользователь с таким именем уже существует');
            return;
        }
        users.push({ username, password, email });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Регистрация успешна');
        document.getElementById('register-modal').style.display = 'none';
        localStorage.setItem('currentUser', username);
        this.updateAuthUI();
        // Открываем корзину после регистрации, если она была открыта
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && cartModal.style.display === 'block') {
            this.placeCartOrder();
        }
    },
    loginUser(username, password) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            alert('Вход успешен');
            document.getElementById('login-modal').style.display = 'none';
            localStorage.setItem('currentUser', username);
            this.updateAuthUI();
            // Открываем корзину после входа, если она была открыта
            const cartModal = document.getElementById('cart-modal');
            if (cartModal && cartModal.style.display === 'block') {
                this.placeCartOrder();
            }
        } else {
            alert('Неверное имя пользователя или пароль');
        }
    },
    placeOrder(branch, item) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({ user: localStorage.getItem('currentUser'), branch, item, timestamp: new Date().toISOString() });
        localStorage.setItem('orders', JSON.stringify(orders));
        alert(`Заказ (${item}) успешно оформлен в филиале ${model.branches.find(b => b.id === branch).name}`);
    },
    placeCartOrder() {
        const cart = shoppingModel.getCart();
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        const currentUser = localStorage.getItem('currentUser');
        const branch = model.branches[0].id; // Используем первый филиал для простоты
        const orderId = `ord${Date.now()}`;
        const items = cart.map(item => ({
            name: item.name,
            size: item.size,
            price: `${item.price} ₽`,
            quantity: item.quantity
        }));
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = {
            orderId,
            branchId: branch,
            items,
            total: `${total} ₽`,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        let users = model.users;
        const userIndex = users.findIndex(u => u.name === currentUser);
        if (userIndex !== -1) {
            users[userIndex].prevOrders.push(order);
            users[userIndex].loyaltyPoints += Math.floor(total / 10); // 1 балл за каждые 10 ₽
        }
        localStorage.setItem('cart', '[]'); // Очищаем корзину
        view.renderShoppingButton();
        document.getElementById('cart-modal').style.display = 'none';
        alert(`Заказ #${orderId} успешно оформлен!`);
    },
    updateAuthUI() {
        const currentUser = localStorage.getItem('currentUser');
        const authButtons = document.querySelector('.auth-buttons');
        const orderSection = document.getElementById('order');
        const header = document.querySelector('.header-fixed');
        const cart = shoppingModel.getCart();
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (authButtons) {
            authButtons.innerHTML = `
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
        }

        if (currentUser) {
            authButtons.innerHTML = `
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
                <button id="logout-btn" class="modal-button">Выйти</button>
            `;
            if (orderSection) {
                orderSection.style.display = 'block';
            }
            if (header) {
                const orderLink = header.querySelector('.auth-buttons a[href="#order"]');
                if (orderLink) {
                    orderLink.style.display = 'inline-block';
                }
            }
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    this.updateAuthUI();
                });
            }
        } else {
            if (orderSection) {
                orderSection.style.display = 'none';
            }
            this.initAuthModals();
        }

        // Переинициализируем обработчики для новых кнопок
        this.initEventListeners();
    }
};