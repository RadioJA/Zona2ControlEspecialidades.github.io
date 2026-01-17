import express from 'express';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import db from '../database.js';

const router = express.Router();

// GET /api/exam-results - Obtener todos los resultados de exámenes
router.get('/', async (req, res) => {
    try {
        const examResultsRef = collection(db, 'exam_results');
        const q = query(examResultsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const examResults = [];
        querySnapshot.forEach((doc) => {
            examResults.push({ id: doc.id, ...doc.data() });
        });
        res.json(examResults);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/exam-results/:id - Obtener resultado de examen por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const examResultDoc = await getDoc(doc(db, 'exam_results', id));
        if (!examResultDoc.exists()) {
            return res.status(404).json({ error: 'Resultado de examen no encontrado' });
        }
        res.json({ id: examResultDoc.id, ...examResultDoc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/exam-results - Crear nuevo resultado de examen
router.post('/', async (req, res) => {
    try {
        const { userName, title, score, totalQuestions, answers } = req.body;

        if (!userName || !title || score === undefined || !totalQuestions) {
            return res.status(400).json({ error: 'userName, title, score y totalQuestions son requeridos' });
        }

        const date = new Date().toISOString();

        const docRef = await addDoc(collection(db, 'exam_results'), {
            userName,
            title,
            score,
            totalQuestions,
            date,
            answers: answers || ''
        });

        res.status(201).json({
            id: docRef.id,
            userName,
            title,
            score,
            totalQuestions,
            date,
            answers: answers || ''
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/exam-results/:id - Actualizar resultado de examen
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userName, title, score, totalQuestions, answers } = req.body;

        if (!userName || !title || score === undefined || !totalQuestions) {
            return res.status(400).json({ error: 'userName, title, score y totalQuestions son requeridos' });
        }

        const examResultDoc = await getDoc(doc(db, 'exam_results', id));
        if (!examResultDoc.exists()) {
            return res.status(404).json({ error: 'Resultado de examen no encontrado' });
        }

        await updateDoc(doc(db, 'exam_results', id), {
            userName,
            title,
            score,
            totalQuestions,
            answers: answers || ''
        });

        res.json({
            id,
            userName,
            title,
            score,
            totalQuestions,
            answers: answers || ''
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
