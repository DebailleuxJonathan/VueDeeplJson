<template>
  <Switch v-model="enabled"
          @click="emit('toggleValue', enabled)"
          :class="['bg-gray-200 dark:bg-gray-700', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2']">
    <span
        :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-gray-900']">
      <span
          :class="[enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
          aria-hidden="true">
        <component v-if="props.icons" :is="props.icons[0]" class="w-3 h-4 text-gray-400 dark:text-white"/>
      </span>
      <span
          :class="[enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
          aria-hidden="true">
        <component v-if="props.icons" :is="props.icons[1]" class="w-3 h-4 text-gray-400 dark:text-white"/>
      </span>
    </span>
  </Switch>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Switch} from '@headlessui/vue'

const props = defineProps<{
  value: boolean
  icons?: []
}>()

const emit = defineEmits<{
  (e: 'toggleValue', enabled): boolean
}>()

const enabled = ref(props.value)
</script>