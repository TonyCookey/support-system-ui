<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Create New Ticket</h2>

    <form @submit.prevent="submitTicket" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Subject</label>
        <input v-model="subject" type="text" required class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Message</label>
        <textarea v-model="message" required class="w-full border rounded px-3 py-2 h-28"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Attachment (Image or PDF)</label>
        <input type="file" @change="handleFile" accept="image/*,application/pdf" />
        <p v-if="fileName" class="text-sm mt-1 text-gray-600">Selected: {{ fileName }}</p>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Ticket
      </button>

      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import gql from 'graphql-tag';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';

const subject = ref('');
const message = ref('');
const attachment = ref(null);
const fileName = ref('');
const error = ref(null);
const router = useRouter();

const CREATE_TICKET_MUTATION = gql`
  mutation CreateTicket($subject: String!, $message: String!, $attachmentUrl: String) {
    createTicket(input: {
      subject: $subject,
      message: $message,
      attachmentUrl: $attachmentUrl
    }) {
      ticket {
        id
      }
    }
  }
`;

const { mutate: createTicket } = useMutation(CREATE_TICKET_MUTATION);

function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    attachment.value = file;
    fileName.value = file.name;
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('http://localhost:3000/uploads', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url; // Expected: { url: 'https://...' }
}

async function submitTicket() {
  try {
    let uploadedUrl = null;

    if (attachment.value) {
      uploadedUrl = await uploadFile(attachment.value);
    }

    await createTicket({
      subject: subject.value,
      message: message.value,
      attachmentUrl: uploadedUrl
    });

    router.push('/dashboard');
  } catch (err) {
    error.value = 'Failed to create ticket.';
    console.error(err);
  }
}
</script>
