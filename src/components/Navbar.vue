<template>
  <nav class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
    <div class="flex space-x-4">
      <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
      <router-link to="/tickets/new" class="hover:underline">New Ticket</router-link>
      <router-link v-if="userRole === 'agent'" to="/export" class="hover:underline">Export</router-link>
    </div>
    <div class="flex items-center space-x-4">
    <p class="text-sm">
      Logged in as: <strong>{{ userRole }}</strong>
    </p>
    <button @click="logoutAndRedirect" class="bg-red-500 px-3 py-1 rounded">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout, getToken } from '../services/auth';
import { decodeJwt } from '../utils/jwt';

const router = useRouter();
const token = getToken();

let userRole = '';
if (token) {
  try {
    const decoded = decodeJwt(token);
    
    userRole = decoded.role || '';
  } catch (e) {
    console.log('Invalid token', e);
  }
}

function logoutAndRedirect() {
  logout();
  router.push('/login');
}
</script>
