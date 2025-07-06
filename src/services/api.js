// --- MOCK API SERVICE ---
// This file simulates a real API for the hotel booking app.

const mockRooms = [
  {
    id: 'deluxe-101',
    title: 'Deluxe Queen Room',
    description: 'A spacious 40sqm room with a queen-sized bed, perfect for couples. Enjoy stunning city views and a modern, elegant design.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'suite-202',
    title: 'Executive King Suite',
    description: 'Experience luxury in our 70sqm suite, featuring a separate living area and a plush king-sized bed. Includes access to the executive lounge.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'family-303',
    title: 'Family Room with Two Double Beds',
    description: 'Ideal for families, this 55sqm room offers two double beds, a comfortable seating area, and plenty of space for everyone.',
    price: 360,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop',
  },
];

let mockBookings = [
    {
        bookingId: 'BK12345',
        roomId: 'deluxe-101',
        roomTitle: 'Deluxe Queen Room',
        checkIn: '2025-08-15',
        checkOut: '2025-08-18',
        totalPrice: 915.60, // 280 * 3 * 1.09
        guestDetails: { name: 'John Doe', email: 'john.doe@example.com' },
        status: 'upcoming'
    },
    {
        bookingId: 'BK67890',
        roomId: 'suite-202',
        roomTitle: 'Executive King Suite',
        checkIn: '2024-05-20',
        checkOut: '2024-05-22',
        totalPrice: 981.00, // 450 * 2 * 1.09
        guestDetails: { name: 'Jane Smith', email: 'jane.smith@example.com' },
        status: 'past'
    }
];


// --- API Functions ---

// Simulate user login
export const loginUser = (userId, password) => {
  console.log("API: Attempting login...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 'testuser' && password === 'password') {
        resolve({ success: true, message: 'Login successful' });
      } else {
        reject({ success: false, message: 'Your user ID and/or password does not match' });
      }
    }, 500);
  });
};

// Simulate searching for rooms
export const searchRooms = (searchParams) => {
    console.log("API: Searching rooms with params...", searchParams);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockRooms)));
        }, 500);
    });
};

// Simulate fetching details for a single room
export const getRoomDetails = (roomId) => {
    console.log("API: Fetching details for room...", roomId);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const room = mockRooms.find(r => r.id === roomId);
            if (room) {
                resolve(JSON.parse(JSON.stringify(room)));
            } else {
                reject(new Error("Room not found"));
            }
        }, 300);
    });
};

// Simulate creating a booking
export const createBooking = (bookingDetails) => {
    console.log("API: Creating booking with details...", bookingDetails);
    return new Promise(resolve => {
        setTimeout(() => {
            const newBooking = {
                ...bookingDetails,
                bookingId: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'upcoming'
            };
            mockBookings.push(newBooking);
            resolve(newBooking);
        }, 500);
    });
};

// Simulate fetching user's bookings
export const getUserBookings = () => {
    console.log("API: Fetching user bookings...");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockBookings)));
        }, 500);
    });
};

// Simulate cancelling a booking
export const cancelBooking = (bookingId) => {
    console.log("API: Cancelling booking...", bookingId);
    return new Promise(resolve => {
        setTimeout(() => {
            const booking = mockBookings.find(b => b.bookingId === bookingId);
            if (booking) {
                booking.status = 'cancelled';
            }
            resolve({ success: true });
        }, 500);
    });
};
