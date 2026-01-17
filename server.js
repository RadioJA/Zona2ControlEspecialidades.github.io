import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import db from './database.js';

// Routes
import examRoutes from './routes/exams.js';
import examResultRoutes from './routes/examResults.js';
import userRoutes from './routes/users.js';
import certificateConfigRoutes from './routes/certificateConfigs.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Firebase initialized in database.js

// Routes
app.use('/api/exams', examRoutes);
app.use('/api/exam-results', examResultRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificate-configs', certificateConfigRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API de Proyecto Z2 funcionando correctamente' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
