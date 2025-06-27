<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Export Closed Tickets</h2>

    <p class="text-gray-600 mb-4">
      Click the button below to export all closed tickets from the last 30 days.
    </p>

    <button @click="exportTickets" class="bg-blue-600 text-white px-4 py-2 rounded">
      Download CSV
    </button>

    <p v-if="error" class="text-red-500 text-sm mt-3">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getToken } from '../services/auth';

const error = ref(null);

async function exportTickets() {
  error.value = null;

  try {
    const token = getToken();

    const res = await fetch(`${import.meta.env.API_HTTP_URI}/tickets/export`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to export tickets');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'closed_tickets.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    error.value = 'Failed to export CSV. Please try again later.';
    console.error(err);
  }
}
</script>
