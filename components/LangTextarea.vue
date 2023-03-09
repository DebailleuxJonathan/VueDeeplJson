<script setup lang='ts'>
import {ref, watch} from "vue";
import {ClipboardIcon, ArrowDownTrayIcon} from "@heroicons/vue/24/outline"
import useDownloadFile from "~/composables/downloadFile";

const props = withDefaults(defineProps<{
  language?: string
  modelValue: string
  isLoaded?: boolean
  title?: string
  placeholder?: string
}>(), {
  isLoaded: true,
  placeholder: ''
})

const { downloadFile } = useDownloadFile()

const lang = ref(props.language)

const emit = defineEmits<{
  (e: 'update:modelValue', text: string): void
  (e: 'update:lang', lang: string): void
}>()

watch(lang, () => {
  if (lang.value){
    emit('update:lang', lang.value)
  }
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

const download = () => {
  isDownload.value = true
  downloadFile(value.value)
  setTimeout(() => {
    isDownload.value = false
  }, 2000)
}

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
    <div class="relative h-full">
      <textarea
          :placeholder="props.placeholder"
          v-model="value"
          type="json"
          class="w-full h-full border border-gray-200 rounded-md py-1.5 pl-3 shadow"
      />
      <div class="absolute top-0 right-0 flex flex-col gap-2 p-2">
        <div class="flex gap-2 w-full justify-end items-center">
          <p v-if="isCopy" class="text-amber-500">Texte copié !</p>
          <button class="w-max p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md cursor-pointer shadow" @click="copy(value)">
            <ClipboardIcon class="w-5 h-5"/>
          </button>
        </div>
        <div class="flex gap-2 w-full justify-end items-center">
          <p v-if="isDownload" class="text-blue-500">Texte téléchargé !</p>
          <button
              class="w-max p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer shadow"
              @click="download"
              :disabled="value === ''"
              :class="value === '' && '!bg-gray-50 !text-gray-400 cursor-not-allowed'"
          >
            <ArrowDownTrayIcon class="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
