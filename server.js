const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3000;

// Статические файлы
app.use(express.static('.'));

// API для получения списка файлов
app.get('/audio/', async (req, res) => {
    try {
        const files = await fs.readdir('audio');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка чтения директории' });
    }
});

app.get('/pdf/', async (req, res) => {
    try {
        const files = await fs.readdir('pdf');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка чтения директории' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
}); 