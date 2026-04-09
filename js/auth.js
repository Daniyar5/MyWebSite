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
    
};

// РЕНДЕР ВХОДА
loginBtn.onclick = () => {
    imagesBlock.innerHTML = `
        <h2>Вход</h2>
        <input type="text" id="log-login" placeholder="Логин"><br><br>
        <input type="password" id="log-pass" placeholder="Пароль"><br><br>
        <button id="log-submit" class="button">Войти</button>
    `;

};


// РЕНДЕР О САЙТЕ
aboutBtn.onclick = () => {
    imagesBlock.innerHTML = `
        <h2>О САЙТЕ</h2>
        Сайт с мемами <br><br>
        Автор сайта: Омурбеков Данияр Бакытбекович <br>
        Номер: +996 555 000819
    `;

};