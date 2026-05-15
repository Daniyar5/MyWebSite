const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const mainBlock = document.getElementById('images');
const randomMemeBtn = document.getElementById('randomMeme-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const API_KEY = 'SJjMvRfscMm8pNMCJZ8N3Q3LFXbAVDGY';

let currentQuery = ''; 
let history = []; 
let currentIndex = -1; 
let offset = 0; 
let isLikesMode = false;

async function loadMemes(query = '', isNewSearch = true) {
    isLikesMode = false;
    mainBlock.innerHTML = '<h3 style="padding: 20px;">Ищем крутые гифки... 🎬</h3>';
    window.scrollTo(0, 0);

    if (isNewSearch) {
        offset = 0;
        history = [];
        currentIndex = -1; 
    } else {
        offset += 10;
    }

    let apiUrl = '';
    if (query) {
        apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=10&offset=${offset}&rating=g`;
    } else {
        apiUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=10&offset=${offset}&rating=g`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.data.length > 0) {
            if (isNewSearch || currentIndex === history.length - 1) {
                history.push(data.data);
                currentIndex++;
            }
            displayMemes(data.data);
            updateButtons();
        } else {
            mainBlock.innerHTML = '<h3 style="padding: 20px;">Ничего не найдено 😢</h3>';
        }
    } catch (error) {
        mainBlock.innerHTML = '<h3 style="padding: 20px;">Ошибка загрузки от Giphy</h3>';
    }
}

async function displayMemes(gifs) {
    mainBlock.innerHTML = ''; 
    let userLikes = [];
    const token = localStorage.getItem('token');
    
    // Получаем лайки пользователя, чтобы подкрасить сердечки
    if (token) {
        try {
            const res = await fetch('http://localhost:3000/api/likes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const likesData = await res.json();
                userLikes = likesData.map(l => l.gif_id);
            }
        } catch (e) {}
    }

    gifs.forEach(gif => {
        const card = document.createElement('div');
        card.className = 'meme-card';
        
        const gifUrl = gif.images ? gif.images.fixed_height.url : gif.gif_url;
        const gifId = gif.id || gif.gif_id;

        const img = document.createElement('img');
        img.src = gifUrl; 
        img.className = 'meme-image';
        img.loading = "lazy";

        const likeBtn = document.createElement('button');
        likeBtn.className = `like-btn ${userLikes.includes(gifId) ? 'liked' : ''}`;
        likeBtn.innerHTML = '❤';
        likeBtn.onclick = async () => toggleLike(gifId, gifUrl, likeBtn);

        card.appendChild(img);
        card.appendChild(likeBtn);
        mainBlock.appendChild(card);
    });
}

async function toggleLike(gif_id, gif_url, btnElement) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Пожалуйста, войдите в аккаунт, чтобы ставить лайки!');
        // Можно тут же открыть модалку: openModal(true);
        return;
    }
    
    try {
        const res = await fetch('http://localhost:3000/api/likes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ gif_id, gif_url })
        });
        const data = await res.json();
        
        if (data.liked) {
            btnElement.classList.add('liked');
        } else {
            btnElement.classList.remove('liked');
            // Если мы находимся во вкладке "Мои лайки", убираем картинку со страницы сразу
            if (isLikesMode) {
                btnElement.parentElement.remove();
                if(mainBlock.children.length === 0) {
                     mainBlock.innerHTML = '<h3 style="padding: 20px;">Больше нет лайков 💔</h3>';
                }
            }
        }
    } catch (e) {
        console.error('Ошибка лайка', e);
    }
}

document.getElementById('my-likes-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    isLikesMode = true;
    mainBlock.innerHTML = '<h3 style="padding: 20px;">Загружаем любимые мемы... ❤️</h3>';
    window.scrollTo(0, 0);
    
    try {
        const res = await fetch('http://localhost:3000/api/likes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const likes = await res.json();
        
        if (likes.length === 0) {
            mainBlock.innerHTML = '<h3 style="padding: 20px;">Вы еще ничего не лайкнули 💔</h3>';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }
        
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        displayMemes(likes);
    } catch (e) {
        mainBlock.innerHTML = '<h3 style="padding: 20px;">Убедитесь, что сервер (Node.js) запущен!</h3>';
    }
});

function updateButtons() {
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = false; 
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    loadMemes(currentQuery, true);
});

randomMemeBtn.addEventListener('click', () => {
    currentQuery = ''; 
    searchInput.value = '';
    loadMemes('', true); 
});

nextBtn.addEventListener('click', () => {
    if (isLikesMode) return;
    if (currentIndex < history.length - 1) {
        currentIndex++;
        displayMemes(history[currentIndex]);
        updateButtons();
    } else {
        loadMemes(currentQuery, false);
    }
});

prevBtn.addEventListener('click', () => {
    if (isLikesMode) return;
    if (currentIndex > 0) {
        currentIndex--;
        displayMemes(history[currentIndex]);
        updateButtons();
    }
});

const tags = document.querySelectorAll('aside b');
tags.forEach(tag => {
    tag.addEventListener('click', () => {
        const tagText = tag.innerText.replace('#', '').toLowerCase();
        searchInput.value = tagText;
        currentQuery = tagText;
        loadMemes(currentQuery, true);
    });
});

// Запуск при старте
loadMemes('', true);
