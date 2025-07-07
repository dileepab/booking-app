import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

// Import your service account key and room data
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');
const roomsData = require('./rooms.json');

// Initialize the Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const roomsCollection = db.collection('rooms');

async function uploadRooms() {
  console.log('Starting room data upload...');

  for (const room of roomsData) {
    // Use the 'id' from the JSON as the document ID in Firestore
    const docRef = roomsCollection.doc(room.id);

    // Create a new object without the 'id' field to store in the document
    const { id, ...roomDetails } = room;

    try {
      await docRef.set(roomDetails);
      console.log(`Successfully uploaded room: ${room.title} (ID: ${room.id})`);
    } catch (error) {
      console.error(`Error uploading room ${room.id}:`, error);
    }
  }

  console.log('Room data upload complete.');
}

uploadRooms();
