import express from 'express';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import db from '../database.js';

const router = express.Router();

// GET /api/certificate-configs - Obtener todas las configuraciones
router.get('/', async (req, res) => {
    try {
        const certificateConfigsRef = collection(db, 'certificate_configs');
        const q = query(certificateConfigsRef, orderBy('updated_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const certificateConfigs = [];
        querySnapshot.forEach((doc) => {
            certificateConfigs.push({ id: doc.id, ...doc.data() });
        });
        res.json(certificateConfigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/certificate-configs/:key - Obtener configuración por clave
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const configDoc = await getDoc(doc(db, 'certificate_configs', key));
        if (!configDoc.exists()) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        res.json({ id: configDoc.id, ...configDoc.data() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/certificate-configs - Crear nueva configuración
router.post('/', async (req, res) => {
    try {
        const { config_key, config_value } = req.body;

        if (!config_key) {
            return res.status(400).json({ error: 'config_key es requerido' });
        }

        const updated_at = new Date().toISOString();

        await setDoc(doc(db, 'certificate_configs', config_key), {
            config_value: config_value || '',
            updated_at
        });

        res.status(201).json({
            id: config_key,
            config_key,
            config_value: config_value || '',
            updated_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/certificate-configs/:key - Actualizar configuración
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { config_value } = req.body;

        const configDoc = await getDoc(doc(db, 'certificate_configs', key));
        if (!configDoc.exists()) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }

        const updated_at = new Date().toISOString();
        await updateDoc(doc(db, 'certificate_configs', key), {
            config_value: config_value || '',
            updated_at
        });

        res.json({
            config_key: key,
            config_value: config_value || '',
            updated_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

export default router;
