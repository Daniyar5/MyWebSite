const imagesBlock = document.getElementById('images');
const loginBtn = document.getElementById('login-btn');
const regBtn = document.getElementById('reg-btn');
const aboutBtn = document.getElementById('about-btn');


// РЕНДЕР РЕГИСТРАЦИИ
regBtn.onclick = () => {
    imagesBlock.innerHTML = `
        <h2>Регистрация</h2>
        <input type="text" id="reg-login" placeholder="Логин"><br><br>
        <input type="password" id="reg-pass" placeholder="Пароль"><br><br>
        <button id="reg-submit" class="button">Зарегистрироваться<t/buton>
    `;

    document.getElementById('reg-submit').onclick = () => {
        const login = document.getElementById('reg-login').value;
        const pass = document.getElementById('reg-pass').value;

        if (!login || !pass) {
            alert("Заполни все поля");
            return;
        }

        localStorage.setItem(login, pass);
        alert("Регистрация успешна");
    };
};

// РЕНДЕР ВХОДА
loginBtn.onclick = () => {
    imagesBlock.innerHTML = `
        <h2>Вход</h2>
        <input type="text" id="log-login" placeholder="Логин"><br><br>
        <input type="password" id="log-pass" placeholder="Пароль"><br><br>
        <button id="log-submit" class="button">Войти</button>
    `;

    document.getElementById('log-submit').onclick = () => {
        const login = document.getElementById('log-login').value;
        const pass = document.getElementById('log-pass').value;

        const savedPass = localStorage.getItem(login);

        if (savedPass === pass) {
            imagesBlock.innerHTML = `<h2>Добро пожаловать, ${login} 😎</h2>`;
        } else {
            alert("Неверный логин или пароль");
        }
    };
};


// РЕНДЕР О САЙТЕ
aboutBtn.onclick = () => {
    imagesBlock.innerHTML = `
        <h2>О САЙТЕ</h2>
        Сайт с мемами <br><br>
        Автор сайта: Омурбеков Данияр Бакытбекович <br>
    `;

};