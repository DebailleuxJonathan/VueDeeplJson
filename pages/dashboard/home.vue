<script setup lang='ts'>
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})
</script>
<template>
  <header>
    <h1>Dashboard</h1>
    <p>Coucou machin</p>

  </header>
</template>
<style>
body {
  @apply min-h-screen bg-white dark:bg-gray-900
}
</style>
