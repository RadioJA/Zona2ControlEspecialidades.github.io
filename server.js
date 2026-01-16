const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const db = require('./database');
const { initializeDatabase } = require('./database');

// Routes
const examRoutes = require('./routes/exams');
const examResultRoutes = require('./routes/examResults');
const userRoutes = require('./routes/users');
const certificateConfigRoutes = require('./routes/certificateConfigs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize database
initializeDatabase();

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
