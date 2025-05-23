const adminViewModel = {
    async init() {
        console.debug('Инициализация adminViewModel...');
        adminView.renderAddBranchModal();
        adminView.renderManageTablesModal();
        await this.fetchAndRenderBranches();
        this.initEventListeners();
        console.debug('adminViewModel инициализирован');
    },

    async fetchAndRenderBranches() {
        const branches = await adminModel.fetchBranches();
        adminView.renderBranches(branches);
    },

    async fetchAndRenderTables(branchId) {
        console.debug(`Загрузка и рендеринг столиков для branchId=${branchId}`);
        const tables = await adminModel.fetchTables(branchId);
        adminView.renderTables(tables, branchId);
    },

    async fetchAndRenderOrders(branchId) {
        console.debug(`Загрузка и рендеринг заказов для branchId=${branchId}`);
        const orders = await adminModel.fetchOrders(branchId);
        adminView.renderOrders(orders);
    },

    initEventListeners() {
        console.debug('Привязка слушателей событий...');
        const addBranchBtn = document.getElementById('add-branch-btn');
        const addBranchModal = document.getElementById('add-branch-modal');
        const manageTablesModal = document.getElementById('manage-tables-modal');

        // Открытие модалки добавления филиала
        if (addBranchBtn) {
            addBranchBtn.addEventListener('click', () => {
                console.debug('Клик по кнопке Добавить филиал');
                if (addBranchModal) {
                    addBranchModal.style.display = 'block';
                } else {
                    console.error('Модалка #add-branch-modal не найдена');
                }
            });
        } else {
            console.error('Кнопка #add-branch-btn не найдена');
        }

        // Закрытие модалок
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('close')) {
                console.debug('Закрытие модалки');
                if (addBranchModal) addBranchModal.style.display = 'none';
                if (manageTablesModal) manageTablesModal.style.display = 'none';
            }
            if (event.target === addBranchModal || event.target === manageTablesModal) {
                event.target.style.display = 'none';
            }
        });

        // Добавление филиала
        const addBranchForm = document.getElementById('add-branch-form');
        if (addBranchForm) {
            addBranchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.debug('Отправка формы добавления филиала');
                const name = document.getElementById('branch-name').value;
                const address = document.getElementById('branch-address').value;
                const coordinates = document.getElementById('branch-coordinates').value
                    .split(',')
                    .map(coord => parseFloat(coord.trim()));

                if (coordinates.length !== 2 || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
                    alert('Введите корректные координаты (широта, долгота)');
                    return;
                }

                try {
                    await adminModel.addBranch(name, address, coordinates);
                    addBranchModal.style.display = 'none';
                    addBranchForm.reset();
                    await this.fetchAndRenderBranches();
                    alert('Филиал добавлен');
                } catch (error) {
                    alert('Не удалось добавить филиал: ' + error.message);
                }
            });
        } else {
            console.error('Форма #add-branch-form не найдена');
        }

        // Действия с филиалами
        const branchesList = document.getElementById('branches-list');
        if (branchesList) {
            branchesList.addEventListener('click', async (e) => {
                const target = e.target;
                const branchId = target.getAttribute('data-branch-id'); // Извлекаем data-branch-id

                if (!branchId) {
                    console.error('branchId не найден в data-branch-id');
                    return;
                }

                if (target.classList.contains('manage-tables-btn')) {
                    console.debug(`Открытие управления столиками для филиала ${branchId}`);
                    await this.fetchAndRenderTables(branchId);
                    if (manageTablesModal) {
                        manageTablesModal.style.display = 'block';
                        manageTablesModal.setAttribute('data-branch-id', branchId); // Устанавливаем data-branch-id
                    } else {
                        console.error('Модалка #manage-tables-modal не найдена');
                    }
                }

                if (target.classList.contains('view-orders-btn')) {
                    console.debug(`Загрузка заказов для филиала ${branchId}`);
                    await this.fetchAndRenderOrders(branchId);
                }

                if (target.classList.contains('delete-btn')) {
                    if (confirm('Вы уверены, что хотите удалить филиал?')) {
                        try {
                            await adminModel.deleteBranch(branchId);
                            await this.fetchAndRenderBranches();
                            alert('Филиал удалён');
                        } catch (error) {
                            alert('Не удалось удалить филиал: ' + error.message);
                        }
                    }
                }
            });
        } else {
            console.error('Элемент #branches-list не найден');
        }

        // Добавление столика
        const addTableForm = document.getElementById('add-table-form');
        if (addTableForm) {
            addTableForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.debug('Отправка формы добавления столика');
                const branchId = manageTablesModal.getAttribute('data-branch-id'); // Используем getAttribute
                const number = parseInt(document.getElementById('table-number').value);

                if (!branchId) {
                    console.error('branchId не найден в manageTablesModal');
                    alert('Ошибка: Не выбран филиал');
                    return;
                }

                if (isNaN(number) || number < 1) {
                    alert('Введите корректный номер столика');
                    return;
                }

                try {
                    await adminModel.addTable(branchId, number);
                    addTableForm.reset();
                    await this.fetchAndRenderTables(branchId);
                    alert('Столик добавлен');
                } catch (error) {
                    alert('Не удалось добавить столик: ' + error.message);
                }
            });
        } else {
            console.error('Форма #add-table-form не найдена');
        }

        // Удаление столика
        const tablesList = document.getElementById('tables-list');
        if (tablesList) {
            tablesList.addEventListener('click', async (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    console.debug('Клик по кнопке удаления столика');
                    const tableId = e.target.getAttribute('data-table-id');
                    const branchId = e.target.getAttribute('data-branch-id');
                    if (!tableId || !branchId) {
                        console.error('tableId или branchId не найдены');
                        return;
                    }
                    if (confirm('Вы уверены, что хотите удалить столик?')) {
                        try {
                            await adminModel.deleteTable(branchId, tableId);
                            await this.fetchAndRenderTables(branchId);
                            alert('Столик удалён');
                        } catch (error) {
                            alert('Не удалось удалить столик: ' + error.message);
                        }
                    }
                }
            });
        } else {
            console.error('Элемент #tables-list не найден');
        }
    }
};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.debug('DOM загружен, инициализация adminViewModel');
    adminViewModel.init();
});