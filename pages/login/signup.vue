<template>
  <div>
    <h1>Sign Up</h1>
    <form class="flex justify-center items-center min-h-screen" @submit.prevent="register">
      <div class="flex flex-col mx-auto gap-3 border border-indigo-600 p-12 rounded-md shadow-md">
        <input class="py-1 px-2 rounded-md" v-model="email" type="email" placeholder="Email" required />
        <input class="py-1 px-2 rounded-md" v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const { $firebase } = useNuxtApp()

const register = async () => {
  try {
    await createUserWithEmailAndPassword($firebase.auth, email.value, password.value)
    alert('User registered successfully')
  } catch (error) {
    alert(error.message)
  }
}
</script>
