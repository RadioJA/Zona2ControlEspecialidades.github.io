// Firebase Admin SDK configuration
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account (you need to provide the key)
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Replace with actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://zona2especialidades-default-rtdb.firebaseio.com' // If using Realtime Database, or for Firestore it's not needed
});

const db = admin.firestore(); // For Firestore

module.exports = { admin, db };
