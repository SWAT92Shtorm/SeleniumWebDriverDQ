// server.js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Server works!');
});

app.get('/api/players', (req, res) => {
  res.json({
    playersByHall: { hall1: ['Player 1'], hall2: [] },
    historyByDate: {}
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('✅ Server listening on port', PORT);
});