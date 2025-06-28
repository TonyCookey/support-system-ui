<template>
  <div>
    <Navbar v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './services/auth';

const {isLoggedIn} = useAuthStore()
</script>
