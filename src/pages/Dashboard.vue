<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <TicketList :tickets="tickets" :loading="loading" :error="error" />
  </div>
</template>

<script setup>
import {  computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { getToken } from '../services/auth';
import { decodeJwt } from '../utils/jwt';
import TicketList from '../components/TicketList.vue';

const token = getToken();
const user = decodeJwt(token);
const role = user?.role;
const userId = user?.id;

const TICKETS_QUERY = gql`
  query tickets {
    tickets {
      id
      title
      status
    }
  }
`;

const { result, loading, error } = useQuery(TICKETS_QUERY);

const tickets = computed(() => result.value?.tickets || []);
</script>
