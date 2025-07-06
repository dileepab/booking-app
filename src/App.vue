<template>
  <div id="app-wrapper">
    <header class="masthead">
      <div class="masthead-content">
        <router-link to="/" class="logo">
          <h1>HOTEL</h1>
        </router-link>
        <nav class="main-nav">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
          <template v-else>
            <router-link to="/dashboard" class="nav-link">My Bookings</router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-link">Logout</a>
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
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Re-check authentication status on component setup
const isLoggedIn = computed(() => {
  const hasCookie = document.cookie.includes('isLoggedIn=true');
  const hasSessionStorage = sessionStorage.getItem('isLoggedIn') === 'true';
  return hasCookie || hasSessionStorage;
});

// Apply a specific layout class for auth pages
const contentLayoutClass = computed(() => {
  if (route.name === 'Login' || route.name === 'Register') {
    return 'layout-centered';
  }
  return 'layout-default';
});

const handleLogout = () => {
    // Clear all forms of session persistence
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isLoggedIn');
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Use router.push and then force a reload to ensure the logged-out state is reflected everywhere
    router.push('/login').then(() => {
      window.location.reload();
    });
};
</script>

<style>
/* App-level styles */
.masthead {
  position: fixed; /* Make header fixed */
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  z-index: 1000; /* Ensure it stays on top */
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
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
}

.nav-link:hover, .logo:hover {
  color: #000;
}

.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /* Add padding-top to account for the fixed header height */
  padding-top: 6rem;
}

/* Default padding for most pages */
.content-container.layout-default {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
}

/* Centering layout for Login/Register */
.content-container.layout-centered {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
}
</style>
