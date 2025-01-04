const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'docs')));

app.get('/docs', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./docs/data.json', 'utf-8'));
    res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
