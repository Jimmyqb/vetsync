<script setup>
import { STATUS } from '../../lib/constants';

defineProps({ status: { type: String, required: true } });
</script>

<template>
  <span class="pill" :class="'s-' + status">{{ STATUS[status] }}</span>
</template>
