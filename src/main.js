import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './assets/main.css';

let app;

// This listener waits for Firebase to initialize before mounting the app.
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }
});
