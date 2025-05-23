const adminModel = {
    branches: [],
    tables: [],
    orders: [],

    async fetchBranches() {
        try {
            console.debug('Загрузка филиалов...');
            const response = await fetch('/api/v1/branches');
            if (!response.ok) throw new Error(`Ошибка загрузки филиалов: ${response.status}`);
            const branches = await response.json();
            this.branches = branches.map(branch => ({
                id: branch.id,
                name: branch.name,
                address: branch.address,
                coordinates: branch.coordinates || [59.9386, 30.3141]
            }));
            console.debug('Филиалы загружены:', this.branches);
            return this.branches;
        } catch (error) {
            console.error('Ошибка при загрузке филиалов:', error);
            return this.branches;
        }
    },

    async fetchTables(branchId) {
        try {
            console.debug(`Загрузка столиков для филиала ${branchId}...`);
            const response = await fetch(`/api/v1/branches/${branchId}/tables`);
            if (!response.ok) throw new Error(`Ошибка загрузки столиков: ${response.status}`);
            const tables = await response.json();
            this.tables = tables.map(table => ({
                id: table.id,
                number: table.number,
                branchId: branchId
            }));
            console.debug('Столики загружены:', this.tables);
            return this.tables;
        } catch (error) {
            console.error('Ошибка при загрузке столиков:', error);
            return this.tables.filter(table => table.branchId === branchId);
        }
    },

    async fetchOrders(branchId) {
        try {
            console.debug(`Загрузка заказов для филиала ${branchId}...`);
            const response = await fetch(`/api/v1/orders?branchId=${branchId}`);
            if (!response.ok) throw new Error(`Ошибка загрузки заказов: ${response.status}`);
            const orders = await response.json();
            this.orders = orders.map(order => ({
                id: order.id,
                table: { number: order.table.number },
                items: order.items,
                total: order.total,
                status: order.status,
                timestamp: order.timestamp
            }));
            console.debug('Заказы загружены:', this.orders);
            return this.orders;
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
            return this.orders;
        }
    },

    async addBranch(name, address, coordinates) {
        try {
            console.debug('Добавление филиала:', { name, address, coordinates });
            const response = await fetch('/api/v1/branches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address, coordinates })
            });
            if (!response.ok) throw new Error(`Ошибка добавления филиала: ${response.status}`);
            const branch = await response.json();
            console.debug('Филиал добавлен:', branch);
            return branch;
        } catch (error) {
            console.error('Ошибка при добавлении филиала:', error);
            throw error;
        }
    },

    async deleteBranch(branchId) {
        if (!branchId) {
            console.error('branchId не указан для удаления филиала');
            throw new Error('branchId не указан');
        }
        try {
            console.debug(`Удаление филиала ${branchId}...`);
            const response = await fetch(`/api/v1/branches/${branchId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Ошибка удаления филиала: ${response.status}`);
            console.debug('Филиал удалён');
            return true;
        } catch (error) {
            console.error('Ошибка при удалении филиала:', error);
            throw error;
        }
    },

    async addTable(branchId, number) {
        try {
            console.debug(`Добавление столика ${number} для филиала ${branchId}...`);
            const response = await fetch(`/api/v1/branches/${branchId}/tables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number })
            });
            if (!response.ok) throw new Error(`Ошибка добавления столика: ${response.status}`);
            const table = await response.json();
            console.debug('Столик добавлен:', table);
            return table;
        } catch (error) {
            console.error('Ошибка при добавлении столика:', error);
            throw error;
        }
    },

    async deleteTable(branchId, tableId) {
        try {
            console.debug(`Удаление столика ${tableId} для филиала ${branchId}...`);
            const response = await fetch(`/api/v1/branches/${branchId}/tables/${tableId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Ошибка удаления столика: ${response.status}`);
            console.debug('Столик удалён');
            return true;
        } catch (error) {
            console.error('Ошибка при удалении столика:', error);
            throw error;
        }
    }
};