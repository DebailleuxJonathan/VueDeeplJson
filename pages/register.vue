<script setup lang="ts">
const email = ref("")
const password = ref(null)
const errorMsg = ref(null)
const successMsg = ref(null)
const client = useSupabaseClient()

const signUp = async () => {
  try {
    const {data, error} = await client.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (error) throw error
    successMsg.value = "Check email"
  } catch (e) {
    errorMsg.value = e.message
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h1 class="text-2xl font-semibold text-center mb-6">Login</h1>
      <form @submit.prevent="signUp">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              v-model="email"
              type="email"
              id="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
              v-model="password"
              type="password"
              id="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
          />
        </div>

        <button
            type="submit"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      <div class="text-black cursor-pointer" @click="$router.push('/login')">Vous avez un compte ? Connectez-vous</div>
    </div>
  </div>
</template>
