<script setup>
import { useUi } from '../../stores/ui';

const ui = useUi();
</script>

<template>
  <div v-if="ui.toastMsg" class="toast" role="status" aria-live="polite">{{ ui.toastMsg }}</div>
</template>
