const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/exams - Obtener todos los exámenes
router.get('/', (req, res) => {
    db.all('SELECT * FROM exams ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Parse questions JSON
        rows.forEach(row => {
            if (row.questions) {
                row.questions = JSON.parse(row.questions);
            }
        });
        res.json(rows);
    });
});

// GET /api/exams/active - Obtener exámenes activos
router.get('/active', (req, res) => {
    db.all('SELECT * FROM exams WHERE active = 1 ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        rows.forEach(row => {
            if (row.questions) {
                row.questions = JSON.parse(row.questions);
            }
        });
        res.json(rows);
    });
});

// GET /api/exams/:id - Obtener examen por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM exams WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        if (row.questions) {
            row.questions = JSON.parse(row.questions);
        }
        res.json(row);
    });
});

// POST /api/exams - Crear nuevo examen
router.post('/', (req, res) => {
    const { title, questions, image, max_attempts } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Título y preguntas son requeridos' });
    }

    const questionsJson = JSON.stringify(questions);
    const created_at = new Date().toISOString();
    const maxAttempts = max_attempts || 1;

    db.run('INSERT INTO exams (title, questions, image, active, max_attempts, created_at) VALUES (?, ?, ?, 0, ?, ?)',
        [title, questionsJson, image || '', maxAttempts, created_at],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                title,
                questions,
                image: image || '',
                active: false,
                max_attempts: maxAttempts,
                created_at
            });
        });
});

// PUT /api/exams/:id/toggle - Activar/desactivar examen
router.put('/:id/toggle', (req, res) => {
    const { id } = req.params;

    // First get current status
    db.get('SELECT active FROM exams WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        const newActive = row.active ? 0 : 1;

        db.run('UPDATE exams SET active = ? WHERE id = ?', [newActive, id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: parseInt(id), active: !!newActive });
        });
    });
});

// DELETE /api/exams/:id - Eliminar examen
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM exams WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        res.json({ message: 'Examen eliminado exitosamente' });
    });
});

module.exports = router;
