const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/certificate-configs - Obtener todas las configuraciones
router.get('/', (req, res) => {
    db.all('SELECT * FROM certificate_configs ORDER BY updated_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /api/certificate-configs/:key - Obtener configuración por clave
router.get('/:key', (req, res) => {
    const { key } = req.params;
    db.get('SELECT * FROM certificate_configs WHERE config_key = ?', [key], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        res.json(row);
    });
});

// POST /api/certificate-configs - Crear nueva configuración
router.post('/', (req, res) => {
    const { config_key, config_value } = req.body;

    if (!config_key) {
        return res.status(400).json({ error: 'config_key es requerido' });
    }

    const updated_at = new Date().toISOString();
    db.run('INSERT OR REPLACE INTO certificate_configs (config_key, config_value, updated_at) VALUES (?, ?, ?)',
        [config_key, config_value || '', updated_at],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                config_key,
                config_value: config_value || '',
                updated_at
            });
        });
});

// PUT /api/certificate-configs/:key - Actualizar configuración
router.put('/:key', (req, res) => {
    const { key } = req.params;
    const { config_value } = req.body;

    const updated_at = new Date().toISOString();
    db.run('UPDATE certificate_configs SET config_value = ?, updated_at = ? WHERE config_key = ?',
        [config_value || '', updated_at, key],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Configuración no encontrada' });
            }
            res.json({
                config_key: key,
                config_value: config_value || '',
                updated_at
            });
        });
});

// DELETE /api/certificate-configs/:key - Eliminar configuración
router.delete('/:key', (req, res) => {
    const { key } = req.params;

    db.run('DELETE FROM certificate_configs WHERE config_key = ?', [key], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        res.json({ message: 'Configuración eliminada exitosamente' });
    });
});

module.exports = router;
