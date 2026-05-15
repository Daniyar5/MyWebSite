const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'super_secret_meme_key_change_in_production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Доступ запрещен' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Неверный токен' });
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: 'Введите логин и пароль' });

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (login, password_hash) VALUES (?, ?)', [login, hash], function(err) {
            if (err) {
                return res.status(400).json({ error: 'Пользователь уже существует' });
            }
            res.status(201).json({ message: 'Регистрация успешна' });
        });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    
    db.get('SELECT * FROM users WHERE login = ?', [login], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'Неверный логин или пароль' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Неверный логин или пароль' });

        const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, login: user.login });
    });
});

app.post('/api/likes', authenticateToken, (req, res) => {
    const { gif_id, gif_url } = req.body;
    const user_id = req.user.id;

    db.get('SELECT * FROM likes WHERE user_id = ? AND gif_id = ?', [user_id, gif_id], (err, row) => {
        if (row) {
            db.run('DELETE FROM likes WHERE user_id = ? AND gif_id = ?', [user_id, gif_id]);
            res.json({ liked: false });
        } else {
            db.run('INSERT INTO likes (user_id, gif_id, gif_url) VALUES (?, ?, ?)', [user_id, gif_id, gif_url]);
            res.json({ liked: true });
        }
    });
});

app.get('/api/likes', authenticateToken, (req, res) => {
    db.all('SELECT gif_id, gif_url FROM likes WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
