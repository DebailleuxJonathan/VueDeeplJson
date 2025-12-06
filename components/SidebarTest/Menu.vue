<script setup lang='ts'>
const items = ref([
  {
    title: "Home",
    path: "/dashboard/home",
    icon : "material-symbols-light:home-outline"
  }, {
    title: "Overview",
    path: "/dashboard/overview",
    icon: "material-symbols-light:dashboard-outline"
  }, {
    title: "Translations",
    path: "/dashboard/translate",
    icon: "material-symbols-light:translate"
  }, {
    title: "Help",
    path: "/dashboard/help",
    icon: "material-symbols-light:help-outline"
  }
])
</script>
<template>
  <div class="h-full bg-gray-800">
    <header class="flex px-4 hover:scale-[101%] transition cursor-pointer">
      <Logo/>
    </header>
    <div class="px-4 grow">
      <div class="grid gap-2">
        <NuxtLink :href="item.path" v-for="(item, index) in items" :key="index" class="flex items-center gap-2 p-3 transition rounded cursor-pointer hover:bg-gray-900">
          <Icon size="20" :name="item.icon"></Icon>
          <span>{{ item.title }}</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
