import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import RoomSearch from '../views/RoomSearch.vue';

// Helper function to check for authentication state (cookie or sessionStorage)
const isAuthenticated = () => {
  const hasCookie = document.cookie.includes('isLoggedIn=true');
  const hasSessionStorage = sessionStorage.getItem('isLoggedIn') === 'true';
  return hasCookie || hasSessionStorage;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Booking Flow (Guest accessible) ---
    {
      path: '/',
      redirect: '/search', // Start the user journey at the search page
    },
    {
      path: '/search',
      name: 'RoomSearch',
      component: RoomSearch,
    },
    {
      path: '/rooms',
      name: 'RoomSelect',
      // Lazy load components for other pages
      component: () => import('../views/RoomSelect.vue'),
    },
    {
      path: '/contact',
      name: 'ContactInfo',
      component: () => import('../views/ContactInfo.vue'),
    },
    {
      path: '/confirmation',
      name: 'Confirmation',
      component: () => import('../views/Confirmation.vue'),
    },

    // --- Authentication ---
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { isGuest: true } // Prevent authenticated users from seeing login page
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { isGuest: true }
    },

    // --- Authenticated User Dashboard ---
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true } // This route requires the user to be logged in
    },

    // --- Catch-all for 404 ---
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: RoomSearch // Redirect to search page if route doesn't exist
    }
  ],
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.isGuest;
  const authenticated = isAuthenticated();

  if (requiresAuth && !authenticated) {
    // If a route requires auth and user is not logged in, redirect to login
    next({ name: 'Login' });
  } else if (isGuest && authenticated) {
    // If a route is for guests (login/register) and user is logged in, redirect to dashboard
    next({ name: 'Dashboard' });
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;
