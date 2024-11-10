document.addEventListener('DOMContentLoaded', () => {
    const destinationsGrid = document.getElementById('destinations-grid');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const countryFilter = document.getElementById('country-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortOptions = document.getElementById('sort-options');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close');
    const wrapper = document.querySelector('.wrapper');
    const errorMessage = document.getElementById('error-message');
    const noneMessage = document.getElementById('none-message');

    let destinations = [];

    // Завантаження даних з файлу 14-destinations.json
    fetch('14-destinations.json')
        .then(response => response.json())
        .then(data => {
            destinations = data;
            displayDestinations(destinations);
            populateCountryFilter(destinations);
        })
        .catch(error => {
            alert('Помилка завантаження даних. Спробуйте пізніше.');
            errorMessage.style.display = 'block';
        });

    // Відображення напрямків
    function displayDestinations(destinations) {
        destinationsGrid.innerHTML = '';
        if (destinations.length === 0) {
            noneMessage.style.display = 'block';
        } else {
            noneMessage.style.display = 'none';
        }
        destinations.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h2>${destination.name}</h2>
                <p>${destination.country}</p>
                <p>${destination.category}</p>
                <p>${destination.description}</p>
                <div class="rating">${getStars(destination.rating)}</div>
            `;
            card.addEventListener('click', () => openModal(destination));
            destinationsGrid.appendChild(card);
        });
    }

    // Перетворення рейтингу у зірочки
    function getStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    }

    // Заповнення фільтра за країнами
    function populateCountryFilter(destinations) {
        const countries = [...new Set(destinations.map(destination => destination.country))];
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    }

    // Відкриття модального вікна
    function openModal(destination) {
        modalContent.innerHTML = `
            <h2>${destination.name}</h2>
            <p><strong>Країна:</strong> ${destination.country}</p>
            <p><strong>Категорія:</strong> ${destination.category}</p>
            <p><strong>Опис:</strong> ${destination.description}</p>
            <p><strong>Визначні місця:</strong> ${destination.attractions.join(', ')}</p>
        `;
        modal.style.display = 'block';
        wrapper.classList.add('blur'); // Додаємо клас для блюру
    }

    // Закриття модального вікна
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        wrapper.classList.remove('blur'); // Видаляємо клас для блюру
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            wrapper.classList.remove('blur'); // Видаляємо клас для блюру
        }
    });

    // Фільтрація та пошук напрямків
    searchInput.addEventListener('input', filterDestinations);
    categoryFilter.addEventListener('change', filterDestinations);
    countryFilter.addEventListener('change', filterDestinations);
    ratingFilter.addEventListener('input', filterDestinations);
    sortOptions.addEventListener('change', filterDestinations);

    function filterDestinations() {
        let filteredDestinations = destinations;

        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedCountry = countryFilter.value;
        const minRating = ratingFilter.value;

        if (searchText) {
            filteredDestinations = filteredDestinations.filter(destination =>
                destination.name.toLowerCase().includes(searchText)
            );
        }

        if (selectedCategory) {
            filteredDestinations = filteredDestinations.filter(destination =>
                destination.category === selectedCategory
            );
        }

        if (selectedCountry) {
            filteredDestinations = filteredDestinations.filter(destination =>
                destination.country === selectedCountry
            );
        }

        if (minRating) {
            filteredDestinations = filteredDestinations.filter(destination =>
                destination.rating >= minRating
            );
        }

        const sortOption = sortOptions.value;
        if (sortOption === 'name-asc') {
            filteredDestinations.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'name-desc') {
            filteredDestinations.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === 'rating-asc') {
            filteredDestinations.sort((a, b) => a.rating - b.rating);
        } else if (sortOption === 'rating-desc') {
            filteredDestinations.sort((a, b) => b.rating - a.rating);
        }

        displayDestinations(filteredDestinations);
    }
});