const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./api/data/data.json', 'utf-8'));
    res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
