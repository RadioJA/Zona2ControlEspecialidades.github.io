# Firebase Migration TODO

## Completed
- [x] Update package.json: Add firebase, remove sqlite3, add "type": "module"
- [x] Update database.js: Replace SQLite with Firebase Firestore initialization
- [x] Update routes/users.js: Convert all routes to use Firestore collections
- [x] Update server.js: Convert to ES modules, import routes

## Pending
- [ ] Update routes/exams.js: Convert to Firestore
- [ ] Update routes/examResults.js: Convert to Firestore
- [ ] Update routes/certificateConfigs.js: Convert to Firestore
- [ ] Install dependencies: npm install
- [ ] Test API endpoints
- [ ] Configure Firestore security rules if needed
