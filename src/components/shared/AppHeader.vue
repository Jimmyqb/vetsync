<script setup>
import { useUi } from '../../stores/ui';

const ui = useUi();
const roles = [
  { id: 'owner', label: 'Cliente' },
  { id: 'vet', label: 'Veterinario' },
  { id: 'admin', label: 'Recepción' }
];
</script>

<template>
  <header class="top">
    <div class="brand">
      <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <path d="M16 8v16M8 16h16" stroke="var(--accent-fg)" stroke-width="3.2" stroke-linecap="round" />
      </svg>
      <span>VetSync</span>
    </div>
    <div class="top-r">
      <span class="demo">Datos de ejemplo</span>
      <div class="seg" role="group" aria-label="Ver la aplicación como">
        <button
          v-for="r in roles"
          :key="r.id"
          type="button"
          :class="{ on: ui.role === r.id }"
          :aria-pressed="ui.role === r.id"
          @click="ui.setRole(r.id)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>
  </header>
</template>
