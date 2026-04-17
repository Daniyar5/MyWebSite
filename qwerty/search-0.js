const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const mainBlock = document.getElementById('main');
const randomMemeBtn = document.getElementById('random-meme');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

// Список разных источников мемов (сабреддиты)
// Чем больше здесь названий, тем меньше повторов!
const memeSubreddits = [
    'memes', 'dankmemes', 'me_irl', 'wholesomememes', 
    'AdviceAnimals', 'MemeEconomy', 
    'PrequelMemes', 'terriblefacebookmemes', 'funny',
    'hmmm', 'okbuddyretard', 'surrealmemes', 'cat', 'cats',
    'doge', 'meme', 'AntiMemes', 'Catmemes', 'CryingCatMemes',
    'darksouls'
];

let currentQuery = ''; 
let history = []; 
let currentIndex = -1; 

async function loadMemes(query = '', isNewSearch = true) {
    mainBlock.innerHTML = '<h3 style="padding: 20px;">Ищем что-то новенькое... 🎲</h3>';
    window.scrollTo(0, 0);

    // ФИШКА ДЛЯ СЛУЧАЙНОСТИ:
    // Если пользователь не ввел тему, выбираем случайную тему из нашего списка
    let finalQuery = query;
    if (!query) {
        const randomIndex = Math.floor(Math.random() * memeSubreddits.length);
        finalQuery = memeSubreddits[randomIndex];
    }

    // Добавляем случайное число (timestamp) в конец ссылки, 
    // чтобы браузер не выдавал старую картинку из памяти (кэша)
    const apiUrl = `https://meme-api.com/gimme/${finalQuery}/5?nocache=${Date.now()}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Ошибка');
        const data = await response.json();

        if (isNewSearch) {
            history.push(data.memes);
            currentIndex++;
        }
        
        displayMemes(data.memes);
        updateButtons();

    } catch (error) {
        mainBlock.innerHTML = `<h3 style="padding: 20px;">Этот раздел временно недоступен. Нажмите "Случайный мем" еще раз!</h3>`;
    }
}

function displayMemes(memes) {
    mainBlock.innerHTML = ''; 
    memes.forEach(meme => {
        const img = document.createElement('img');
        img.src = meme.url;
        img.className = 'meme-image';
        img.loading = "lazy"; // Картинки будут грузиться по мере прокрутки
        mainBlock.appendChild(img);
    });
}

function updateButtons() {
    prevBtn.disabled = currentIndex <= 0;
}

// Поиск по конкретной теме
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    history = []; 
    currentIndex = -1;
    loadMemes(currentQuery);
});

// Настоящий рандом
randomMemeBtn.addEventListener('click', () => {
    currentQuery = ''; // Сбрасываем тему
    searchInput.value = '';
    history = [];
    currentIndex = -1;
    loadMemes(); // Функция сама выберет случайный сабреддит
});

// Кнопка Вперед (берет еще пачку из случайного или текущего раздела)
nextBtn.addEventListener('click', () => {
    loadMemes(currentQuery);
});

// Кнопка Назад
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayMemes(history[currentIndex]);
        updateButtons();
    }
});

loadMemes();