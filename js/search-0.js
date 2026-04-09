const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const mainBlock = document.getElementById('images');
const randomMemeBtn = document.getElementById('randomMeme-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

// Твой API Ключ Giphy
const API_KEY = 'SJjMvRfscMm8pNMCJZ8N3Q3LFXbAVDGY';

let currentQuery = ''; 
let history = []; 
let currentIndex = -1; 
let offset = 0; // Для подгрузки следующих гифок

async function loadMemes(query = '', isNewSearch = true) {
    mainBlock.innerHTML = '<h3 style="padding: 20px;">Ищем крутые гифки... 🎬</h3>';
    window.scrollTo(0, 0);

    if (isNewSearch) {
        offset = 0;
        history = []; // Очищаем историю при новом поиске
        currentIndex = -1; 
    } else {
        offset += 10;
    }

    let apiUrl = '';
    
    if (query) {
        // Если есть запрос — ищем по слову
        apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=10&offset=${offset}&rating=g`;
    } else {
        // Если запроса нет — берем популярное (Trending)
        apiUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=10&offset=${offset}&rating=g`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Ошибка сети');
        const json = await response.json();
        const gifs = json.data;

        if (gifs.length === 0) {
            mainBlock.innerHTML = `<h3 style="padding: 20px;">Ничего не нашлось :(</h3>`;
            return;
        }

        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ:
        // Добавляем новые гифки в историю и двигаем индекс вперед
        history.push(gifs);
        currentIndex++;
        
        displayMemes(gifs);
        updateButtons();

    } catch (error) {
        console.error(error);
        mainBlock.innerHTML = `<h3 style="padding: 20px;">Ошибка API.</h3>`;
    }
}

function displayMemes(gifs) {
    mainBlock.innerHTML = ''; 
    gifs.forEach(gif => {
        const img = document.createElement('img');
        // Используем fixed_height, чтобы гифки были примерно одного размера и быстрее грузились
        img.src = gif.images.fixed_height.url; 
        img.className = 'meme-image';
        img.loading = "lazy";
        mainBlock.appendChild(img);
    });
}

function updateButtons() {
    prevBtn.disabled = currentIndex <= 0;
    // Кнопка вперед активна всегда (либо для перехода по истории, либо для загрузки новых)
    nextBtn.disabled = false; 
}

// Поиск по слову
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    history = []; 
    currentIndex = -1;
    loadMemes(currentQuery, true);
});

// Кнопка Тренды (вместо рандома)
randomMemeBtn.addEventListener('click', () => {
    currentQuery = ''; 
    searchInput.value = '';
    history = [];
    currentIndex = -1;
    loadMemes('', true); 
});

// Кнопка Вперед
nextBtn.addEventListener('click', () => {
    // Если в истории есть следующая страница — просто показываем её
    if (currentIndex < history.length - 1) {
        currentIndex++;
        displayMemes(history[currentIndex]);
        updateButtons();
    } else {
        // Если страниц в истории больше нет — качаем новые из API
        loadMemes(currentQuery, false);
    }
});

// Кнопка Назад
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayMemes(history[currentIndex]);
        updateButtons();
    }
});

// Запуск при загрузке страницы
loadMemes();