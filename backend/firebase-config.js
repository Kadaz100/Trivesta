const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let db, auth;

try {
  // Try to use service account file first, then fall back to env vars
  let credential;
  
    try {
    const serviceAccount = require('./firebase-credentials.json');
    credential = admin.credential.cert(serviceAccount);
  } catch (err) {
    console.log('Service account file not found, trying environment variables...');
    // Fall back to environment variables
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Handle different formats of private key
    if (privateKey) {
      // Remove quotes if present
      privateKey = privateKey.replace(/^["']|["']$/g, '');
      // Replace literal \n with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      console.log('Private key format check:', {
        hasBeginMarker: privateKey.includes('BEGIN PRIVATE KEY'),
        hasEndMarker: privateKey.includes('END PRIVATE KEY'),
        length: privateKey.length
      });
    }
    
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'trivesta-6de08',
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
    });
  }

  // Check if Firebase app is already initialized
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: credential,
      projectId: 'trivesta-6de08',
    });
    console.log('Firebase Admin initialized successfully');
  } else {
    console.log('Firebase Admin already initialized');
  }

  // Initialize Firestore with retry settings
  db = admin.firestore();
  
  // Configure Firestore settings for better connection handling
  db.settings({
    ignoreUndefinedProperties: true,
  });

  auth = admin.auth();
  
  console.log('Firestore and Auth initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  console.error('Error details:', error);
  
  // Try to initialize with minimal config
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = require('./firebase-credentials.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'trivesta-6de08',
      });
      db = admin.firestore();
      auth = admin.auth();
      console.log('Firebase initialized with fallback method');
    }
  } catch (fallbackError) {
    console.error('Fallback initialization also failed:', fallbackError.message);
  }
}

module.exports = { db, auth, admin };
