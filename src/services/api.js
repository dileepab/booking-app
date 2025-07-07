// src/services/api.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
  setDoc, // Import setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// --- Authentication Functions ---

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// --- User Profile Functions ---

export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserProfile = (userId, profileData) => {
    const userRef = doc(db, 'users', userId);
    // Use setDoc with merge: true to create or update the document
    return setDoc(userRef, profileData, { merge: true });
};


// --- Room Functions ---

export const searchRooms = async () => {
  const roomsCollection = collection(db, 'rooms');
  const roomSnapshot = await getDocs(roomsCollection);
  return roomSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
};

export const getRoomDetails = async (roomId) => {
  const roomRef = doc(db, 'rooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (roomSnap.exists()) {
    return { id: roomSnap.id, ...roomSnap.data() };
  } else {
    throw new Error("Room not found");
  }
};

// --- Booking Functions ---

export const createBooking = async (bookingDetails) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Save/update the user's contact details to their profile
    await updateUserProfile(user.uid, bookingDetails.guestDetails);

    const bookingPayload = {
        ...bookingDetails,
        userId: user.uid,
        status: 'upcoming'
    };

  const bookingsCollection = collection(db, 'bookings');
  const docRef = await addDoc(bookingsCollection, bookingPayload);
  return { ...bookingPayload, bookingId: docRef.id };
};

export const getUserBookings = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const bookingsCollection = collection(db, 'bookings');
  const q = query(bookingsCollection, where("userId", "==", user.uid));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({bookingId: doc.id, ...doc.data()}));
};

export const cancelBooking = (bookingId) => {
  const bookingRef = doc(db, 'bookings', bookingId);
  return updateDoc(bookingRef, {
    status: 'cancelled'
  });
};
