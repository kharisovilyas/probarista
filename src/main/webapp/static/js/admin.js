const adminView = {
    async init() {
        console.debug('Инициализация adminView');
        await this.fetchAndRenderBranches();
        this.initEventListeners();
        view.renderShoppingButton(); // Переиспользуем для отображения авторизации
        viewModel.updateAuthUI(); // Обновляем UI авторизации
    },

    async fetchAndRenderBranches() {
        try {
            const response = await fetch('/api/v1/branches');
            const branches = await response.json();
            this.renderBranches(branches);
        } catch (error) {
            console.error('Ошибка получения филиалов:', error);
            alert('Не удалось загрузить филиалы');
        }
    },

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
                    <button class="action-btn delete-btn" data-branch-id="${branch.id}">Удалить</button>
                </div>
            </div>
        `).join('') : '<p>Филиалы отсутствуют. Добавьте новый филиал.</p>';
    },

    async renderTables(branchId) {
        try {
            const response = await fetch(`/api/v1/branches/${branchId}/tables`);
            const tables = await response.json();
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
        } catch (error) {
            console.error('Ошибка получения столиков:', error);
            alert('Не удалось загрузить столики');
        }
    },

    initEventListeners() {
        const addBranchBtn = document.getElementById('add-branch-btn');
        const addBranchModal = document.getElementById('add-branch-modal');
        const addBranchForm = document.getElementById('add-branch-form');
        const manageTablesModal = document.getElementById('manage-tables-modal');
        const addTableForm = document.getElementById('add-table-form');
        const closeBtns = document.querySelectorAll('.modal .close');

        // Открытие модалки добавления филиала
        if (addBranchBtn && addBranchModal) {
            addBranchBtn.addEventListener('click', () => {
                addBranchModal.style.display = 'block';
            });
        }

        // Закрытие модалок
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                addBranchModal.style.display = 'none';
                manageTablesModal.style.display = 'none';
            });
        });

        // Закрытие при клике вне модалки
        window.addEventListener('click', (event) => {
            if (event.target === addBranchModal) {
                addBranchModal.style.display = 'none';
            }
            if (event.target === manageTablesModal) {
                manageTablesModal.style.display = 'none';
            }
        });

        // Добавление филиала
        if (addBranchForm) {
            addBranchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
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
                    const response = await fetch('/api/v1/branches', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, address, coordinates })
                    });
                    if (response.ok) {
                        addBranchModal.style.display = 'none';
                        addBranchForm.reset();
                        await this.fetchAndRenderBranches();
                        alert('Филиал добавлен');
                    } else {
                        throw new Error('Ошибка добавления филиала');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Не удалось добавить филиал');
                }
            });
        }

        // Обработчики для кнопок управления столиками и удаления
        document.getElementById('branches-list').addEventListener('click', async (e) => {
            const target = e.target;
            const branchId = target.dataset.branchId;

            if (target.classList.contains('manage-tables-btn') && branchId) {
                await this.renderTables(branchId);
                manageTablesModal.style.display = 'block';
                manageTablesModal.dataset.branchId = branchId; // Сохраняем ID филиала
            }

            if (target.classList.contains('delete-btn') && branchId) {
                if (confirm('Вы уверены, что хотите удалить филиал?')) {
                    try {
                        const response = await fetch(`/api/v1/branches/${branchId}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            await this.fetchAndRenderBranches();
                            alert('Филиал удалён');
                        } else {
                            throw new Error('Ошибка удаления филиала');
                        }
                    } catch (error) {
                        console.error('Ошибка:', error);
                        alert('Не удалось удалить филиал');
                    }
                }
            }
        });

        // Добавление столика
        if (addTableForm) {
            addTableForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const branchId = manageTablesModal.dataset.branchId;
                const number = parseInt(document.getElementById('table-number').value);

                if (!branchId || isNaN(number) || number < 1) {
                    alert('Введите корректный номер столика');
                    return;
                }

                try {
                    const response = await fetch(`/api/v1/branches/${branchId}/tables`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ number })
                    });
                    if (response.ok) {
                        addTableForm.reset();
                        await this.renderTables(branchId);
                        alert('Столик добавлен');
                    } else {
                        throw new Error('Ошибка добавления столика');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Не удалось добавить столик');
                }
            });
        }

        // Удаление столика
        document.getElementById('tables-list').addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const tableId = e.target.dataset.tableId;
                const branchId = e.target.dataset.branchId;
                if (confirm('Вы уверены, что хотите удалить столик?')) {
                    try {
                        const response = await fetch(`/api/v1/branches/${branchId}/tables/${tableId}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            await this.renderTables(branchId);
                            alert('Столик удалён');
                        } else {
                            throw new Error('Ошибка удаления столика');
                        }
                    } catch (error) {
                        console.error('Ошибка:', error);
                        alert('Не удалось удалить столик');
                    }
                }
            }
        });
    }
};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.debug('DOM загружен, инициализация adminView');
    adminView.init();
});