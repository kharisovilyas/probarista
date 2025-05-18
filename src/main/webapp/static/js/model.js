const model = {
    navLinks: [
        { text: 'Главная', href: '#hero' },
        { text: 'Меню', href: '#menu' },
        { text: 'О нас', href: '#about' },
        { text: 'Лояльность', href: '#loyalty' },
        { text: 'Калькулятор КБЖУ', href: '#calculator' },
        { text: 'Заказ', href: '#order' },
        { text: 'Контакты', href: '#contacts' }
    ],
    users: [
        {
            name: "ilyas",
            email: "ilyas@gmail.com",
            password: "ilyas",
            prevOrders: [
                {
                    orderId: "ord001",
                    branchId: "tverskaya",
                    items: [
                        { name: "Эспрессо", size: "40 мл", price: "95 ₽", quantity: 2 },
                        { name: "Капучино", size: "200 мл", price: "155 ₽", quantity: 1 }
                    ],
                    total: "245 ₽",
                    timestamp: "2025-05-18T10:00:00Z",
                    status: "completed"
                },
                {
                    orderId: "ord002",
                    branchId: "korzuna",
                    items: [
                        { name: "Раф Лавандовый", size: "300 мл", price: "195 ₽", quantity: 1 }
                    ],
                    total: "195 ₽",
                    timestamp: "2025-05-17T15:30:00Z",
                    status: "completed"
                },
                {
                    orderId: "ord003",
                    branchId: "tverskaya",
                    items: [
                        { name: "Клубничный мохито", size: "400 мл", price: "235 ₽", quantity: 1 },
                        { name: "Сироп", size: "Порция", price: "35 ₽", quantity: 1 }
                    ],
                    total: "270 ₽",
                    timestamp: "2025-05-16T12:15:00Z",
                    status: "cancelled"
                }
            ],
            loyaltyPoints: 150,
            preferences: {
                favoriteBranch: "tverskaya",
                favoriteDrinks: ["Эспрессо", "Раф Лавандовый"],
                notifications: true
            },
            createdAt: "2025-01-10T09:00:00Z",
            lastLogin: "2025-05-18T09:45:00Z"
        }
    ],
    hero: {
        title: 'ProBarista — когда кофе и чувства согревают',
        description: 'ProBarista — это место, где каждый глоток кофе может стать началом новой истории. Здесь тепло не только в чашке, но и в атмосфере — мягкий свет, аромат свежемолотых зёрен и тот самый уют, в котором хочется остаться подольше.',
        ctaText: 'Смотреть меню',
        ctaHref: '#menu'
    },
    menu: {
        categories: [
            'all',
            'coffee',
            'author-drinks',
            'lemonades',
            'juices',
            'milkshakes',
            'protein',
            'iced',
            'tea',
            'additives'
        ],
        items: [
            {
                category: 'coffee',
                name: 'Эспрессо',
                description: 'Классический итальянский эспрессо с насыщенным вкусом и плотной пенкой.',
                image: '/static/images/espresso.jpg',
                sizes: [
                    { volume: '40 мл', price: '95 ₽' },
                    { volume: '80 мл', price: '125 ₽' },
                    { volume: '120 мл', price: '145 ₽' }
                ]
            },
            {
                category: 'coffee',
                name: 'Капучино',
                description: 'Идеальное сочетание эспрессо и воздушного молока с нежной пенкой.',
                image: '/static/images/cappuccino.jpg',
                sizes: [
                    { volume: '200 мл', price: '155 ₽' },
                    { volume: '300 мл', price: '185 ₽' },
                    { volume: '400 мл', price: '205 ₽' }
                ]
            },
            {
                category: 'coffee',
                name: 'Латте',
                description: 'Нежный кофейный напиток с большим количеством молока.',
                image: '/static/images/latte.jpg',
                sizes: [
                    { volume: '200 мл', price: '155 ₽' },
                    { volume: '300 мл', price: '185 ₽' },
                    { volume: '400 мл', price: '205 ₽' }
                ]
            },
            {
                category: 'author-drinks',
                name: 'Раф Лавандовый',
                description: 'Нежный раф с ароматом лаванды и сливочным вкусом.',
                image: '/static/images/raf-lavender.jpg',
                sizes: [
                    { volume: '300 мл', price: '195 ₽' }
                ]
            },
            {
                category: 'lemonades',
                name: 'Клубничный мохито',
                description: 'Освежающий лимонад с клубникой и мятой.',
                image: '/static/images/strawberry-mojito.jpg',
                sizes: [
                    { volume: '400 мл', price: '235 ₽' }
                ]
            },
            {
                category: 'juices',
                name: 'Апельсиновый сок',
                description: 'Свежий сок из спелых апельсинов.',
                image: '/static/images/orange-juice.jpg',
                sizes: [
                    { volume: '300 мл', price: '175 ₽' },
                    { volume: '400 мл', price: '215 ₽' },
                    { volume: '500 мл', price: '255 ₽' }
                ]
            },
            {
                category: 'milkshakes',
                name: 'Молочный коктейль',
                description: 'Классический ванильный коктейль с мороженым.',
                image: '/static/images/milkshake.jpg',
                sizes: [
                    { volume: '300 мл', price: '195 ₽' }
                ]
            },
            {
                category: 'protein',
                name: 'Протеин на молоке',
                description: 'Питательный коктейль для активного дня.',
                image: '/static/images/protein-milk.jpg',
                sizes: [
                    { volume: '400 мл', price: '245 ₽' }
                ]
            },
            {
                category: 'iced',
                name: 'Айс Латте',
                description: 'Холодный латте с мягким кофейным вкусом.',
                image: '/static/images/iced-latte.jpg',
                sizes: [
                    { volume: '300 мл', price: '185 ₽' }
                ]
            },
            {
                category: 'tea',
                name: 'Чай',
                description: 'Ароматный черный или зеленый чай на выбор.',
                image: '/static/images/tea.jpg',
                sizes: [
                    { volume: '300 мл', price: '95 ₽' }
                ]
            },
            {
                category: 'additives',
                name: 'Сироп',
                description: 'Добавьте любимый вкус к своему напитку.',
                image: '/static/images/syrup.jpg',
                sizes: [
                    { volume: 'Порция', price: '35 ₽' }
                ]
            }
        ]
    },
    loyaltyCards: [
        { icon: 'fas fa-ticket-alt', title: 'Абонемент', subtitle: 'Каждый 6-й кофе бесплатно', description: 'Покупайте 5 кофе, а шестой получайте в подарок!' },
        { icon: 'fas fa-percentage', title: 'Скидки', subtitle: 'Сладкие привилегии', description: '10% на десерты при покупке кофе' },
        { icon: 'fas fa-gift', title: 'Акции', subtitle: 'Сюрпризы для гостей', description: 'Участвуйте в наших сезонных акциях!' }
    ],
    branches: [
        { id: 'tverskaya', name: 'ProBarista на Тверской', address: 'Санкт-Петербург, ул. Тверская, 50', coordinates: [59.9386, 30.3141] },
        { id: 'korzuna', name: 'ProBarista на Корзуна', address: 'Санкт-Петербург, ул. Солдата Корзуна, 1к2', coordinates: [59.8519, 30.3156] }
    ],
    kbju: {
        'espresso': {
            small: { calories: 2, proteins: 0.2, fats: 0.1, carbs: 0.3 },
            medium: { calories: 3, proteins: 0.3, fats: 0.15, carbs: 0.4 },
            large: { calories: 4, proteins: 0.4, fats: 0.2, carbs: 0.5 }
        },
        'cappuccino': {
            small: { calories: 120, proteins: 3.5, fats: 6.2, carbs: 12.8 },
            medium: { calories: 150, proteins: 4.2, fats: 7.5, carbs: 15.3 },
            large: { calories: 180, proteins: 5.0, fats: 8.8, carbs: 17.8 }
        },
        'latte': {
            small: { calories: 140, proteins: 4.0, fats: 7.0, carbs: 14.0 },
            medium: { calories: 170, proteins: 4.8, fats: 8.3, carbs: 16.5 },
            large: { calories: 200, proteins: 5.5, fats: 9.5, carbs: 19.0 }
        },
        'raf-lavender': {
            medium: { calories: 180, proteins: 2.5, fats: 6.5, carbs: 20.0 }
        },
        'strawberry-mojito': {
            large: { calories: 180, proteins: 0.5, fats: 0.2, carbs: 40.0 }
        },
        'orange-juice': {
            medium: { calories: 140, proteins: 1.0, fats: 0.2, carbs: 32.0 },
            large: { calories: 180, proteins: 1.3, fats: 0.3, carbs: 42.0 },
            xlarge: { calories: 220, proteins: 1.6, fats: 0.4, carbs: 52.0 }
        },
        'milkshake': {
            medium: { calories: 210, proteins: 4.5, fats: 7.0, carbs: 30.0 }
        },
        'protein-milk': {
            large: { calories: 190, proteins: 20.0, fats: 4.5, carbs: 13.0 }
        },
        'iced-latte': {
            medium: { calories: 140, proteins: 4.0, fats: 7.0, carbs: 14.0 }
        },
        'tea': {
            medium: { calories: 4, proteins: 0.1, fats: 0, carbs: 0.8 }
        },
        'syrup': {
            single: { calories: 40, proteins: 0, fats: 0, carbs: 10.0 }
        }
    },
    drinkNames: {
        'espresso': 'Эспрессо',
        'cappuccino': 'Капучино',
        'latte': 'Латте',
        'raf-lavender': 'Раф Лавандовый',
        'strawberry-mojito': 'Клубничный мохито',
        'orange-juice': 'Апельсиновый сок',
        'milkshake': 'Молочный коктейль',
        'protein-milk': 'Протеин на молоке',
        'iced-latte': 'Айс Латте',
        'tea': 'Чай',
        'syrup': 'Сироп'
    },
    drinkKeyMapping: {
        'эспрессо': 'espresso',
        'капучино': 'cappuccino',
        'латте': 'latte',
        'раф-лавандовый': 'raf-lavender',
        'клубничный-мохито': 'strawberry-mojito',
        'апельсиновый-сок': 'orange-juice',
        'молочный-коктейль': 'milkshake',
        'протеин-на-молоке': 'protein-milk',
        'айс-латте': 'iced-latte',
        'чай': 'tea',
        'сироп': 'syrup'
    },
    about: {
        description: 'ProBarista — это место, где ценят уют, вкус и заботу о гостях. Мы готовим кофе с любовью, украшаем зал живыми цветами и всегда рады видеть вас с друзьями, семьёй или любимым котом!',
        features: [
            { icon: 'fas fa-coffee', title: 'Свежий кофе', description: 'Обжариваем зерна каждую неделю' },
            { icon: 'fas fa-heart', title: 'С любовью', description: 'Внимание к каждой детали' },
            { icon: 'fas fa-paw', title: 'Пет-френдли', description: 'Добро пожаловать с питомцами' }
        ]
    },
    contacts: {
        addresses: [
            'Санкт-Петербург, ул. Тверская, 50',
            'Санкт-Петербург, ул. Солдата Корзуна, 1к2'
        ],
        phone: '+7 (777) 777-77-77',
        email: 'info@probarista.ru',
        hours: [
            'Пн-Пт: 10:00 - 21:00',
            'Сб-Вс: 10:00 - 20:00'
        ]
    },
    footer: {
        brand: 'ProBarista',
        tagline: 'Ваш уютный уголок для кофе',
        socialLinks: [
            { platform: 'facebook', href: '#' },
            { platform: 'instagram', href: '#' },
            { platform: 'twitter', href: '#' }
        ],
        copyright: '© 2025 ProBarista.'
    }
};