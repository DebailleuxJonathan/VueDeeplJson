<script setup lang='ts'>
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})
</script>
<template>
  <div class="flex items-center gap-3 p-4 rounded w-full bg-gray-800 border border-gray-700">
    <Icon size="30" name="material-symbols-light:settings-outline"/>
    <p class="text-xl font-semibold">Configurations</p>
  </div>
</template>
