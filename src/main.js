import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { useClinic } from './stores/clinic';
import { saveState } from './lib/storage';
import './styles/tokens.css';
import './styles/main.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Persistencia simulada: cada cambio del store se guarda en localStorage.
useClinic(pinia).$subscribe((_mutation, state) => saveState(state), { detached: true });

app.mount('#app');
