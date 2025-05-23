const viewModel = {
    async init() {
        view.renderNav();
        view.renderHero();
        view.renderMenu();
        view.renderAbout();
        view.renderLoyalty();
        view.renderCalculator();
        view.renderOrderSection();
        view.renderContacts();
        view.renderFooter();
        view.renderShoppingButton();
        view.renderLoginModal();
        view.renderRegisterModal();
        view.renderCartModal();
        view.renderProfileModal();
        this.renderQRModal();
        await model.fetchBranches();
        view.renderOrderSection();
        this.initEventListeners();
        this.initMap();
        this.initAuthModals();
        this.initAuthForms();
        this.initOrderForms();
        this.updateAuthUI();
    },
    initEventListeners() {
        const calcForm = document.getElementById('calc-form');
        if (calcForm) {
            calcForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateKBJU();
            });
        }
        this.initAddToCartListeners();
        this.initMenuCategories();
        window.addEventListener('scroll', this.handleScroll);
    },
    renderQRModal() {
        console.log('Инициализация renderQRModal');
        let qrModal = document.getElementById('qr-modal');
        if (!qrModal) {
            qrModal = document.createElement('div');
            qrModal.id = 'qr-modal';
            qrModal.className = 'modal';
            document.body.appendChild(qrModal);
            console.log('Модальное окно #qr-modal создано');
        }
        qrModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Ваш QR-код</h2>
                <div id="qr-code" class="qr-placeholder"><img id="qr-image" src="" alt="QR-код" style="display: none;"></div>
            </div>
        `;
        // Задаём фиксированный текст для QR-кода
        const qrText = 'https://probarista.example.com'; // Замените на нужный URL или текст
        const qrImage = qrModal.querySelector('#qr-image');

        // Генерация QR-кода сразу при открытии
        (async () => {
            try {
                console.log('Отправка запроса на сервер для генерации QR-кода:', qrText);
                const response = await fetch(`/generate-qr?text=${encodeURIComponent(qrText)}`);
                if (!response.ok) {
                    throw new Error('Ошибка сервера: ' + response.status);
                }
                const blob = await response.blob();
                qrImage.src = URL.createObjectURL(blob);
                qrImage.style.display = 'block';
                console.log('QR-код успешно получен и отображён');
            } catch (error) {
                console.error('Ошибка генерации QR-кода:', error);
                alert('Произошла ошибка при генерации QR-кода: ' + error.message);
            }
        })();

        const closeBtn = qrModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                qrModal.style.display = 'none';
                console.log('Модальное окно закрыто');
            });
        }
    },
    initModalListeners() {
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                view.renderCartModal();
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
                view.renderProfileModal();
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
                this.renderQRModal();
                const qrModal = document.getElementById('qr-modal');
                if (qrModal) {
                    qrModal.style.display = 'block';
                }
            });
        }
    },
    initAddToCartListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.addEventListener('click', () => {
                const product = newButton.dataset.product;
                const size = newButton.dataset.size;
                const name = newButton.dataset.name;
                const price = parseInt(newButton.dataset.price);
                shoppingModel.addToCart(product, size, name, price);
                view.renderShoppingButton();
                view.renderCartModal();
                alert(`${name} (${size}) добавлен в корзину!`);
            });
        });
    },
    calculateKBJU() {
        const drinkKey = document.getElementById('drink').value;
        const size = document.getElementById('size').value;
        const kbjuKey = model.drinkKeyMapping[drinkKey] || drinkKey;
        const resultCard = document.querySelector('.calc-result');
        if (!resultCard) {
            console.error('Элемент .calc-result не найден');
            return;
        }
        if (!drinkKey || !size || !model.kbju[kbjuKey] || !model.kbju[kbjuKey][size]) {
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
                this.initAddToCartListeners();
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
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'block';
            });
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
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
            if (event.target === loginModal) loginModal.style.display = 'none';
            if (event.target === registerModal) registerModal.style.display = 'none';
            if (event.target === cartModal) cartModal.style.display = 'none';
            if (event.target === profileModal) profileModal.style.display = 'none';
            if (event.target === qrModal) qrModal.style.display = 'none';
        });
    },
    initAuthForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const email = document.getElementById('register-email').value;
                await this.registerUser(username, password, email);
            });
        }
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                await this.loginUser(username, password);
            });
        }
    },
    initOrderForms() {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const branchId = document.getElementById('branch').value;
                const tableId = document.getElementById('table').value;
                const username = localStorage.getItem('currentUser');
                const cart = shoppingModel.getCart();
                if (cart.length === 0) {
                    alert('Корзина пуста');
                    return;
                }
                const items = cart.map(item => ({
                    name: item.name,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity
                }));
                await this.createOrder(username, branchId, tableId, items);
            });
        }
        const cartOrderForm = document.getElementById('cart-order-form');
        if (cartOrderForm) {
            cartOrderForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const branchId = document.getElementById('cart-branch').value;
                const tableId = document.getElementById('cart-table').value;
                const username = localStorage.getItem('currentUser');
                const cart = shoppingModel.getCart();
                if (cart.length === 0) {
                    alert('Корзина пуста');
                    return;
                }
                const items = cart.map(item => ({
                    name: item.name,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity
                }));
                await this.createOrder(username, branchId, tableId, items);
                document.getElementById('cart-modal').style.display = 'none';
            });
        }
    },
    async registerUser(username, password, email) {
        try {
            const user = await model.registerUser(username, email, password);
            localStorage.setItem('currentUser', user.username);
            localStorage.setItem('userEmail', user.email);
            alert('Регистрация успешна');
            document.getElementById('register-modal').style.display = 'none';
            this.updateAuthUI();
            view.renderOrderSection();
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
        }
    },
    async loginUser(username, password) {
        try {
            const user = await model.loginUser(username, password);
            localStorage.setItem('currentUser', user.username);
            localStorage.setItem('userEmail', user.email);
            alert('Вход успешен');
            document.getElementById('login-modal').style.display = 'none';
            this.updateAuthUI();
            view.renderOrderSection();
        } catch (error) {
            alert('Ошибка входа: Неверное имя пользователя или пароль');
        }
    },
    async createOrder(username, branchId, tableId, items) {
        try {
            const order = await model.createOrder(username, branchId, tableId, items);
            shoppingModel.clearCart();
            view.renderShoppingButton();
            view.renderCartModal();
            alert(`Заказ #${order.id} успешно оформлен!`);
            document.getElementById('order-form')?.reset();
            view.renderOrderSection();
        } catch (error) {
            alert('Ошибка оформления заказа: ' + error.message);
        }
    },
    async updateTableOptions(branchId) {
        if (!branchId) return;
        const tables = await model.fetchTables(branchId);
        view.updateTableOptions(tables);
    },
    async updateCartTableOptions(branchId) {
        if (!branchId) return;
        const tables = await model.fetchTables(branchId);
        view.updateCartTableOptions(tables);
    },
    async loadOrderHistory() {
        const username = localStorage.getItem('currentUser');
        if (!username) return;
        const orders = await model.getUserOrders(username);
        view.updateOrderHistory(orders);
    },
    updateAuthUI() {
        const currentUser = localStorage.getItem('currentUser');
        const authButtons = document.querySelector('.auth-buttons');
        const orderSection = document.getElementById('order');
        if (authButtons) {
            view.renderShoppingButton();
        }
        if (currentUser) {
            if (orderSection) {
                orderSection.style.display = 'block';
            }
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userEmail');
                    this.updateAuthUI();
                    view.renderOrderSection();
                });
            }
        } else {
            if (orderSection) {
                orderSection.style.display = 'none';
            }
        }
        this.initAuthModals();
        this.initModalListeners();
        this.initOrderForms();
    }
};