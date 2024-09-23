<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})
const email = ref("")
const password = ref(null)
const errorMsg = ref(null)
const client = useSupabaseClient()
const router = useRouter()
const toast = useToast()


const signIn = async () => {
  try {
    const {data, error} = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (error) throw error
    await router.push('/dashboard/home')
  } catch (e) {
    toast.add(
        {
          id: 'alert',
          title: e.message,
          color: 'red',
          icon: "i-heroicons-exclamation-circle",
          timeout: 0
        })
    return
  }
}
</script>
<template>
  <div class="sticky top-0 z-40 transform" style="transform:translate3d(0,0,999px)">
    <GuestHeader/>
  </div>
  <main class="relative min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 dark:text-white">
    <div class="sm:border-x sm:border-violet-900 py-6 px-16 h-screen shadow-lg w-full max-w-xl flex flex-col justify-center">
      <h1 class="text-2xl font-semibold text-center mb-6">Login</h1>
      <form @submit.prevent="signIn">
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

        <button
            type="submit"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
      <div class="text-black cursor-pointer mt-4 dark:text-white" @click="$router.push('/register')">Si vous n'avez pas
        encore de compte ? Inscrivez vous
      </div>
      <div class="mt-4">
        <p v-if="errorMsg" class="mt-4 text-red-600 font-bold">{{ errorMsg }}</p>
      </div>
    </div>
  </main>
</template>
