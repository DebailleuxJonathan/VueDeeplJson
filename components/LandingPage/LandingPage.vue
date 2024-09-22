<script setup lang='ts'>
const router = useRouter()
</script>
<template>
  <div>
    <header class="flex justify-between items-center px-4 py-2 shadow-sm">
      <div class="flex items-center gap-3">
        <div>
          <img class="w-24 h-24" src="/img/devglt_logo_dark_theme.png" alt="logo"/>
        </div>
        <nav class="flex gap-3">
          <a href="#">Accueil</a>
          <a href="#">Fonctionnalités</a>
          <a href="#">Tarifs</a>
        </nav>
      </div>
      <nav>
        <ul>
          <li><NuxtLink to="/login/signup">Login</NuxtLink></li>
          <li><NuxtLink to="/login/signup">Sign up</NuxtLink></li>
          <li><NuxtLink to="/login/signup">Contact</NuxtLink></li>
        </ul>
      </nav>
    </header>
  </div>
</template>
