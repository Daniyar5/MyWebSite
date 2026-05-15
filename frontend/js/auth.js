const authControls = document.getElementById('auth-controls');
const modal = document.getElementById('auth-modal');
const closeBtn = document.querySelector('.close-btn');
const authForm = document.getElementById('auth-form');
const modalTitle = document.getElementById('modal-title');
const authSubmit = document.getElementById('auth-submit');
const authError = document.getElementById('auth-error');
const myLikesBtn = document.getElementById('my-likes-btn');
const aboutBtn = document.getElementById('about-btn');
const imagesBlock = document.getElementById('images');

let isLoginMode = true;

function updateAuthUI() {
    const token = localStorage.getItem('token');
    const login = localStorage.getItem('username');

    if (token) {
        authControls.innerHTML = `
            <span style="color:white; margin-right: 15px; font-size: 16px;">Привет, <b>${login}</b>!</span>
            <button id="logout-btn" style="background: #e74c3c;">Выход</button>
        `;
        if(myLikesBtn) myLikesBtn.style.display = 'inline-block';
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            updateAuthUI();
            if(typeof loadMemes === 'function') loadMemes('', true); 
        });
    } else {
        authControls.innerHTML = `
            <button id="login-btn">Вход</button>
            <button id="reg-btn" style="background: #27ae60;">Регистрация</button>
        `;
        if(myLikesBtn) myLikesBtn.style.display = 'none';
        
        document.getElementById('login-btn').addEventListener('click', () => openModal(true));
        document.getElementById('reg-btn').addEventListener('click', () => openModal(false));
    }
}

function openModal(loginMode) {
    isLoginMode = loginMode;
    modalTitle.textContent = isLoginMode ? 'Вход' : 'Регистрация';
    authSubmit.textContent = isLoginMode ? 'Войти' : 'Зарегистрироваться';
    authError.textContent = '';
    modal.style.display = 'block';
}

if(closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }

if(authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('auth-login').value;
        const password = document.getElementById('auth-pass').value;
        const endpoint = isLoginMode ? '/api/login' : '/api/register';

        try {
            const res = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            if (!isLoginMode) {
                openModal(true);
                authError.style.color = '#2ecc71';
                authError.textContent = 'Регистрация успешна! Войдите.';
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.login);
                modal.style.display = 'none';
                updateAuthUI();
                if(typeof loadMemes === 'function') loadMemes('', true);
            }
        } catch (err) {
            authError.style.color = '#e74c3c';
            authError.textContent = err.message;
        }
    });
}

if(aboutBtn) {
    aboutBtn.onclick = () => {
        imagesBlock.innerHTML = `
            <div style="padding: 30px; font-size: 18px;">
                <h2>О САЙТЕ</h2>
                <br>Сайт с мемами (Full-Stack версия)<br><br>
                Автор сайта: Омурбеков Данияр Бакытбекович <br>
                Номер: +996 555 000819
            </div>
        `;
    };
}

updateAuthUI();
