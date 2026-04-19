// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';

// Выводим, что сервер стартует
console.log('✈️ Server starting...');

// Создаём Express‑приложение
const app = express();

// Убираем CORS, если он мешает (temp)
app.use(express.json());

// Путь к файлу
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'players.json');

console.log('📁 DATA_DIR:', DATA_DIR);
console.log('📄 DATA_FILE:', DATA_FILE);

// Создаём папку и файл, если их нет
if (!fs.existsSync(DATA_DIR)) {
  console.log('📁 Создаём data...');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  console.log('📄 Создаём players.json');
  const emptyData = { playersByHall: { hall1: [], hall2: [] }, historyByDate: {} };
  fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
}

// GET /api/players
app.get('/api/players', (req, res) => {
  console.log('🟢 GET /api/players');
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    console.log('  Содержимое:', data);
    res.json(JSON.parse(data || '{}'));
  } catch (err) {
    console.error('🔴 Ошибка чтения:', err.message);
    res.status(500).json({ error: 'Failed' });
  }
});

// Порт и запуск
const PORT = process.env.PORT || 3000;
console.log('🚀 Порт:', PORT);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
