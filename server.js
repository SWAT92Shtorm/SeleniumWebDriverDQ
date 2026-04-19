// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const DATA_FILE = path.join(process.cwd(), 'data', 'players.json');

// Важно: разрешить читать JSON из тела запроса
app.use(express.json());

// Загрузка текущих данных (GET /api/players)
app.get('/api/players', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read players.json' });
  }
});

// Сохранение игроков и истории (POST /api/savePlayers)
app.post('/api/savePlayers', (req, res) => {
  const { playersByHall, historyByDate } = req.body;

  const data = {
    playersByHall: playersByHall || { hall1: [], hall2: [] },
    historyByDate: historyByDate || {}
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  res.json({ success: true, message: 'Players saved' });
});

// Важно для Railway: использовать PORT из переменной среды
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});