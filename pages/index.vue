<script setup lang='ts'>
definePageMeta({
  middleware: 'guest'
});
</script>
<template>
  <div class="sticky top-0 z-40 transform" style="transform:translate3d(0,0,999px)">
    <GuestHeader/>
  </div>
  <main class="relative min-h-screen dark:bg-gray-900 dark:text-white">
    <div class="relative">
      <div
          class="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 xl:px-20 pt-8 md:pt-16 overflow-hidden">
        <div class="relative">
          <div class="mx-auto flex flex-col items-center gap-12">
            <div class="mx-auto max-w-2xl lg:col-span-6 lg:flex lg:items-center justify-center text-center">
              <div class="relative z-10 lg:h-auto pt-24 flex flex-col items-center justify-center gap-4">
                <div class="flex flex-col gap-12 items-center">
                  <h1 class="text-4xl font-bold">Your tool for <span class="text-violet-800">translations</span></h1>
                  <p class="text-xl">Devglot provides developers with a tool that lets them easily internalize their
                    application</p>
                </div>
              </div>

            </div>
            <div class="w-3/4">
              <video autoplay muted loop playsinline>
                <source src="/video/presentation_devglot.mp4" type="video/mp4">
              </video>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>
