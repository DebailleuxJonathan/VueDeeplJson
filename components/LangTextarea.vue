<script setup lang='ts'>
import {ref, watch} from "vue";

const props = withDefaults(defineProps<{
  language: string
  modelValue: string
  isLoaded?: boolean
  title: string
  placeholder?: string
}>(), {
  isLoaded: true,
  placeholder: ''
})

const lang = ref(props.language)

const emit = defineEmits<{
  (e: 'update:modelValue', text: string): void
  (e: 'update:lang', lang: string): void
}>()

watch(lang, () => {
  emit('update:lang', lang.value)
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
<template>
  <div class="flex flex-col gap-3 h-full w-full">
    <LangDropdown :title="props.title" :is-loaded="props.isLoaded" :lang="lang" v-model="lang"/>
    <textarea
        :placeholder="props.placeholder"
        v-model="value"
        type="json"
        class="w-full h-full border border-gray-200 rounded-md p-1"
    />
  </div>
</template>
