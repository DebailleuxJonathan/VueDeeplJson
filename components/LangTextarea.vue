<script setup lang='ts'>
import {ref, watch} from "vue";
import {ClipboardIcon} from "@heroicons/vue/24/outline"

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
  set(value: string) {
    emit('update:modelValue', value)
  }
})

const isCopy = ref(false)

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  isCopy.value = true
  setTimeout(() => {
    isCopy.value = false
  }, 2000)
}

</script>
<template>
  <div class="flex flex-col gap-3 h-full w-full">
    <LangDropdown :title="props.title" :is-loaded="props.isLoaded" :lang="lang" v-model="lang"/>
    <div class="w-full flex gap-2 items-center">
      <div class="w-max p-2 border border-gray-200 rounded-md cursor-pointer" @click="copy(value)">
        <ClipboardIcon class="w-5 h-5"/>
      </div>
      <p v-if="isCopy" class="text-green-500">Texte copié !</p>
    </div>
    <textarea
        :placeholder="props.placeholder"
        v-model="value"
        type="json"
        class="w-full h-96 border border-gray-200 rounded-md p-1"
    />
  </div>
</template>
