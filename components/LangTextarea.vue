<script setup lang='ts'>
import {ref, watch} from "vue";
import {ClipboardIcon, ArrowDownTrayIcon} from "@heroicons/vue/24/outline"
import useDownloadFile from "~/composables/downloadFile";

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

const {downloadFile} = useDownloadFile()

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
const isDownload = ref(false)
const isAnimationCopy = ref(false)
const isAnimationDownload = ref(false)

const download = async () => {
  isDownload.value = true
  try {
    downloadFile(JSON.parse(value.value))
    await new Promise(resolve => setTimeout(resolve, 50))
    isAnimationDownload.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    isAnimationDownload.value = false
    await new Promise(resolve => setTimeout(resolve, 500))
    isDownload.value = false
  } catch (e) {
    alert("Problème dans l'un des formats JSON")
  }
}

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text)
  isCopy.value = true
  await new Promise(resolve => setTimeout(resolve, 50))
  isAnimationCopy.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  isAnimationCopy.value = false
  await new Promise(resolve => setTimeout(resolve, 500))
  isCopy.value = false
}

</script>
<template>
  <div class="flex flex-col gap-6 sm:mt-4 w-full bg-gray-50 p-4 border border-gray-100 rounded-lg shadow">
    <div class="flex w-full justify-between items-center">
      <h1 class="p-2">{{ props.title }}</h1>
      <p v-if="isCopy" :class="isAnimationCopy && 'active'"
         class="pointer-events-none text-container text-sm p-2 bg-amber-500 text-white transition-all duration-300 rounded">
        Texte copié !</p>
      <p v-if="isDownload" :class="isAnimationDownload && 'active'"
         class="pointer-events-none text-container text-sm p-2 bg-blue-500 text-white transition-all duration-300 rounded">
        Texte téléchargé !</p>
      <p v-if="!props.isLoaded" class="block text-sm font-medium leading-6 text-green-900">En attente...
      </p>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 w-full">
      <div class="flex gap-3 flex-col">
        <LangDropdown :title="props.title" :is-loaded="props.isLoaded" :lang="lang" v-model="lang"/>
        <div class="flex gap-3 w-max">
          <div class="flex flex-col gap-4 w-full justify-end items-center">
            <button
                :disabled="value === ''"
                :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
                class="w-max p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md cursor-pointer shadow transition-all duration-300"
                @click="copy(value)"
            >
              <ClipboardIcon class="w-5 h-5"/>
            </button>

          </div>
          <div class="flex gap-2 w-full justify-end items-center">
            <button
                class="w-max p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer shadow transition-all duration-300"
                @click="download"
                :disabled="value === ''"
                :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
            >
              <ArrowDownTrayIcon class="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      <div class="relative h-80 w-full">
      <textarea
          :placeholder="props.placeholder"
          v-model="value"
          type="json"
          class="w-full h-full border border-gray-200 rounded-lg py-1.5 pl-3 resize-none shadow-inner"
      />
      </div>
    </div>
  </div>
</template>
<style>
.text-container {
  position: relative;
  transform: translateX(20%);
  opacity: 0;
  transition: all 0.5s ease;
}

.text-container.active {
  transform: translateX(0);
  opacity: 1;
}
</style>

