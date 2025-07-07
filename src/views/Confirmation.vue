<template>
  <BookingProcessLayout :active-step="4">
    <div class="confirmation-container">
      <div v-if="loading" class="status-message">
        <h2>Confirming your booking...</h2>
        <p>Please wait while we finalize your reservation.</p>
      </div>

      <div v-if="error" class="status-message error">
        <h2>Booking Failed</h2>
        <p>{{ error }}</p>
        <router-link to="/search" class="button-link">Try Again</router-link>
      </div>

      <div v-if="bookingResponse" class="confirmation-content">
        <div class="confirmation-header">
          <h2 class="title">YOUR BOOKING HAS BEEN CONFIRMED</h2>
          <p class="subtitle">We have sent your booking confirmation to the email address that you have provided.</p>
          <div class="booking-summary-text">
            <p><strong>Check-in/Check-out:</strong> {{ formattedCheckIn }} - {{ formattedCheckOut }}</p>
            <p><strong>Booking Confirmation Number:</strong> {{ bookingResponse.bookingId }}</p>
            <p><strong>Total Price for {{ nights }} Night(s):</strong> S${{ bookingResponse.totalPrice.toFixed(2) }}</p>
          </div>
        </div>

        <div class="details-wrapper">
          <div class="package-column">
            <div class="room-info">
              <img :src="bookingResponse.roomImage" class="room-image"  alt=""/>
              <div class="room-title-section">
                <h3>ROOM: {{ bookingResponse.roomTitle }}</h3>
                <p>{{ guests }} Guest(s)</p>
              </div>
            </div>
            <div class="package-details">
              <h4>PACKAGE:</h4>
              <div class="price-breakdown">
                <div class="price-row">
                  <span>Room</span>
                  <span>S${{ roomCharge.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span>Tax & Service Charges (9%)</span>
                  <span>S${{ taxAndServiceCharge.toFixed(2) }}</span>
                </div>
                <div class="total-price">
                  <span>Total Price</span>
                  <span>S${{ bookingResponse.totalPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="guest-column">
            <h4>GUEST DETAILS</h4>
            <div class="guest-info-content">
              <p>Name: {{ contactTitle }} {{ contactName }}</p>
              <p>Email Address: {{ contactEmail }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BookingProcessLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
// **FIX**: Import both functions at the top level for reliability.
import { createBooking, getRoomDetails } from '../services/api';
import BookingProcessLayout from '../layouts/BookingProcessLayout.vue';

const route = useRoute();

const loading = ref(true);
const error = ref(null);
const bookingResponse = ref(null);

// Extract all data from the route query
const { roomId, checkIn, checkOut, guests, contactTitle, contactName, contactEmail } = route.query;

// --- Computed properties for display ---
const nights = computed(() => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
};
const formattedCheckIn = computed(() => formatDate(checkIn));
const formattedCheckOut = computed(() => formatDate(checkOut));

const roomCharge = computed(() => bookingResponse.value ? bookingResponse.value.totalPrice / 1.09 : 0);
const taxAndServiceCharge = computed(() => roomCharge.value * 0.09);


onMounted(async () => {
  try {
    const bookingDetails = {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestDetails: {
        title: contactTitle,
        name: contactName,
        email: contactEmail,
      },
    };

    // Call the API to create the booking
    const response = await createBooking(bookingDetails);

    // **FIX**: Use the pre-imported getRoomDetails function.
    // The dynamic import was causing the error.
    const roomDetails = await getRoomDetails(roomId);

    bookingResponse.value = {
        ...response,
        roomTitle: roomDetails.title,
        roomImage: roomDetails.image,
        totalPrice: roomDetails.price * nights.value * 1.09
    };

  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
    console.error("Booking creation failed:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.confirmation-container {
  width: 100%;
  text-align: center;
}

.status-message {
  padding: 4rem 1rem;
}
.status-message.error {
  color: var(--danger-color);
}

.confirmation-header {
  margin-bottom: 3rem;
}

.title {
  font-family: var(--font-serif),serif;
  font-size: 2rem;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

.booking-summary-text {
  display: inline-block;
  text-align: left;
  line-height: 1.8;
}

.details-wrapper {
  display: flex;
  gap: 2rem;
  text-align: left;
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--light-gray);
  padding: 2rem;
}

.package-column {
  flex: 2; /* Takes up 2/3 of the space */
}

.guest-column {
  flex: 1; /* Takes up 1/3 of the space */
  background-color: #e9e9e9;
  padding: 1.5rem;
  height: fit-content;
}

.room-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.room-image {
    width: 170px; /* Smaller image */
    height: 105px;
    object-fit: cover;
    flex-shrink: 0;
}

.room-title-section h3 {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.package-details h4, .guest-column h4 {
  font-family: var(--font-serif),serif;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.price-breakdown {
  margin-top: 1rem;
}

.price-row, .total-price {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.total-price {
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.guest-info-content p {
  line-height: 1.7;
}

.button-link {
  display: inline-block;
  margin-top: 1rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-weight: bold;
}

@media (max-width: 992px) {
  .details-wrapper {
    flex-direction: column;
  }
  .confirmation-header{
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
