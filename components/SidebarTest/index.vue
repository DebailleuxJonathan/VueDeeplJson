<script setup lang='ts'>
const open = ref(false)

</script>
<template>
  <div class="sm:relative">
    <!--    Mobile-->
    <div class="z-50 flex items-center justify-between w-full h-full p-4 sm:hidden">
      <Logo/>
      <Icon class="z-50 cursor-pointer left-2 top-2" name="iconamoon:menu-burger-horizontal-thin"
            @click="open = !open"/>
      <div v-if="open" class="fixed top-0 left-0 z-50 w-full h-full h-screen">
        <Icon class="absolute top-4 right-4 z-50 cursor-pointer" name="material-symbols:close"
              @click="open = !open"/>
        <SidebarMenu/>
      </div>
    </div>
    <!--    Desktop-->
    <div class="hidden sm:flex w-[250px] h-screen flex flex-col justify-between border-r border-gray-700 bg-gray-800">
      <SidebarMenu/>
      <UserItem />
    </div>
  </div>
</template>
