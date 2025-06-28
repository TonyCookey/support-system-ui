<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <select v-model="selectedStatus" class="mb-4 border rounded px-2 py-1 text-gray-700">
      <option value="all">All Tickets</option>
      <option value="open">Open Tickets</option>
      <option value="closed">Closed Tickets</option>
      <option value="in_progress">In Progress Tickets</option>
    </select>

    <TicketList :tickets="tickets" :loading="loading" :error="error" />
    <div class="flex items-center space-x-2 mb-4 mt-4">
      <button @click="currentPage--" :disabled="currentPage === 1"
        class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages"
        class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import TicketList from '../components/TicketList.vue';

const selectedStatus = ref('all');
const currentPage = ref(1);
const pageSize = 4;

const variables = computed(() => ({
  status: selectedStatus.value === 'all' ? null : selectedStatus.value,
  limit: pageSize,
  offset: (currentPage.value - 1) * pageSize
}));

const TICKETS_QUERY = gql`
  query tickets($status: String, $limit: Int, $offset: Int) {
    tickets(status: $status, limit: $limit, offset: $offset) {
      id
      title
      status
    }
    ticketsCount(status: $status)
  }
`;

const { result, loading, error } = useQuery(TICKETS_QUERY, variables);

const tickets = computed(() => result.value?.tickets || []);
const totalCount = computed(() => result.value?.ticketsCount || 0);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));  

</script>
