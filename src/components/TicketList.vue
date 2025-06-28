<template>
  <div>
    <div v-if="loading" class="text-gray-600">Loading tickets...</div>
    <div v-else-if="error" class="text-red-500">Error loading tickets.</div>
    <div v-else-if="tickets.length === 0" class="text-gray-500">No tickets found.</div>
    

    <ul v-else class="space-y-4">
      <li v-for="ticket in tickets" :key="ticket.id" class="p-4 border rounded">
        <h3 class="text-lg font-bold">{{ ticket.title }}</h3>
        <p :class="['text-sm', 'text-gray-600', ticket.status]">Status: {{ ticket.status }}</p>
        <router-link :to="`/tickets/${ticket.id}`" class="text-blue-600 hover:underline mt-1 inline-block">
          View Details
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  tickets: Array,
  loading: Boolean,
  error: Object
});
</script>
