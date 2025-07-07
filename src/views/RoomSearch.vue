<template>
  <div class="search-page-container">
    <div class="hero-section">
      <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Luxury hotel pool and building" class="hero-image" />
      <div class="hero-overlay">
        <h2 class="hero-title">BOOK A ROOM</h2>
      </div>
    </div>

    <div class="search-form-wrapper">
      <form @submit.prevent="executeSearch" class="search-form">
        <div class="form-inputs">
          <div class="form-group">
            <label for="guests">Guests</label>
            <div class="select-wrapper">
              <select id="guests" v-model="searchCriteria.guests">
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="checkin">Check-in</label>
            <input type="date" id="checkin" v-model="searchCriteria.checkIn" :min="today" />
          </div>
          <div class="form-group">
            <label for="checkout">Check-out</label>
            <input type="date" id="checkout" v-model="searchCriteria.checkOut" :min="checkoutMinDate" />
          </div>
        </div>
        <button type="submit" class="search-button">SEARCH FOR ROOMS</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayDate = new Date();
const today = formatDateToYYYYMMDD(todayDate);

const getTomorrow = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return formatDateToYYYYMMDD(date);
};

const searchCriteria = reactive({
  guests: route.query.guests || 2,
  checkIn: route.query.checkIn || today,
  checkOut: route.query.checkOut || getTomorrow(today),
});

const checkoutMinDate = computed(() => {
  return getTomorrow(searchCriteria.checkIn);
});

watch(() => searchCriteria.checkIn, (newCheckIn) => {
  const checkInDate = new Date(newCheckIn);
  const checkOutDate = new Date(searchCriteria.checkOut);
  if (checkInDate >= checkOutDate) {
    searchCriteria.checkOut = getTomorrow(newCheckIn);
  }
});

const executeSearch = () => {
  router.push({
    name: 'RoomSelect',
    query: {
      guests: searchCriteria.guests,
      checkIn: searchCriteria.checkIn,
      checkOut: searchCriteria.checkOut,
    },
  });
};
</script>

<style scoped>
.search-page-container {
  width: 100%;
}

.hero-section {
  position: relative;
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-image {
  width: 100%;
  height: 400px;
  display: block;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.hero-title {
  font-family: var(--font-serif),serif;
  font-size: 3rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem 2rem;
  border-radius: 4px;
}

.search-form-wrapper {
  background-color: #ffffff;
  padding: 2rem;
  margin: -5rem auto 0 auto;
  position: relative;
  z-index: 10;
  max-width: 900px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 4px;
}

.search-form {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
}

.form-inputs {
  display: flex;
  flex-grow: 1;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-group label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  -webkit-appearance: none; /* Remove default iOS styling */
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  font-size: 1rem;
  border-radius: 4px;
  background-color: var(--light-gray);
  height: 48px;
  box-sizing: border-box;
  text-align: left;
  color: var(--text-color);
}

.form-group input[type="date"]::-webkit-date-and-time-value {
  text-align: left;
}

.search-button {
  background-color: var(--primary-color);
  color: white;
  border: 1px solid transparent;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  height: 48px;
}

.search-button:hover {
  background-color: var(--primary-color-dark);
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  .form-inputs,
  .form-group select {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
