<template>
  <div class="grid sm:flex items-start">
    <div>
      <Sidebar />
    </div>
    <div class="h-screen w-full overflow-scroll p-4">
      <slot />
    </div>
  </div>
</template>
