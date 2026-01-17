import express from 'express';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import db from '../database.js';

const router = express.Router();

// GET /api/exams - Obtener todos los exámenes
router.get('/', async (req, res) => {
    try {
        const examsRef = collection(db, 'exams');
        const q = query(examsRef, orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const exams = [];
        querySnapshot.forEach((doc) => {
            exams.push({ id: doc.id, ...doc.data() });
        });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/exams/active - Obtener exámenes activos
router.get('/active', async (req, res) => {
    try {
        const examsRef = collection(db, 'exams');
        const q = query(examsRef, where('active', '==', true), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const exams = [];
        querySnapshot.forEach((doc) => {
            exams.push({ id: doc.id, ...doc.data() });
        });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/exams/:id - Obtener examen por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const examDoc = await getDoc(doc(db, 'exams', id));
        if (!examDoc.exists()) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        res.json({ id: examDoc.id, ...examDoc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/exams - Crear nuevo examen
router.post('/', async (req, res) => {
    try {
        const { title, questions, image, max_attempts } = req.body;

        if (!title || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Título y preguntas son requeridos' });
        }

        const created_at = new Date().toISOString();
        const maxAttempts = max_attempts || 1;

        const docRef = await addDoc(collection(db, 'exams'), {
            title,
            questions,
            image: image || '',
            active: false,
            max_attempts: maxAttempts,
            created_at
        });

        res.status(201).json({
            id: docRef.id,
            title,
            questions,
            image: image || '',
            active: false,
            max_attempts: maxAttempts,
            created_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/exams/:id/toggle - Activar/desactivar examen
router.put('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;

        const examDoc = await getDoc(doc(db, 'exams', id));
        if (!examDoc.exists()) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        const currentActive = examDoc.data().active;
        const newActive = !currentActive;

        await updateDoc(doc(db, 'exams', id), {
            active: newActive
        });

        res.json({ id, active: newActive });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/exams/:id - Eliminar examen
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const examDoc = await getDoc(doc(db, 'exams', id));
        if (!examDoc.exists()) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        await deleteDoc(doc(db, 'exams', id));
        res.json({ message: 'Examen eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
