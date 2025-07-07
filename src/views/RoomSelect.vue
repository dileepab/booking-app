<template>
  <BookingProcessLayout :active-step="2">
    <div class="room-select-container">
      <div class="page-header">
        <div class="search-summary">
          <p>{{ formattedCheckIn }} &rarr; {{ formattedCheckOut }}</p>
          <p>{{ nights }} Night | {{ guests }} Guest(s)</p>
        </div>
        <div class="sort-options">
          <label for="sort-by">SORT BY:</label>
          <div class="select-wrapper">
            <select id="sort-by" v-model="sortBy">
              <option value="lowest">LOWEST PRICE</option>
              <option value="highest">HIGHEST PRICE</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading && rooms.length === 0" class="status-message">Searching for rooms...</div>
      <div v-else-if="!loading && rooms.length === 0" class="no-rooms-message">No rooms available for the selected criteria.</div>

      <TransitionGroup
        v-else
        tag="div"
        name="room-list-transition"
        class="room-list"
      >
        <div
          v-for="room in rooms"
          :key="room.id"
          class="room-card"
          v-observe-visibility
        >
          <img :src="room.image" :alt="room.title" class="room-image" />
          <div class="room-card-content">
            <div class="room-details">
              <h3 class="room-title">{{ room.title }}</h3>
              <p class="room-description">{{ room.description }}</p>
            </div>
            <div class="room-booking-details">
              <p class="room-price">
                S${{ room.price.toFixed(2) }}<span>/night</span>
              </p>
              <p class="price-info">Subject to GST and charges</p>
              <button class="book-room-button" @click="selectRoom(room.id)">BOOK ROOM</button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div class="pagination-controls" v-if="hasMore">
        <button @click="loadMoreRooms" :disabled="loading" class="load-more-button">
          <LoadingSpinner v-if="loading" />
          <span v-else>Load More Rooms</span>
        </button>
      </div>
    </div>
  </BookingProcessLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchRooms } from '../services/api';
import BookingProcessLayout from '../layouts/BookingProcessLayout.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const vObserveVisibility = {
  beforeMount(el) { el.classList.add('before-enter'); },
  mounted(el) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        el.classList.add('enter');
        observer.unobserve(el);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
  },
};

const route = useRoute();
const router = useRouter();

const rooms = ref([]);
const loading = ref(false);
const sortBy = ref('lowest');
const lastVisibleDoc = ref(null);
const hasMore = ref(true);
const roomsPerPage = 5;

const guests = computed(() => route.query.guests || 1);
const checkIn = computed(() => route.query.checkIn);
const checkOut = computed(() => route.query.checkOut);

const nights = computed(() => {
  if (!checkIn.value || !checkOut.value) return 0;
  const start = new Date(checkIn.value);
  const end = new Date(checkOut.value);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-SG', options).toUpperCase();
};

const formattedCheckIn = computed(() => formatDate(checkIn.value));
const formattedCheckOut = computed(() => formatDate(checkOut.value));

// **FIX**: This function now resets the list and fetches the first page.
const fetchAndResetRooms = async () => {
  loading.value = true;
  hasMore.value = true;
  lastVisibleDoc.value = null;
  try {
    const { roomList, lastVisibleDoc: newLastVisible } = await searchRooms(null, roomsPerPage, sortBy.value);
    rooms.value = roomList; // Replace the list, don't add to it
    lastVisibleDoc.value = newLastVisible;
    if (roomList.length < roomsPerPage) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  } finally {
    loading.value = false;
  }
};

const loadMoreRooms = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const { roomList, lastVisibleDoc: newLastVisible } = await searchRooms(lastVisibleDoc.value, roomsPerPage, sortBy.value);
    rooms.value.push(...roomList);
    lastVisibleDoc.value = newLastVisible;
    if (!newLastVisible || roomList.length < roomsPerPage) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error("Failed to fetch more rooms:", error);
  } finally {
    loading.value = false;
  }
};

// **FIX**: Watch for changes in the sortBy filter
watch(sortBy, fetchAndResetRooms);

// **FIX**: Call the new reset function on mount
onMounted(fetchAndResetRooms);

const selectRoom = (roomId) => {
  router.push({ name: 'ContactInfo', query: { ...route.query, roomId } });
};
</script>

<style scoped>
.room-select-container {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.search-summary p {
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 1.5;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-options label {
  font-size: 0.9rem;
  color: #666;
  font-weight: bold;
}

.sort-options select {
  padding: 0.5rem;
  font-weight: bold;
  height: auto;
}

.room-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.room-card {
  display: flex;
  gap: 2rem;
  background-color: var(--light-gray);
  padding: 1.5rem;
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

.room-list-transition-move {
  transition: transform 0.6s cubic-bezier(0.55, 0, 0.1, 1);
}

.room-image {
  width: 340px;
  height: 210px;
  object-fit: cover;
  flex-shrink: 0;
}

.room-card-content {
    display: flex;
    flex-grow: 1;
    gap: 2rem;
}

.room-details {
  flex-grow: 1;
}

.room-title {
  font-family: var(--font-serif),serif;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.room-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

.room-booking-details {
  width: 200px;
  text-align: right;
  flex-shrink: 0;
}

.room-price {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.room-price span {
  font-size: 1rem;
  font-weight: normal;
  color: #666;
  margin-left: 0.25rem;
}

.price-info {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 1.5rem;
}

.book-room-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
}

.book-room-button:hover {
  background-color: var(--primary-color-dark);
}

.status-message, .no-rooms-message {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #888;
}

.pagination-controls {
  text-align: center;
  margin-top: 2rem;
}

.load-more-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  min-width: 200px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.load-more-button:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
}

.load-more-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .room-card {
    flex-direction: column;
  }
  .room-image {
    width: 100%;
    height: auto;
  }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      padding-right: 1rem;
      padding-left: 1rem;
    }
    .room-card-content {
        flex-direction: column;
        gap: 1rem;
    }
    .room-booking-details {
        width: 100%;
        text-align: left;
    }
    .book-room-button {
        max-width: 100%;
    }
}
</style>
