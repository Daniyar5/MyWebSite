// Подключаем библиотеку Express
const express = require('express');
const app = express();
const port = 3000;

// Это наша "база данных" (пока просто массив в памяти для примера)
const memes = [
  { id: 1, title: "Кот с блинами", url: "images/cat.jpg" },
  { id: 2, title: "Собака-подозревака", url: "images/doge.jpg" }
];

// Создаем маршрут (API endpoint)
app.get('/api/memes', (req, res) => {
  // Когда фронтенд обращается сюда, мы отдаем ему список мемов
  res.json(memes);
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});