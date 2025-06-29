<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div v-if="loading" class="text-gray-600">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error loading ticket</div>
    <div v-else>
      <h2 class="text-2xl font-bold mb-2">{{ ticket.title }}</h2>
      <p class="mb-4 text-gray-700">{{ ticket.description }}</p>

      <div v-if="ticket.attachmentUrls.length" class="mb-4">
        <h4 class="font-semibold">Attachments:</h4>
        <ul class="list-disc list-inside">
          <li v-for="url in ticket.attachmentUrls" :key="url">
            <a :href="url.startsWith('http') ? url : `${API_HTTP_URI}${url}`" target="_blank"
              class="text-blue-600 underline">
              View Attachment
            </a>
          </li>
        </ul>
      </div>

      <p :class="['text-sm', 'mb-6', ticket.status]">Status: <strong>{{ ticket.status }}</strong></p>
      <div v-if="isAgent" class="mb-6">
        <button class="bg-red-500 text-white px-4 py-2 rounded" @click="updateStatus('closed')"
          v-if="ticket.status !== 'closed'">
          Mark as Closed
        </button>
      </div>

      <div class="space-y-4 mb-6">
        <h3 class="text-lg font-semibold">Comments</h3>
        <div v-for="comment in ticket.comments" :key="comment.id" class="p-3 border rounded bg-gray-50">
          <p class="text-sm text-gray-800">{{ comment.content }}</p>
          <p class="text-xs text-gray-500 mt-1">By: {{ comment?.user?.role }} {{ comment?.user?.name }}</p>
        </div>
      </div>

      <form v-if="canReply" @submit.prevent="submitComment" class="space-y-2">
        <textarea v-model="commentText" class="w-full border rounded px-3 py-2" placeholder="Write a reply..." />
        <button class="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send Comment</button>
      </form>
      <p v-else class="text-gray-500 text-sm">
        You cannot reply to this ticket, <span v-if="ticket.status === 'closed'"> This Ticket is closed.</span><span v-else>until an agent replies.</span>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { decodeJwt } from '../utils/jwt';
import { useAuthStore } from '../services/auth';
const {getToken} = useAuthStore()


const route = useRoute();
const ticketId = route.params.id;
const commentText = ref('');

const API_HTTP_URI = import.meta.env.VITE_API_URI

const user = decodeJwt(getToken());
const isAgent = user?.role === 'agent';
const isCustomer = user?.role === 'customer';

const TICKET_QUERY = gql`
  query Ticket($id: ID!) {
    ticket(id: $id) {
      id
      title
      description
      status
      attachmentUrls
      comments {
        id
        content
        user {
          id
          name
          role
        }
      }
    }
  }
`;

const COMMENT_MUTATION = gql`
  mutation AddComment($ticketId: ID!, $content: String!) {
    addComment(input: {
      ticketId: $ticketId,
      content: $content
    }) {
      comment {
        id
        content
      }
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateTicketStatus($input: UpdateTicketStatusInput!) {
    updateTicketStatus(input: $input) {
      ticket {
        id
        status
      }
    }
  }
`;
const { result, loading, error, refetch } = useQuery(TICKET_QUERY, { id: ticketId });


const ticket = computed(() => result.value?.ticket || { comments: [] });
const canReply = computed(() =>
  isAgent && ticket.value.status !== 'closed' || (isCustomer && ticket.value.status === 'in_progress')
);

const { mutate: addComment } = useMutation(COMMENT_MUTATION);
const { mutate: updateTicketStatus } = useMutation(UPDATE_STATUS);

async function submitComment() {
  if (!commentText.value.trim()) {
    return
  }
  await addComment({ ticketId, content: commentText.value });
  if (user.role === 'agent' && ticket.value.status === 'open' ) {
    await updateStatus('in_progress');
  }
  commentText.value = '';
  await refetch();
}

async function updateStatus(status) {
  await updateTicketStatus({
    input: {
      ticketId,
      status
    }
  });
  await refetch();
}
</script>
