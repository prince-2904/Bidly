// api/_lib/firebase.js

import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors during hot-reloads
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Vercel handles multiline env vars, but local might need replacement
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin Initialized.');
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue; 
