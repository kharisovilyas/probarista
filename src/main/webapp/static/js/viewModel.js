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
        view.renderFooter();
        view.renderShoppingBag();
        this.initEventListeners();
        this.initMap();
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
    }
};