<script setup lang='ts'>
import {PaperAirplaneIcon, PlusIcon, ArrowDownTrayIcon} from "@heroicons/vue/24/outline"

</script>
<template>
  <div class="flex justify-center w-full">
    <div class="fixed flex flex-col gap-2 h-max w-max text-left bg-white border border-gray-600 py-5 px-8 top-2 z-50 rounded-md">
      <div class="flex gap-2">
        <button
            class="border p-2 border-black rounded-md cursor-pointer shadow"
        >
          <PlusIcon class="w-5 h-5"/>
        </button>
        <button
            class="border p-2 border-black rounded-md cursor-pointer shadow"
        >
          <PaperAirplaneIcon class="w-5 h-5"/>
        </button>
        <button
            class="border p-2 border-black rounded-md cursor-pointer shadow"
        >
          <ArrowDownTrayIcon class="w-5 h-5"/>
        </button>
      </div>
      <div class="text-center">
        arrow
      </div>
    </div>
  </div>
</template>
