<template>
  <div>
    <Navbar v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Navbar from './components/Navbar.vue';
import { getToken } from './services/auth';

const isLoggedIn = computed(() => {
  return getToken();
});
</script>
