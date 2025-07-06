<template>
  <div class="summary-card">
    <div v-if="loading" class="loading-state">Loading Summary...</div>
    <div v-if="error" class="error-state">{{ error }}</div>
    <div v-if="room" class="summary-content">
      <div class="date-info">
        <p>{{ formattedCheckIn }} &rarr; {{ formattedCheckOut }}</p>
        <p>{{ nights }} Night(s)</p>
      </div>
      <div class="guest-info">
        <p>ROOM: {{ guests }} GUEST(S)</p>
      </div>
      <img :src="room.image" :alt="room.title" class="room-image" />
      <div class="room-title-bar">
        <p>{{ room.title }}</p>
      </div>
      <div class="price-details">
        <div class="price-row">
          <span>Room</span>
          <span>S${{ roomCharge.toFixed(2) }}</span>
        </div>
        <div class="price-row">
          <span>Tax & Service Charges (9%)</span>
          <span>S${{ taxAndServiceCharge.toFixed(2) }}</span>
        </div>
      </div>
      <div class="total-price">
        <span>TOTAL</span>
        <span>S${{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getRoomDetails } from '../services/api';

const props = defineProps({
  roomId: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: { type: [String, Number], required: true },
});

const room = ref(null);
const loading = ref(true);
const error = ref(null);

const nights = computed(() => {
  if (!props.checkIn || !props.checkOut) return 0;
  const start = new Date(props.checkIn);
  const end = new Date(props.checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

const roomCharge = computed(() => {
  if (!room.value) return 0;
  return room.value.price * nights.value;
});

const taxAndServiceCharge = computed(() => {
  return roomCharge.value * 0.09;
});

const totalPrice = computed(() => {
  return roomCharge.value + taxAndServiceCharge.value;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-SG', options).toUpperCase();
};

const formattedCheckIn = computed(() => formatDate(props.checkIn));
const formattedCheckOut = computed(() => formatDate(props.checkOut));

onMounted(async () => {
  try {
    room.value = await getRoomDetails(props.roomId);
  } catch (err) {
    error.value = 'Could not load booking summary.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.summary-card {
  background-color: var(--light-gray);
  padding: 1.5rem;
  width: 350px;
  flex-shrink: 0;
}
.date-info {
  font-weight: bold;
  margin-bottom: 1rem;
}
.date-info p {
  margin: 0;
  line-height: 1.4;
}
.guest-info {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.room-image {
  width: 100%;
  height: 210px;
  object-fit: cover;
  display: block;
}
.room-title-bar {
  background-color: #e0e0e0;
  padding: 0.75rem 1rem;
  font-weight: bold;
}
.price-details {
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
}
.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.total-price {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
}
.loading-state, .error-state {
  text-align: center;
  padding: 4rem 0;
}
</style>
