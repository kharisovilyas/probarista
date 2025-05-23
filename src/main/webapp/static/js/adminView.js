const adminView = {
    renderBranches(branches) {
        const branchesList = document.getElementById('branches-list');
        if (!branchesList) {
            console.error('Элемент #branches-list не найден');
            return;
        }
        branchesList.innerHTML = branches.length > 0 ? branches.map(branch => `
            <div class="branch-card">
                <h3>${branch.name}</h3>
                <p><strong>Адрес:</strong> ${branch.address}</p>
                <p><strong>Координаты:</strong> ${branch.coordinates.join(', ')}</p>
                <div class="actions">
                    <button class="action-btn manage-tables-btn" data-branch-id="${branch.id}">Управление столиками</button>
                    <button class="action-btn view-orders-btn" data-branch-id="${branch.id}">Просмотр заказов</button>
                    <button class="action-btn delete-btn" data-branch-id="${branch.id}">Удалить</button>
                </div>
            </div>
        `).join('') : '<p>Филиалы отсутствуют. Добавьте новый филиал.</p>';
    },

    renderTables(tables, branchId) {
        const tablesList = document.getElementById('tables-list');
        if (!tablesList) {
            console.error('Элемент #tables-list не найден');
            return;
        }
        tablesList.innerHTML = tables.length > 0 ? tables.map(table => `
            <div class="table-item">
                <span>Столик №${table.number}</span>
                <button class="delete-btn" data-table-id="${table.id}" data-branch-id="${branchId}">Удалить</button>
            </div>
        `).join('') : '<p>Столики отсутствуют. Добавьте новый столик.</p>';
    },

    renderOrders(orders) {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) {
            console.error('Элемент #orders-list не найден');
            return;
        }
        ordersList.innerHTML = orders.length > 0 ? `
            <h2>Текущие заказы</h2>
            <ul>
                ${orders.map(order => `
                    <li>
                        Заказ #${order.id} (${new Date(order.timestamp).toLocaleString()})<br>
                        Столик: ${order.table.number}<br>
                        ${order.items.map(item => `${item.name} (${item.size}) x${item.quantity}`).join(', ')}<br>
                        Итого: ${order.total} ₽<br>
                        Статус: ${order.status}
                    </li>
                `).join('')}
            </ul>
        ` : '<p>Нет активных заказов для выбранного филиала.</p>';
    },

    renderAddBranchModal() {
        const addBranchModal = document.getElementById('add-branch-modal');
        if (!addBranchModal) {
            console.error('Элемент #add-branch-modal не найден');
            return;
        }
        addBranchModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Добавить филиал</h2>
                <form id="add-branch-form">
                    <div class="form-group">
                        <label for="branch-name">Название филиала</label>
                        <input type="text" id="branch-name" placeholder="Введите название" required>
                    </div>
                    <div class="form-group">
                        <label for="branch-address">Адрес</label>
                        <input type="text" id="branch-address" placeholder="Введите адрес" required>
                    </div>
                    <div class="form-group">
                        <label for="branch-coordinates">Координаты (широта, долгота)</label>
                        <input type="text" id="branch-coordinates" placeholder="Например: 59.9386, 30.3141" required>
                    </div>
                    <button type="submit" class="modal-button">Сохранить</button>
                </form>
            </div>
        `;
        console.debug('Модалка для добавления филиала отрендерена');
    },

    renderManageTablesModal() {
        const manageTablesModal = document.getElementById('manage-tables-modal');
        if (!manageTablesModal) {
            console.error('Элемент #manage-tables-modal не найден');
            return;
        }
        manageTablesModal.innerHTML = `
            <div class="modal-content">
                <span class="close">×</span>
                <h2 class="modal-title handwritten-title">Управление столиками</h2>
                <div id="tables-list" class="tables-list"></div>
                <form id="add-table-form">
                    <div class="form-group">
                        <label for="table-number">Номер столика</label>
                        <input type="number" id="table-number" placeholder="Введите номер" min="1" required>
                    </div>
                    <button type="submit" class="modal-button">Добавить столик</button>
                </form>
            </div>
        `;
        console.debug('Модалка для управления столиками отрендерена');
    }
};