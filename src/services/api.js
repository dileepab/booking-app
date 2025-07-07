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
  setDoc,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// --- Authentication Functions ---
export const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);
export const getCurrentUser = () => new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, user => {
    unsubscribe();
    resolve(user);
  }, reject);
});

// --- User Profile Functions ---
export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};
export const updateUserProfile = (userId, profileData) => {
    const userRef = doc(db, 'users', userId);
    return setDoc(userRef, profileData, { merge: true });
};

// --- Room Functions ---
export const getRoomDetails = async (roomId) => {
  const roomRef = doc(db, 'rooms', roomId);
  const roomSnap = await getDoc(roomRef);
  if (roomSnap.exists()) {
    return { id: roomSnap.id, ...roomSnap.data() };
  } else {
    throw new Error("Room not found");
  }
};

// **FIX**: Updated searchRooms to handle sorting via Firestore query
export const searchRooms = async (lastVisibleDoc = null, roomsPerPage = 5, sortBy = 'lowest') => {
  const roomsCollection = collection(db, 'rooms');
  const sortOrder = sortBy === 'highest' ? 'desc' : 'asc';
  let q;

  if (lastVisibleDoc) {
    q = query(roomsCollection, orderBy('price', sortOrder), startAfter(lastVisibleDoc), limit(roomsPerPage));
  } else {
    q = query(roomsCollection, orderBy('price', sortOrder), limit(roomsPerPage));
  }

  const documentSnapshots = await getDocs(q);
  const roomList = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const newLastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  return { roomList, lastVisibleDoc: newLastVisible };
};

// --- Booking Functions ---
export const createBooking = async (bookingDetails) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const room = await getRoomDetails(bookingDetails.roomId);
    await updateUserProfile(user.uid, bookingDetails.guestDetails);
    const bookingPayload = {
        ...bookingDetails,
        userId: user.uid,
        status: 'upcoming',
        roomTitle: room.title,
        roomImage: room.image,
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
    const bookingsList = querySnapshot.docs.map(doc => ({ bookingId: doc.id, ...doc.data() }));
    return bookingsList;
};
export const cancelBooking = (bookingId) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    return updateDoc(bookingRef, {
        status: 'cancelled'
    });
};
