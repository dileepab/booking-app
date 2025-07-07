<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title">My Bookings</h2>

    <div class="dashboard-tabs">
      <button
          :class="{ 'active': activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
          class="tab-button"
      >
        Upcoming Bookings
      </button>
      <button
          :class="{ 'active': activeTab === 'past' }"
          @click="activeTab = 'past'"
          class="tab-button"
      >
        Past Bookings
      </button>
    </div>

    <div class="bookings-content">
      <div v-if="loading" class="status-message">Loading your bookings...</div>
      <div v-if="error" class="status-message error">{{ error }}</div>

      <div v-if="!loading && !error">
        <!-- Upcoming Bookings -->
        <div v-if="activeTab === 'upcoming'">
          <div v-if="upcomingBookings.length === 0" class="no-bookings-message">
            You have no upcoming bookings.
            <router-link to="/search" class="button-link">Book a Room</router-link>
          </div>
          <TransitionGroup v-else tag="div" name="booking-list-transition" class="booking-list">
            <div
              v-for="booking in upcomingBookings"
              :key="booking.bookingId"
              class="booking-card"
              v-observe-visibility
            >
              <div class="booking-image-wrapper">
                <img :src="booking.roomImage" :alt="booking.roomTitle" class="booking-image" />
              </div>
              <div class="booking-details">
                <h3>{{ booking.roomTitle }}</h3>
                <p><strong>Check-in:</strong> {{ formatDate(booking.checkIn) }}</p>
                <p><strong>Check-out:</strong> {{ formatDate(booking.checkOut) }}</p>
                <p><strong>Booking ID:</strong> {{ booking.bookingId }}</p>
              </div>
              <div class="booking-actions">
                <button
                  @click="handleCancel(booking.bookingId)"
                  class="cancel-button"
                  :disabled="cancellingId === booking.bookingId"
                >
                  <LoadingSpinner v-if="cancellingId === booking.bookingId" />
                  <span v-else>Cancel Booking</span>
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Past Bookings -->
        <div v-if="activeTab === 'past'">
          <div v-if="pastBookings.length === 0" class="no-bookings-message">
            You have no past bookings.
          </div>
          <TransitionGroup v-else tag="div" name="booking-list-transition" class="booking-list">
            <div
              v-for="booking in pastBookings"
              :key="booking.bookingId"
              class="booking-card past"
              v-observe-visibility
            >
              <div class="booking-image-wrapper">
                <img :src="booking.roomImage" :alt="booking.roomTitle" class="booking-image" />
              </div>
              <div class="booking-details">
                <h3>{{ booking.roomTitle }}</h3>
                <p><strong>Check-in:</strong> {{ formatDate(booking.checkIn) }}</p>
                <p><strong>Check-out:</strong> {{ formatDate(booking.checkOut) }}</p>
                <p><strong>Booking ID:</strong> {{ booking.bookingId }}</p>
                <p v-if="booking.status === 'cancelled'" class="status-tag cancelled">Cancelled</p>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getUserBookings, cancelBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { useToast } from '../composables/useToast';

const vObserveVisibility = {
  beforeMount(el) {
    el.classList.add('before-enter');
  },
  mounted(el) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('enter');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
  },
};

const { showToast } = useToast();
const allBookings = ref([]);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('upcoming');
const cancellingId = ref(null);

const upcomingBookings = computed(() =>
  allBookings.value.filter(b => b.status === 'upcoming').sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
);

const pastBookings = computed(() =>
  allBookings.value.filter(b => b.status !== 'upcoming').sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-SG', options);
};

const fetchBookings = async () => {
  try {
    loading.value = true;
    allBookings.value = await getUserBookings();
  } catch (err) {
    error.value = 'Failed to load bookings.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async (bookingId) => {
  cancellingId.value = bookingId;
  try {
    await cancelBooking(bookingId);
    const bookingToCancel = allBookings.value.find(b => b.bookingId === bookingId);
    if (bookingToCancel) {
      bookingToCancel.status = 'cancelled';
    }
    showToast('Booking cancelled successfully.', 'success');
  } catch (err) {
    console.error('Failed to cancel booking:', err);
    showToast('Could not cancel the booking. Please try again.', 'error');
  } finally {
    cancellingId.value = null;
  }
};

onMounted(fetchBookings);
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}

.dashboard-title {
  font-family: var(--font-serif),serif;
  font-size: 2rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.dashboard-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 1.5rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.status-message {
  padding: 4rem 1rem;
  text-align: center;
  color: #888;
}
.status-message.error {
  color: var(--danger-color);
}

.no-bookings-message {
  text-align: center;
  padding: 3rem;
  background-color: var(--light-gray);
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

.booking-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.booking-image-wrapper {
  width: 150px;
  height: 100px;
  flex-shrink: 0;
  margin-right: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
}

.booking-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.booking-details {
  flex-grow: 1;
}

.booking-card.past {
  background-color: #f9f9f9;
  color: #888;
}

.booking-details h3 {
  font-family: var(--font-serif),serif;
  margin-bottom: 1rem;
}
.booking-details p {
  margin: 0.5rem 0;
}

.cancel-button {
  background-color: var(--danger-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  min-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cancel-button:hover:not(:disabled) {
  background-color: var(--danger-color-dark);
}
.cancel-button:disabled {
  background-color: #f8d7da;
  cursor: not-allowed;
}

.status-tag.cancelled {
  font-weight: bold;
  color: var(--danger-color);
  margin-top: 1rem;
}

.before-enter {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s ease-out;
}
.enter {
  opacity: 1;
  transform: translateY(0);
}

.booking-list-transition-leave-active {
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateX(30px);
}

.booking-list-transition-enter-active {
  transition: all 0.4s ease;
  transition-delay: 0.4s;
}

.booking-list-transition-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}


@media (max-width: 768px) {
  .booking-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .booking-image-wrapper {
    width: 100%;
    height: 150px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .booking-actions {
    width: 100%;
  }
  .cancel-button {
    width: 100%;
  }
}
</style>
