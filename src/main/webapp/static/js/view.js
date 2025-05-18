const shoppingView = {
    renderCart() {
        const cartSection = document.getElementById('cart-section');
        if (!cartSection) {
            console.error('Элемент #cart-section не найден');
            return;
        }
        const cart = shoppingModel.getCart();
        const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(' ₽', '')) * item.quantity), 0);

        cartSection.innerHTML = `
            <h2>Ваша корзина</h2>
            ${cart.length === 0 ? '<p>Корзина пуста</p>' : `
                <div class="cart-items">
                    ${cart.map((item, index) => `
                        <div class="cart-item">
                            <div class="cart-item-details">
                                <h3>${item.name} (${item.volume})</h3>
                                <p>Цена: ${item.price}</p>
                                <div class="quantity-control">
                                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                                </div>
                            </div>
                            <button class="remove-item" data-index="${index}">Удалить</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">
                    <h3>Итого: ${total.toFixed(2)} ₽</h3>
                </div>
                <button class="order-button" ${cart.length === 0 ? 'disabled' : ''}>Заказать</button>
            `}
        `;
    },
    renderAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (!authModal) {
            console.error('Элемент #auth-modal не найден');
            return;
        }
        authModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2>Авторизация</h2>
                <p>Пожалуйста, войдите или зарегистрируйтесь, чтобы продолжить.</p>
                <button id="login-redirect">Войти</button>
                <button id="register-redirect">Зарегистрироваться</button>
            </div>
        `;
    },
    renderTableSelectionModal() {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'table-selection-modal';
        modalContainer.className = 'modal';
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2>Выберите столик</h2>
                <form id="table-selection-form">
                    <div class="form-group">
                        <label for="branch">Филиал:</label>
                        <select id="branch" required>
                            <option value="">Выберите филиал</option>
                            ${model.branches.map(branch => `
                                <option value="${branch.id}">${branch.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="table">Столик:</label>
                        <select id="table" required>
                            <option value="">Выберите столик</option>
                        </select>
                    </div>
                    <button type="submit" class="modal-confirm-button">Подтвердить заказ</button>
                </form>
            </div>
        `;
        document.body.appendChild(modalContainer);
    }
};