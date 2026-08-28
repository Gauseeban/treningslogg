const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello fra treningslogg-serveren!');
});

app.get('/okter', (req, res) => {
    const okter = db.prepare('SELECT * FROM okter ORDER BY dato DESC').all();
    res.json(okter);
});

app.post('/okter', (req, res) => {
    const { ovelse, vekt, reps, sett, dato } = req.body;

    const stmt = db.prepare(
        'INSERT INTO okter (ovelse, vekt, reps, sett, dato) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(ovelse, vekt, reps, sett, dato);

    res.json({id: result.lastInsertRowid, ovelse, vekt, reps, sett, dato });
});

app.delete('/okter/:id', (req, res) => {
    const { id } = req.params; 

    const stmt = db.prepare('DELETE FROM okter WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Økt ikke funnet'});
    }

    res.json({ message: 'Økt slettet', id: Number(id) });
});

app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});