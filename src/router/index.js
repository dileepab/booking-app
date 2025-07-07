import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebaseConfig'; // Import auth directly
import RoomSearch from '../views/RoomSearch.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/search' },
    { path: '/search', name: 'RoomSearch', component: RoomSearch },
    { path: '/rooms', name: 'RoomSelect', component: () => import('../views/RoomSelect.vue') },
    { path: '/contact', name: 'ContactInfo', component: () => import('../views/ContactInfo.vue') },
    { path: '/confirmation', name: 'Confirmation', component: () => import('../views/Confirmation.vue') },
    { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { isGuest: true } },
    { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { isGuest: true } },
    { path: '/dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: RoomSearch }
  ],
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.isGuest;
  const currentUser = auth.currentUser; // This is now a reliable, synchronous check.

  if (requiresAuth && !currentUser) {
    next({ name: 'Login' });
  } else if (isGuest && currentUser) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
