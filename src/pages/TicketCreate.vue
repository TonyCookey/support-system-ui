<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Create New Ticket</h2>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Title</label>
        <input v-model="title" type="text" required class="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label class="block font-semibold mb-1">Description</label>
        <textarea v-model="description" required class="w-full border px-3 py-2 rounded"></textarea>
      </div>
      <div>
        <label class="block font-semibold mb-1">Attachments</label>
        <label class="inline-block bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-700 transition">
          <span>Select Files</span>
          <input
            type="file"
            multiple
            @change="handleFiles"
            class="hidden"
          />
        </label>
        <span v-if="files.length" class="ml-2 text-sm text-gray-600">{{ files.length }} file(s) selected</span>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full mt-5 flex items-center justify-center" :disabled="success">
        <span v-if="!success">Create Ticket</span>
        <span v-else class="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
      </button>

      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-600 mt-2">Ticket created successfully!</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import gql from 'graphql-tag';

const title = ref('');
const description = ref('');
const files = ref([]);
const error = ref(null);
const success = ref(false);
const router = useRouter();

 const CREATE_TICKET = gql`
  mutation CreateTicket($title: String!, $description: String!, $attachments: [Upload!]) {
    createTicket(input: { title: $title, description: $description, attachments: $attachments }) {
      ticket {
        id
        title
        status
      }
      errors
    }
  }
`;
const { mutate: createTicket } = useMutation(CREATE_TICKET);

const handleFiles = (event) => {
  files.value = Array.from(event.target.files);
};

const submit = async () => {
  error.value = null;
  success.value = false;

  try {
    const { data } = await createTicket({
      title: title.value,
      description: description.value,
      attachments: files.value
    });

    if (data.createTicket.errors.length) {
      error.value = data.createTicket.errors.join(', ');
    } else {
      success.value = true;
      setTimeout(() => router.push('/dashboard'), 1000);
    }
  } catch (e) {
    error.value = 'Something went wrong';
    console.error('Error creating ticket:', e);
  }
};
</script>
