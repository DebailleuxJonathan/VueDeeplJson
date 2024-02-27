<script setup lang='ts'>
const props = defineProps<{
  max: number
  value: number
}>()

const progress = computed(() => (props.value / props.max) * 100)

const colorClass = computed(() => {
  switch (true) {
    case progress.value <= 50: return 'green'
    case progress.value <= 75: return 'amber'
    case progress.value <= 90: return 'orange'
    default: return 'red'
  }
})

</script>
<template>
  <div class="flex flex-col w-1/2 gap-2">
    <h2 class="text-sm mb-1">Usage restant : </h2>
    <UProgress :value="progress" size="lg" :color="colorClass" />
    <span class="text-sm">{{ props.value + ' / ' + props.max + ' caractères' }}</span>
  </div>
</template>