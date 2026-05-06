const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath))
    });
    console.log('✅ Firebase initialized using serviceAccountKey.json');
} else {
    console.warn('⚠️ serviceAccountKey.json not found in server directory.');
    console.warn('Please follow the instructions to generate this file from Firebase Console.');
    
    // Fallback to individual env variables if they exist
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            })
        });
        console.log('✅ Firebase initialized using environment variables');
    } else {
        console.error('❌ Firebase initialization failed: Missing credentials.');
    }
}

const db = admin.firestore();

module.exports = { db, admin };
