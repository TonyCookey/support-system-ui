<template>
  <div class="min-h-screen flex items-center justify-center">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-8 rounded shadow-md w-full max-w-lg"
    >
      <h1 class="text-3xl mb-4 font-bold">Login</h1>
      <p v-if="error" class="text-red-500 text-right text-sm mb-3">
        {{ error }}
      </p>

      <label class="block mb-2">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          class="border rounded px-3 py-2 w-full"
          required
        />
      </label>

      <label class="block mb-8">
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          class="border rounded px-3 py-2 w-full"
          required
          minlength="8"
        />
      </label>

      <button
        type="submit"
        class="bg-blue-600 text-white py-2 px-4 rounded w-full flex items-center justify-center"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        ></span>
        <span v-else>Login</span>
      </button>

      <p class="text-sm mt-2">
        Don't have an account?
        <router-link to="/register" class="text-blue-600">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useRouter } from "vue-router";
import { useAuthStore } from "../services/auth";

const { getToken, saveToken } = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();
const loading = ref(false);

onMounted(() => {
  if (getToken()) {
    router.push("/dashboard");
  }
});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      user {
        id
        role
      }
      errors
    }
  }
`;

const { mutate: login } = useMutation(LOGIN_MUTATION);

const handleLogin = async () => {
  try {
    loading.value = true;
    const { data } = await login({
      email: email.value,
      password: password.value,
    });    
    if (data.login.errors.length > 0) {
      error.value = data.login.errors[0]
      return
    }
      saveToken(data.login.token);
      console.log('Logging in');
      router.push('/dashboard');
    
  } catch (err) {
    error.value = 'Invalid credentials';
    console.error('Login error:', err);
  } finally {    
    loading.value = false;
  }
};
</script>

<style scoped>
</style>

