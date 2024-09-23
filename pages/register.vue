<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})
const email = ref("")
const password = ref(null)
const confirmPassword = ref(null)
const client = useSupabaseClient()
const toast = useToast()

const signUp = async () => {
  try {
    if (confirmPassword.value !== password.value) {
      toast.add(
          {
            id: 'alert',
            title: 'Vos mot de passe ne correspondent pas',
            color: 'red',
            icon: "i-heroicons-exclamation-circle",
            timeout: 0
          })
      return
    }
    const {data, error} = await client.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (error) throw error
    toast.add(
        {
          id: 'success',
          title: 'Check tes mails',
          color: 'green',
          icon: "i-heroicons-check-circle",
          timeout: 0
        })
  } catch (e) {
    toast.add(
        {
          id: 'alert',
          title: e.message,
          color: 'red',
          icon: "i-heroicons-exclamation-circle",
          timeout: 0
        })
  }
}
</script>
<template>
  <div class="sticky top-0 z-40 transform" style="transform:translate3d(0,0,999px)">
    <GuestHeader/>
  </div>
  <main class="relative min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 dark:text-white">
    <div class="sm:border-x sm:border-violet-900 py-6 px-16 h-screen shadow-lg w-full max-w-xl flex flex-col justify-center">
      <h1 class="text-2xl font-semibold text-center mb-6">Register</h1>
      <form @submit.prevent="signUp">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
          <input
              v-model="email"
              type="email"
              id="email"
              class="mt-1 block w-full px-3 py-2 border border-violet-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
          <input
              v-model="password"
              type="password"
              id="password"
              class="mt-1 block w-full px-3 py-2 border border-violet-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
          />
        </div>

        <div class="mb-6">
          <label for="confirmPassword"
                 class="block text-sm font-medium text-gray-700 dark:text-white">Confirm your password</label>
          <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              class="mt-1 block w-full px-3 py-2 border border-violet-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
          />
        </div>

        <button
            type="submit"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
      <div class="text-black cursor-pointer mt-4 dark:text-white" @click="$router.push('/login')">Vous avez un compte ?
        Connectez-vous
      </div>
    </div>
  </main>
  <UNotifications/>
</template>
