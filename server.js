// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

console.log('Server starting...');

const app = express();

app.use(cors({
  origin: [
    'https://swat92shtorm.github.io',
    'https://seleniumwebdriverdq-production.up.railway.app'
  ]
}));

app.use(express.json());

// Путь к файлу с данными
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'players.json');

console.log('DATA_DIR:', DATA_DIR);
console.log('DATA_FILE:', DATA_FILE);

// Создать папку data, если её нет
if (!fs.existsSync(DATA_DIR)) {
  console.log('Creating DATA_DIR...');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Создать players.json, если его нет
if (!fs.existsSync(DATA_FILE)) {
  console.log('Creating initial players.json...');
  const emptyData = {
    playersByHall: { hall1: [], hall2: [] },
    historyByDate: {}
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
}

// Загрузка текущих данных (GET /api/players)
app.get('/api/players', (req, res) => {
  console.log('=== GET /api/players ===');
  console.log('DATA_FILE:', DATA_FILE);

  try {
    if (!fs.existsSync(DATA_FILE)) {
      console.log('Файл DATA_FILE не существует, создаю пустой...');
      const emptyData = {
        playersByHall: { hall1: [], hall2: [] },
        historyByDate: {}
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
    }

    const data = fs.readFileSync(DATA_FILE, 'utf8');
    console.log('Содержимое файла players.json:', data);

    const json = JSON.parse(data);
    res.json(json);

  } catch (err) {
    console.error('Ошибка при чтении/парсинге players.json:', err.message);
    res.status(500).json({ error: 'Failed to read players.json' });
  }
});

// Сохранение игроков и истории (POST /api/savePlayers)
app.post('/api/savePlayers', (req, res) => {
  console.log('=== POST /api/savePlayers ===');
  console.log('BODY ПРИШЁЛ:', req.body);

  const { playersByHall, historyByDate } = req.body;

  const data = {
    playersByHall: playersByHall || { hall1: [], hall2: [] },
    historyByDate: historyByDate || {}
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ success: true, message: 'Players saved' });
  } catch (err) {
    console.error('Failed to save players.json:', err.message);
    res.status(500).json({ error: 'Failed to save players.json' });
  }
});

// Важно для Railway: использовать PORT из переменной среды
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
