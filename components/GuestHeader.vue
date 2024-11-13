<script setup lang='ts'>

</script>
<template>
  <div class="absolute inset-0 h-full w-full dark:bg-gray-900 dark:text-white transition-opacity">
    <nav class="relative z-40 border-default border-b border-violet-900 backdrop-blur-sm transition-opacity">
      <div class="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
        <div class="flex items-center justify-between px-6 lg:px-0 flex-1 sm:items-stretch">
          <div class="flex items-center">
            <Logo />
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/login">
              <UButton square label="Sign In" color="violet" variant="outline"/>
            </NuxtLink>
            <NuxtLink to="/register">
              <UButton square label="Sign Up" color="black"/>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
