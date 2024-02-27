<script setup lang='ts'>
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue";
import {ChevronUpDownIcon, CheckIcon} from '@heroicons/vue/20/solid'
import type {Languages} from "~/types/lang.js";

const props = withDefaults(defineProps<{
  lang: any,
  isLoaded?: boolean
  title: string
  data: Languages[]
}>(), {
  isLoaded: true
})

const languages = ref(props.lang)

const availableLanguagesList = ref([])

const availableLanguages = computed(() => {
  props.data.forEach((data) => {
    availableLanguagesList.value.push({
      language: data.language,
      name: `${data.language} - ${data.name}`,
      supports_formality: false
    })
  })

  return availableLanguagesList.value
})

</script>
<template>
  <UInputMenu
      v-if="props.data.length > 0"
      size="lg"
      v-model="languages"
      :options="availableLanguages"
      option-attribute="name"
  >
    <template #option="{ option: person }">
      <span class="truncate">{{ person.name }}</span>
    </template>
  </UInputMenu>

</template>
