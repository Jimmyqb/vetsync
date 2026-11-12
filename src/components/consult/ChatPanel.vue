<script setup>
import { ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';

const props = defineProps({ appt: { type: Object, required: true } });
const clinic = useClinic();
const ui = useUi();
const text = ref('');

function send() {
  const t = text.value.trim();
  if (!t) return;
  clinic.sendMessage(props.appt.id, ui.role, t);
  text.value = '';
}
</script>

<template>
  <div class="panel">
    <h2>Chat de la consulta</h2>
    <p v-if="!appt.chat.length" class="empty">Aún no hay mensajes. Escribe síntomas, dudas o indicaciones.</p>
    <ul v-else class="msgs" aria-live="polite">
      <li v-for="(m, i) in appt.chat" :key="i" :class="m.from === ui.role ? 'me' : 'them'">
        <span class="bubble">{{ m.text }}</span>
        <time>{{ m.at }}</time>
      </li>
    </ul>
    <form class="send" @submit.prevent="send">
      <input id="chat-input" v-model="text" type="text" placeholder="Escribe un mensaje" aria-label="Mensaje" />
      <button class="btn primary" type="submit">Enviar</button>
    </form>
  </div>
</template>
