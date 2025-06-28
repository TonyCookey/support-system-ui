<template>
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="handleRegister" class="bg-white p-8 rounded shadow-md w-full max-w-lg">
      <h1 class="text-3xl mb-4 font-bold">Register</h1>
        <p v-if="error" class="text-red-500 text-right text-sm mb-3">{{ error }}</p>
      <label class="block mb-2">
        <span>Name</span>
        <input v-model="name" type="text" class="border rounded px-3 py-2 w-full" required />
      </label>

      <label class="block mb-2">
        <span>Email</span>
        <input v-model="email" type="email" class="border rounded px-3 py-2 w-full" required />
      </label>

      <label class="block mb-2">
        <span>Password</span>
        <input v-model="password" type="password" class="border rounded px-3 py-2 w-full" required minlength="8" />
      </label>

      <label class="block mb-8">
        <span>Role</span>
        <select v-model="role" class="border rounded px-3 py-2 w-full">
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
        </select>
      </label>

      <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded w-full">Register</button>
        <p class="text-sm mt-2">
            Already have an account? <router-link to="/login" class="text-blue-600">Login</router-link>
        </p>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
import { saveToken, getToken} from '../services/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('customer');
const error = ref(null);
const router = useRouter();

onMounted(() => {
  if (getToken()) {
    router.push('/dashboard');
  }
});

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
    register(input: { name: $name, email: $email, password: $password, role: $role }) {
      token
      user {
        id
        role
      }
    }
  }
`;

const { mutate: register } = useMutation(REGISTER_MUTATION);

const handleRegister = async () => {
  try {
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters long';
      return;
    }
    const { data } = await register({ name: name.value, email: email.value, password: password.value, role: role.value });
    saveToken(data.register.token);
    router.push('/dashboard');
  } catch (err) {
    error.value = 'Registration failed';
    console.log('Registration error:', err);
  }
};
</script>

<style scoped>
</style>

