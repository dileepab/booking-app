import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import the global stylesheet. We will write our custom styles here.
import './assets/main.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
