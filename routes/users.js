import express from 'express';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import db from '../database.js';

const router = express.Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userDoc = await getDoc(doc(db, 'users', id));
        if (!userDoc.exists()) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users - Crear nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, email, rol } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        // Check if user already exists
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return res.status(409).json({ error: 'Usuario ya existe con este email' });
        }

        const created_at = new Date().toISOString();
        const userRol = rol || 'user';

        const docRef = await addDoc(collection(db, 'users'), {
            nombre,
            email,
            rol: userRol,
            created_at
        });

        res.status(201).json({
            id: docRef.id,
            nombre,
            email,
            rol: userRol,
            created_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        const userDoc = await getDoc(doc(db, 'users', id));
        if (!userDoc.exists()) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await updateDoc(doc(db, 'users', id), {
            nombre,
            email,
            rol: rol || 'user'
        });

        res.json({
            id,
            nombre,
            email,
            rol: rol || 'user'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const userDoc = await getDoc(doc(db, 'users', id));
        if (!userDoc.exists()) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await deleteDoc(doc(db, 'users', id));
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users/login - Simular login (solo para compatibilidad con frontend)
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email es requerido' });
        }

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userDoc = querySnapshot.docs[0];
        res.json({
            id: userDoc.id,
            nombre: userDoc.data().nombre,
            email: userDoc.data().email,
            rol: userDoc.data().rol
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
