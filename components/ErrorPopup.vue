<script setup lang="ts">
import {XMarkIcon} from "@heroicons/vue/24/outline"

const props = withDefaults(defineProps<{
  isVisible?: boolean,
  title?: string,
  description: string,
  steps?: string[]
}>(), {
  isVisible: false,
})

const isVisible = computed(() => props.isVisible)

const emit = defineEmits<{
  (e: 'resetCounter'): void
}>()
</script>

<template>
  <div v-if="isVisible"
       class="fixed z-50 top-4 right-4 w-1/2 bg-red-50 border border-red-300 rounded-md shadow p-4 text-red-800">
    <div class="flex items-center justify-between pb-2">
      <h3 v-if="props.title" class="text-lg font-semibold text-red-900">{{ props.title }}</h3>
      <button @click="emit('resetCounter')">
        <XMarkIcon class="w-5 h-5"/>
      </button>
    </div>
    <p>{{ props.description }}</p>
    <ul class="pl-8 list-disc">
      <li v-if="props.steps" v-for="step in props.steps" :key="step">
        {{ step }}
      </li>
    </ul>
  </div>
</template>