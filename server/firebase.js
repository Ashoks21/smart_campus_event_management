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
    console.log('Checking Environment Variables:');
    console.log('- Project ID:', process.env.FIREBASE_PROJECT_ID ? 'PRESENT' : 'MISSING');
    console.log('- Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? 'PRESENT' : 'MISSING');
    console.log('- Private Key:', process.env.FIREBASE_PRIVATE_KEY ? 'PRESENT' : 'MISSING');

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
        try {
            // Clean up any accidental spaces or newlines from Render settings
            const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
            let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

            if (privateKey.includes('\\n')) {
                privateKey = privateKey.replace(/\\n/g, '\n');
            }
            
            // Clean up any extra quotes that might have been pasted
            privateKey = privateKey.replace(/^"|"$/g, '');

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                })
            });
            console.log('✅ Firebase initialized using environment variables');
            console.log('Key starts with:', privateKey.substring(0, 20) + '...');
        } catch (initErr) {
            console.error('❌ Firebase Init Error:', initErr.message);
        }
    } else {
        console.error('❌ Firebase initialization failed: Missing required environment variables.');
    }
}

const db = admin.firestore();

module.exports = { db, admin };
