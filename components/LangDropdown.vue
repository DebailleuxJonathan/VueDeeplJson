<script setup lang='ts'>
import type {Languages} from "~/types/lang.js";
import useLocalStorage from "~/composables/localStorage";
import {isUsedLanguage} from "~/composables/listLanguages.js";

const props = withDefaults(defineProps<{
  lang: Languages,
  isLoaded?: boolean
  title: string
  data: Languages[]
}>(), {
  isLoaded: true
})
const {languages} = useLocalStorage()


const currentLanguage = ref<Languages>(props.lang)

// const availableLanguagesList = ref([])

// const availableLanguages = computed<Languages[]>(() => {
//   props.data.forEach((data) => {
//     availableLanguagesList.value.push({
//       language: data.language,
//       name: `${data.language} - ${data.name}`,
//       supports_formality: data.supports_formality,
//       isUsed: data.isUsed
//     })
//   })
//
//   return availableLanguagesList.value
// })

const emit = defineEmits<{
  (event: 'update:lang', newLang: any): void
}>()

let previousLanguage = currentLanguage.value

watch(currentLanguage, (newLang: Languages) => {
  console.log(isUsedLanguage(newLang.language))
  if(!isUsedLanguage(newLang.language)) {
    setUsedLanguage(previousLanguage.language, false)
    setUsedLanguage(newLang.language, true)
    previousLanguage = newLang
    emit('update:lang', newLang);
  }
});
</script>
<template>
  <UInputMenu
      v-if="props.data.length > 0"
      size="lg"
      v-model="currentLanguage"
      :options="languages"
      option-attribute="name"
  >
    <template #option="{ option: currentLanguage }">
      <span class="truncate cursor-pointer" :class="currentLanguage.isUsed ? 'text-gray-500 pointer-events-none italic' : 'text-white' ">{{ `${currentLanguage.language} - ${currentLanguage.name}` }}</span>
    </template>
  </UInputMenu>

</template>
