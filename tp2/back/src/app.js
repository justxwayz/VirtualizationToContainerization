const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors({ origin: 'http://localhost:8000' }));
app.use(express.json());

// Récupération des variables d'environnement
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'mylibrary_db';

// compteur global
let requestCount = 0;

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

// Fake DATA
let library = [
    { id: 1, title: "One Piece", link: "https://example.com", readingStatus: "A lire", chapterStatus: "En cours" },
    { id: 2, title: "Jujutsu Kaisen", link: "https://example.com", readingStatus: "Lu", chapterStatus: "Terminé" },
    { id: 3, title: "Demon Slayer", link: "https://example.com", readingStatus: "Lu", chapterStatus: "Terminé" },
    { id: 4, title: "Test1", link: "https://example.com", readingStatus: "A lire", chapterStatus: "En cours" },
    { id: 5, title: "Test2", link: "https://example.com", readingStatus: "A lire", chapterStatus: "Terminé" }
];

// Middleware de logs
app.use((req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ➡️  ${req.method} ${req.url} reçue`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        requestCount++;

        console.log(
            `[${new Date().toISOString()}] ⬅️  ${req.method} ${req.url} traitée | ` +
            `status=${res.statusCode} | ` +
            `time=${duration}ms | ` +
            `total_requests=${requestCount}`
        );
    });

    next();
});

// CRUD
app.get('/api/works', (req, res) => res.json(library));

app.post('/api/works', (req, res) => {
    const newWork = { id: Date.now(), ...req.body };
    library.push(newWork);
    res.status(201).json(newWork);
});

app.delete('/api/works/:id', (req, res) => {
    library = library.filter(w => w.id !== Number(req.params.id));
    res.sendStatus(204);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Back API running on http://localhost:${PORT}`);
    console.log(`Connecting to DB at ${DB_HOST}:${DB_PORT} as ${DB_USER}`);
});
