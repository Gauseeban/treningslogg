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

// Hent alle unike øvelsesnavn (til dropdown)
app.get('/ovelser', (req, res) => {
    const rows = db.prepare('SELECT DISTINCT ovelse FROM okter ORDER BY ovelse ASC').all();
    res.json(rows.map(r => r.ovelse));
});

// Hent statistikk for en gitt øvelse, sortert kronologisk 
app.get('/stats/:ovelse', (req, res) => {
    const { ovelse } = req.params;
    const rows = db.prepare('SELECT dato, vekt, reps, sett FROM okter WHERE ovelse = ? ORDER BY dato ASC').all(ovelse);
    res.json(rows);
});

app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});