const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/users - Obtener todos los usuarios
router.get('/', (req, res) => {
    db.all('SELECT id, nombre, email, rol, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, nombre, email, rol, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(row);
    });
});

// POST /api/users - Crear nuevo usuario
router.post('/', (req, res) => {
    const { nombre, email, rol } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(409).json({ error: 'Usuario ya existe con este email' });
        }

        const created_at = new Date().toISOString();
        const userRol = rol || 'user';

        db.run('INSERT INTO users (nombre, email, rol, created_at) VALUES (?, ?, ?, ?)',
            [nombre, email, userRol, created_at],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({
                    id: this.lastID,
                    nombre,
                    email,
                    rol: userRol,
                    created_at
                });
            });
    });
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    db.run('UPDATE users SET nombre = ?, email = ?, rol = ? WHERE id = ?',
        [nombre, email, rol || 'user', id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({
                id: parseInt(id),
                nombre,
                email,
                rol: rol || 'user'
            });
        });
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
});

// POST /api/users/login - Simular login (solo para compatibilidad con frontend)
router.post('/login', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email es requerido' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({
            id: row.id,
            nombre: row.nombre,
            email: row.email,
            rol: row.rol
        });
    });
});

module.exports = router;
