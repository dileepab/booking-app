<template>
  <div id="app-wrapper">
    <header class="masthead">
      <div class="masthead-content">
        <router-link to="/" class="logo">
          <h1>HOTEL</h1>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="main-nav desktop-nav">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
          <template v-else>
            <router-link to="/search" class="nav-link">Search</router-link>
            <router-link to="/dashboard" class="nav-link">My Bookings</router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-link icon-link" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </a>
          </template>
        </nav>

        <!-- Hamburger Menu for Mobile -->
        <button class="hamburger-menu" @click="isDrawerOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </header>

    <!-- Drawer Navigation for Mobile -->
    <div class="drawer-overlay" v-if="isDrawerOpen" @click="isDrawerOpen = false"></div>
    <aside class="drawer" :class="{ 'is-open': isDrawerOpen }">
      <div class="drawer-header">
        <h3>Menu</h3>
        <button class="close-button" @click="isDrawerOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <nav class="drawer-nav">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="drawer-link" @click="isDrawerOpen = false">Login</router-link>
          <router-link to="/register" class="drawer-link" @click="isDrawerOpen = false">Register</router-link>
        </template>
        <template v-else>
          <router-link to="/search" class="drawer-link" @click="isDrawerOpen = false">Search</router-link>
          <router-link to="/dashboard" class="drawer-link" @click="isDrawerOpen = false">My Bookings</router-link>
          <a href="#" @click.prevent="() => { handleLogout(); isDrawerOpen = false; }" class="drawer-link">Logout</a>
        </template>
      </nav>
    </aside>

    <main class="content-container" :class="contentLayoutClass">
      <router-view />
    </main>

    <ToastNotification
      :message="toastState.message"
      :type="toastState.type"
      :visible="toastState.visible"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { logoutUser } from './services/api';
import { useToast } from './composables/useToast';
import ToastNotification from './components/ToastNotification.vue';

const route = useRoute();
const router = useRouter();
const isLoggedIn = ref(false);
const isDrawerOpen = ref(false);
const { toastState, showToast } = useToast();

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
    router.push('/login');
  } catch (error) {
    console.error("Logout failed:", error);
    showToast('Failed to log out. Please try again.', 'error');
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
  align-items: center;
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

.nav-link.router-link-active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

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

.hamburger-menu {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* Drawer Styles */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1999;
}
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background-color: white;
  z-index: 2000;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}
.drawer.is-open {
  transform: translateX(0);
}
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}
.drawer-header h3 {
  margin: 0;
  font-size: 1.25rem;
}
.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}
.drawer-link {
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #333;
  font-size: 1.1rem;
}
.drawer-link:hover {
  background-color: var(--light-gray);
}
.drawer-link.router-link-active {
  font-weight: bold;
  color: var(--primary-color);
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

@media (max-width: 768px) {
  .masthead {
    padding: 1rem;
  }
  .logo h1 {
    font-size: 1.5rem;
  }
  .desktop-nav {
    display: none;
  }
  .hamburger-menu {
    display: block;
  }
  .content-container.layout-default {
    padding: 5rem 1rem 1rem;
  }
}
</style>
