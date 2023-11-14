<script setup lang='ts'>
const props = defineProps<{
  max: number
  value: number
}>()

const progress = computed(() => (props.value / props.max) * 100)

const colorClass = computed(() => {
  if (progress.value <= 50) {
    return 'bg-green-600';
  } else if (progress.value <= 75) {
    return 'bg-orange-600';
  } else {
    return 'bg-red-600';
  }
})
</script>
<template>
  <div class="flex flex-col w-1/2 gap-2">
    <h2 class="text-sm mb-1">Usage restant : </h2>
    <div class="bg-gray-200 rounded-md h-4">
      <div :style="{ width: progress + '%' }" :class="colorClass" class="h-4 rounded-md"></div>
    </div>
    <span class="text-sm">{{ props.value + ' / ' + props.max + ' caractères' }}</span>
  </div>
</template>