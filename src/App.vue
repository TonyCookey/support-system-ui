<template>
  <div>
    <Navbar v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import { getToken } from './services/auth';

const isLoggedIn = !!getToken();
</script>
