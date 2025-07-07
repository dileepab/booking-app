<template>
  <div id="app-wrapper">
    <header class="masthead">
      <div class="masthead-content">
        <router-link to="/" class="logo">
          <h1>HOTEL</h1>
        </router-link>
        <nav class="main-nav">
          <router-link to="/search" class="nav-link">Search</router-link>
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
          <template v-else>
            <router-link to="/dashboard" class="nav-link">My Bookings</router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-link icon-link" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </a>
          </template>
        </nav>
      </div>
    </header>

    <main class="content-container" :class="contentLayoutClass">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { logoutUser } from './services/api';

const route = useRoute();
const router = useRouter();
const isLoggedIn = ref(false);

// Listen for Firebase auth state changes
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const contentLayoutClass = computed(() => {
  if (route.name === 'Login' || route.name === 'Register') {
    return 'layout-centered';
  }
  return 'layout-default';
});

const handleLogout = async () => {
  try {
    await logoutUser();
    // Revert to router.push.
    router.push('/login');
  } catch (error) {
    console.error("Logout failed:", error);
    alert('Failed to log out. Please try again.');
  }
};
</script>

<style>
/* App-level styles */
.masthead {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  z-index: 1000;
}

.masthead-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-family: 'Times New Roman', Times, serif;
  font-weight: normal;
  font-size: 2rem;
  letter-spacing: 0.1em;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  align-items: center; /* Align all nav items vertically */
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #000;
}

/* Style for the active router link */
.nav-link.router-link-active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* Specific styles for icon-only links */
.nav-link.icon-link {
  border-bottom: none;
  padding-bottom: 0;
}

.nav-link.icon-link:hover {
  border-bottom: none;
}

.nav-link.icon-link.router-link-active {
  border-bottom: none;
}


.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 6rem;
}

.content-container.layout-default {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
}

.content-container.layout-centered {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
}

/* Responsive styles for mobile devices */
@media (max-width: 768px) {
  .masthead {
    padding: 1rem;
  }

  .logo h1 {
    font-size: 1.5rem;
  }

  .main-nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }
}
</style>
