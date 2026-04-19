// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Выводим, что сервер стартует
console.log('✈️ Server starting...');

// Создаём Express‑приложение
const app = express();

// Включаем CORS
app.use(cors({
  origin: [
    'https://swat92shtorm.github.io',
    'https://seleniumwebdriverdq-production.up.railway.app'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Читаем JSON из тела запроса
app.use(express.json());

// ------------ Путь к файлу players.json ------------
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'players.json');

console.log('📁 DATA_DIR:', DATA_DIR);
console.log('📄 DATA_FILE:', DATA_FILE);

// Создаём папку data, если её нет
if (!fs.existsSync(DATA_DIR)) {
  console.log('📁 Создаём папку data...');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Создаём players.json, если его нет
if (!fs.existsSync(DATA_FILE)) {
  console.log('📄 Создаём players.json (пустой JSON)');
  const emptyData = {
    playersByHall: { hall1: [], hall2: [] },
    historyByDate: {}
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
}

// ------------ Загрузка данных (GET /api/players) ------------
app.get('/api/players', (req, res) => {
  console.log('🟢 GET /api/players запрос получен');
  console.log('  Файл:', DATA_FILE);

  try {
    if (!fs.existsSync(DATA_FILE)) {
      console.log('  Файл players.json не найден, создаём пустой...');
      const emptyData = {
        playersByHall: { hall1: [], hall2: [] },
        historyByDate: {}
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
    }

    const data = fs.readFileSync(DATA_FILE, 'utf8');
    console.log('  Содержимое файла:', data);

    // Если файл пустой или битый — отдадим безопасный JSON
    if (!data.trim()) {
      console.log('  Файл пустой → возвращаем пустой JSON');
      return res.json({
        playersByHall: { hall1: [], hall2: [] },
        historyByDate: {}
      });
    }

    let json;

    try {
      json = JSON.parse(data);
    } catch (parseErr) {
      console.error('❌ Ошибка парсинга JSON:', parseErr.message);
      console.log('  Возвращаем пустой объект JSON');
      json = {
        playersByHall: { hall1: [], hall2: [] },
        historyByDate: {}
      };
      // Пере­запишем файл, чтобы починить его
      fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2), 'utf8');
    }

    res.json(json);

  } catch (err) {
    console.error('🔴 Ошибка при чтении/парсинге players.json:', err.message);
    res.status(500).json({
      error: 'Failed to read players.json',
      message: err.message
    });
  }
});

// ------------ Сохранение (POST /api/savePlayers) ------------
app.post('/api/savePlayers', (req, res) => {
  console.log('🟢 POST /api/savePlayers запрос получен');
  console.log('  Тело запроса:', req.body);

  const { playersByHall, historyByDate } = req.body;

  const data = {
    playersByHall: playersByHall || { hall1: [], hall2: [] },
    historyByDate: historyByDate || {}
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('  ✅ players.json сохранён');
    res.json({
      success: true,
      message: 'Players saved successfully'
    });

  } catch (err) {
    console.error('🔴 Ошибка записи players.json:', err.message);
    res.status(500).json({
      error: 'Failed to save players.json',
      message: err.message
    });
  }
});

// ------------ Порт и запуск сервера ------------
const PORT = process.env.PORT || 3000;
console.log('🚀 Порт:', PORT);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
