const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/exam-results - Obtener todos los resultados de exámenes
router.get('/', (req, res) => {
    db.all('SELECT * FROM exam_results ORDER BY date DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /api/exam-results/:id - Obtener resultado de examen por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM exam_results WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Resultado de examen no encontrado' });
        }
        res.json(row);
    });
});

// POST /api/exam-results - Crear nuevo resultado de examen
router.post('/', (req, res) => {
    const { userName, title, score, totalQuestions, answers } = req.body;

    if (!userName || !title || score === undefined || !totalQuestions) {
        return res.status(400).json({ error: 'userName, title, score y totalQuestions son requeridos' });
    }

    const date = new Date().toISOString();
    db.run('INSERT INTO exam_results (userName, title, score, totalQuestions, date, answers) VALUES (?, ?, ?, ?, ?, ?)',
        [userName, title, score, totalQuestions, date, answers || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                userName,
                title,
                score,
                totalQuestions,
                date,
                answers: answers || ''
            });
        });
});

// PUT /api/exam-results/:id - Actualizar resultado de examen
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { userName, title, score, totalQuestions, answers } = req.body;

    if (!userName || !title || score === undefined || !totalQuestions) {
        return res.status(400).json({ error: 'userName, title, score y totalQuestions son requeridos' });
    }

    db.run('UPDATE exam_results SET userName = ?, title = ?, score = ?, totalQuestions = ?, answers = ? WHERE id = ?',
        [userName, title, score, totalQuestions, answers || '', id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Resultado de examen no encontrado' });
            }
            res.json({
                id: parseInt(id),
                userName,
                title,
                score,
                totalQuestions,
                answers: answers || ''
            });
        });
});

// DELETE /api/exam-results/:id - Eliminar resultado de examen
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM exam_results WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Resultado de examen no encontrado' });
        }
        res.json({ message: 'Resultado de examen eliminado exitosamente' });
    });
});

module.exports = router;
