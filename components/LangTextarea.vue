<script setup lang='ts'>
import {computed, ref, watch} from "vue";
import {ArrowDownTrayIcon, ArrowPathRoundedSquareIcon, ClipboardIcon, XMarkIcon} from "@heroicons/vue/24/outline"
import useDownloadFile from "~/composables/downloadFile";
import type {Languages} from "~/types/lang.js";

const props = withDefaults(defineProps<{
  language: any
  modelValue: string
  isLoaded?: boolean
  title: string
  placeholder?: string
  data: Languages[]
  canBeDelete?: boolean
  canBeReformat?: boolean
}>(), {
  isLoaded: true,
  placeholder: '',
  canBeDelete: true,
  canBeReformat: false
})

const {downloadFile} = useDownloadFile()

const lang = ref(props.language)

const emit = defineEmits<{
  (e: 'update:modelValue', text: string): void
  (e: 'update:lang', lang: string): void
  (e: 'delete'): void
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

const correctJsonIncludingQuotes = (jsonString: string) => {
  // Étape 1: Encapsule le JSON s'il manque des accolades
  let correctedString = jsonString.trim();
  if (!correctedString.startsWith('{')) {
    correctedString = `{${correctedString}`;
  }
  if (!correctedString.endsWith('}')) {
    correctedString += '}';
  }

  // Étape 2: Corrige les virgules supplémentaires et les guillemets manquants autour des clés
  correctedString = correctedString.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
  correctedString = correctedString.replace(/([{,]\s*)([^\s"{:]+)\s*:/g, '$1"$2":');

  // Étape 3: Tente de corriger les valeurs avec des guillemets ouvrants non fermés
  correctedString = correctedString.replace(/:\s*"([^"]*)$/gm, (_, match) => `: "${match}"`);
  correctedString = correctedString.replace(/:\s*"([^"]*),\s*"/gm, (_, match) => `: "${match}", "`);

  return correctedString;
}

const reformat = (text: string) => {
  // Applique la correction améliorée
  const correctedJson = correctJsonIncludingQuotes(text);
  try {
    // Tente de parser le JSON corrigé pour vérifier s'il est valide
    const parsed = JSON.parse(correctedJson);
    // Reformate le JSON valide pour une meilleure lisibilité
    value.value = JSON.stringify(parsed, null, 2);
  } catch (error) {
    // Retourne le message d'erreur si le JSON corrigé est toujours invalide
    return "Le JSON corrigé est toujours invalide : " + error;
  }
}

</script>
<template>
  <div v-if="props.language"
       class="z-10 flex flex-col gap-6 sm:mt-4 w-full bg-gray-50 p-4 border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white">
    <div>
      <div class="flex justify-between items-center">
        <div class="flex w-full justify-between items-center">
          <h1 class="p-2">{{ props.title }}</h1>
          <p v-if="isCopy" :class="isAnimationCopy && 'active'"
             class="pointer-events-none text-container text-sm p-2 bg-amber-500 text-white transition-all duration-300 rounded dark:bg-amber-700">
            {{ $t('buttons.copyText') }}</p>
          <p v-if="isDownload" :class="isAnimationDownload && 'active'"
             class="pointer-events-none text-container text-sm p-2 bg-blue-500 text-white transition-all duration-300 rounded dark:bg-blue-700">
            {{ $t('buttons.downloadText') }}</p>
          <p v-if="!props.isLoaded" class="block text-sm font-medium leading-6 text-green-900">
            {{ $t('buttons.waiting') }}
          </p>
        </div>
        <XMarkIcon v-if="canBeDelete" @click="emit('delete')" class="h-5 cursor-pointer"/>
      </div>
      <LangDropdown :data="data" :title="props.title" :is-loaded="props.isLoaded" :lang="lang" v-model="lang"/>
    </div>

    <div class="flex gap-3 flex-col">
      <div class="flex gap-3 w-max items-center">
        <div class="flex flex-col gap-4 w-full justify-end items-center">
          <button
              :disabled="value === ''"
              :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed dark:!bg-gray-700 dark:!text-gray-600'"
              class="w-max p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md cursor-pointer shadow transition-all duration-300 dark:border-amber-900 dark:bg-amber-700"
              @click="copy(value)"
          >
            <ClipboardIcon class="w-5 h-5"/>
          </button>

        </div>
        <div class="flex gap-2 w-full justify-end items-center">
          <button
              class="w-max p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer shadow transition-all duration-300 dark:border-blue-900 dark:bg-blue-700"
              @click="download"
              :disabled="value === ''"
              :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed dark:!bg-gray-700 dark:!text-gray-600'"
          >
            <ArrowDownTrayIcon class="w-5 h-5"/>
          </button>
        </div>
        <div v-if="props.canBeReformat" class="flex gap-2 w-full">
          <button
              class="w-max p-2 flex items-center gap-2 bg-purple-500 hover:bg-pruple-600 text-white rounded-md cursor-pointer shadow transition-all duration-300 dark:border-purple-900 dark:bg-purple-700"
              @click="reformat(value)"
              :disabled="value === ''"
              :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed dark:!bg-gray-700 dark:!text-gray-600'"
          >
            <ArrowPathRoundedSquareIcon class="w-5 h-5"/>
            <span class="text-sm">Formatter</span>
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 w-full">

      <div class="relative h-80 w-full">
        <textarea
            :placeholder="props.placeholder"
            v-model="value"
            type="json"
            class="w-full h-full border border-gray-200 rounded-lg py-1.5 pl-3 resize-none shadow-inner -z-10 dark:text-white dark:bg-gray-700 dark:border-gray-700"
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

