const model = {
    navLinks: [
        { href: "#hero", text: "Главная" },
        { href: "#menu", text: "Меню" },
        { href: "#about", text: "О нас" },
        { href: "#loyalty", text: "Лояльность" },
        { href: "#order", text: "Заказ" },
        { href: "#calculator", text: "Калькулятор" },
        { href: "#contacts", text: "Контакты" }
    ],
    hero: {
        title: "Добро пожаловать в Pro Barista",
        description: "Наслаждайтесь лучшим кофе в городе!",
        ctaText: "Посмотреть меню",
        ctaHref: "#menu"
    },
    about: {
        description: "Pro Barista — это место, где кофе становится искусством.",
        features: [
            { icon: "fas fa-coffee", title: "Качественный кофе", description: "Только лучшие зёрна." },
            { icon: "fas fa-heart", title: "С любовью", description: "Каждый напиток готовится с душой." },
            { icon: "fas fa-users", title: "Дружелюбный персонал", description: "Мы рады каждому гостю." }
        ]
    },
    menu: {
        categories: ["all", "coffee", "tea", "desserts"],
        items: [
            {
                name: "Эспрессо",
                description: "Классический эспрессо с насыщенным вкусом.",
                image: "images/espresso.jpg",
                category: "coffee",
                sizes: [
                    { volume: "small", price: "150 ₽" },
                    { volume: "medium", price: "200 ₽" }
                ]
            },
            {
                name: "Зелёный чай",
                description: "Освежающий зелёный чай.",
                image: "images/green-tea.jpg",
                category: "tea",
                sizes: [
                    { volume: "medium", price: "120 ₽" },
                    { volume: "large", price: "150 ₽" }
                ]
            },
            {
                name: "Чизкейк",
                description: "Нежный чизкейк с ягодным соусом.",
                image: "images/cheesecake.jpg",
                category: "desserts",
                sizes: [
                    { volume: "single", price: "250 ₽" }
                ]
            }
        ]
    },
    loyaltyCards: [
        {
            title: "Кофейный фанат",
            subtitle: "Для любителей кофе",
            description: "Получайте 10% кэшбэка на все кофейные напитки.",
            icon: "fas fa-coffee"
        },
        {
            title: "Постоянный гость",
            subtitle: "Для наших друзей",
            description: "Каждый 10-й напиток бесплатно!",
            icon: "fas fa-star"
        }
    ],
    contacts: {
        addresses: ["ул. Тверская, 50", "ул. Солдата Корзуна, 1к2"],
        phone: "+7 (999) 123-45-67",
        email: "info@probarista.ru",
        hours: ["Пн-Пт: 8:00 - 20:00", "Сб-Вс: 9:00 - 18:00"]
    },
    footer: {
        brand: "Pro Barista",
        tagline: "Кофе с душой",
        socialLinks: [
            { platform: "instagram", href: "#" },
            { platform: "vk", href: "#" }
        ],
        copyright: "© 2025 Pro Barista. Все права защищены."
    },
    branches: [
        { id: "branch1", name: "ProBarista на Тверской", address: "ул. Тверская, 50", coordinates: [59.9386, 30.3141] },
        { id: "branch2", name: "ProBarista на Корзуна", address: "ул. Солдата Корзуна, 1к2", coordinates: [59.8519, 30.3156] }
    ],
    tables: [
        { id: "table1", number: "1", branchId: "branch1" },
        { id: "table2", number: "2", branchId: "branch1" },
        { id: "table3", number: "1", branchId: "branch2" }
    ],
    kbju: {
        espresso: {
            small: { calories: 10, proteins: 0, fats: 0, carbs: 2 },
            medium: { calories: 15, proteins: 0, fats: 0, carbs: 3 }
        },
        green_tea: {
            medium: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
            large: { calories: 0, proteins: 0, fats: 0, carbs: 0 }
        },
        cheesecake: {
            single: { calories: 320, proteins: 6, fats: 20, carbs: 30 }
        }
    },
    drinkNames: {
        espresso: "Эспрессо",
        green_tea: "Зелёный чай",
        cheesecake: "Чизкейк"
    },
    drinkKeyMapping: {
        espresso: "espresso",
        green_tea: "green_tea",
        cheesecake: "cheesecake"
    },
    async fetchBranches() {
        try {
            const response = await fetch('/api/branches');
            if (!response.ok) throw new Error('Failed to fetch branches');
            const branches = await response.json();
            this.branches = branches.map(branch => ({
                id: branch.id,
                name: branch.name,
                address: branch.address,
                coordinates: branch.coordinates || [59.9386, 30.3141]
            }));
            return this.branches;
        } catch (error) {
            console.error('Error fetching branches:', error);
            return this.branches;
        }
    },
    async fetchTables(branchId) {
        try {
            const response = await fetch(`/api/tables/${branchId}`);
            if (!response.ok) throw new Error('Failed to fetch tables');
            const tables = await response.json();
            this.tables = tables.map(table => ({
                id: table.id,
                number: table.number,
                branchId: table.branch.id
            }));
            return this.tables;
        } catch (error) {
            console.error('Error fetching tables:', error);
            return this.tables.filter(table => table.branchId === branchId);
        }
    },
    async registerUser(username, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) throw new Error('Registration failed');
            return await response.json();
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    },
    async loginUser(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) throw new Error('Login failed');
            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },
    async createOrder(username, branchId, tableId, items) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, branchId, tableId, items })
            });
            if (!response.ok) throw new Error('Order creation failed');
            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },
    async getUserOrders(username) {
        try {
            const response = await fetch(`/api/orders?username=${username}`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }
};

const shoppingModel = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },
    addToCart(product, size, name, price) {
        let cart = this.getCart();
        const existingItem = cart.find(item => item.product === product && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ product, size, name, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    clearCart() {
        localStorage.setItem('cart', '[]');
    }
};