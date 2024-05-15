<script setup lang='ts'>
import {useLanguages} from "~/composables/languages";
import {ref, computed, onMounted} from "vue";
import useDeepl from "~/composables/useDeepl";
import useDownloadFile from "~/composables/downloadFile";
import useConvertToJson from "~/composables/convertToJson";
import {ArrowDownTrayIcon, PlusIcon, ArrowUpTrayIcon} from "@heroicons/vue/24/outline"
import {SunIcon, MoonIcon} from "@heroicons/vue/24/solid"
import ErrorPopup from "~/components/ErrorPopup.vue";
import Toggle from "~/components/Toggle.vue";
import ProgressBar from "~/components/ProgressBar.vue";
import type {Languages, TextareaLanguageConfigs} from "~/types/lang.js";
import {isUsedLanguage, setUsedLanguage} from "~/composables/listLanguages.js";

const colorMode = useColorMode()

const {fetchLanguages, data, getLang} = useLanguages()
const {addTranslate, showUsage, fetchUsageDeepl} = useDeepl()
const {downloadFile} = useDownloadFile()
const {csvToJson} = useConvertToJson()
const toast = useToast()
const {t} = useI18n()

const textAreaLanguageConfigs = ref<TextareaLanguageConfigs[]>([])
const baseLanguage: any = ref(null)
const jsonText = ref('')
const errorJsonFormatCount = ref(0)
const errors = ref<any>({
  jsonFormat: ''
})
const isDisabled = ref(false)
const listLanguages = ref<Languages[]>([])
const tagsListLanguages = ref<Languages[]>([])
// const languagesUsed = ref<string[]>([])
const countNotLoaded = ref(0);
const isOpen = ref(false)


onMounted(async () => {
  await fetchLanguages()
  await fetchUsageDeepl()
  listLanguages.value = await data.value
  if (listLanguages.value) {

    textAreaLanguageConfigs.value = [
      {
        id: startIndexByLength.value,
        configs: getLang('EN-GB'),
        text: '',
        isLoaded: true,
        isOpen: true
      }
    ]

    baseLanguage.value = getLang('FR')

    tagsListLanguages.value = [...listLanguages.value.filter((language) => !language.isUsed)]
  }
})

const isTextAreasEmpty = computed(() => {
  for (let i = 0; i < textAreaLanguageConfigs.value.length; i++) {
    if (textAreaLanguageConfigs.value[i].text !== '') {
      return false
    }
  }
  return true
})

const updateBaseLanguage = (lang: string) => {
  if (listLanguages.value) {
    baseLanguage.value = getLang(lang)
  }
}

const startIndexByLength = ref(textAreaLanguageConfigs.value.length)

const format = ref('json')

const addTextArea = async () => {
  if (!isUsedLanguage(tagsListLanguages.value[startIndexByLength.value].language)) {
    const uniqueId = Date.now()
    textAreaLanguageConfigs.value.push({
      id: uniqueId,
      configs: tagsListLanguages.value[startIndexByLength.value],
      text: '',
      isLoaded: true,
      isOpen: false
    })

    setUsedLanguage(textAreaLanguageConfigs.value[startIndexByLength.value + 1].configs.language, true)

    setTimeout(() => {
      scrollToElement(tags.value[startIndexByLength.value])
    }, 50)
  }

  startIndexByLength.value++

}

const removeTextArea = (id: number) => {

  const index = textAreaLanguageConfigs.value.findIndex(ta => ta.id === id);
  setUsedLanguage(textAreaLanguageConfigs.value[index]?.configs.language, false)
  if (index !== -1) {
    textAreaLanguageConfigs.value.splice(index, 1);
  }

  startIndexByLength.value--
}

const updateTargetLanguage = (lang: any, index: number) => {
  const currentTextArea = textAreaLanguageConfigs.value.find((textArea) => textArea.id === index)
  if (currentTextArea) {
    currentTextArea.configs = getLang(lang)
    let mapTranslatedLanguage = textAreaLanguageConfigs.value.map(translatedLanguage => translatedLanguage.configs.language);
    const sortTranslatedLanguage = listLanguages.value.filter(objet => !mapTranslatedLanguage.includes(objet.language));
    listLanguages.value = sortTranslatedLanguage.filter(objet => baseLanguage.value.language !== objet.language);
    tagsListLanguages.value = listLanguages.value
  }

}


const submitTranslations = async () => {
  toast.add({id: 'loading', title: 'En cours de traduction...', timeout: 0})
  if (format.value === 'json') {
    try {
      for (const element of textAreaLanguageConfigs.value) {
        const newJson = JSON.parse(jsonText.value)
        isDisabled.value = true
        element.isLoaded = false
        const res = await addTranslate(newJson, baseLanguage.value.language, element.configs.language)
        element.text = JSON.stringify(res, null, 2);
        element.isLoaded = true
        countNotLoaded.value++
      }
      jsonText.value = JSON.stringify(JSON.parse(jsonText.value), null, 2)
      isDisabled.value = false
    } catch (e) {
      errorJsonFormatCount.value++
      errors.value.jsonFormat = t('errors.jsonFormat', {format: format.value})
    }
  } else if (format.value === 'csv') {
    try {
      const newJson = JSON.parse(csvToJson(jsonText.value))
      jsonText.value = JSON.stringify(newJson, null, 2)
      for (const element of textAreaLanguageConfigs.value) {
        isDisabled.value = true
        element.isLoaded = false
        const res = await addTranslate(newJson, baseLanguage.value.language, element.configs.language)
        element.text = JSON.stringify(res, null, 2);
        element.isLoaded = true
      }
      isDisabled.value = false
    } catch (e) {
      errors.value.jsonFormat = t('errors.jsonFormat', {format: format.value})
    }
  }
  countNotLoaded.value = 0
  toast.remove('loading')
}

const textAreasRef: any = ref([])

const tags: any = ref([])
//
// const objectToTranslate = {
// "test": "Coucou",
//     "members":
// {
//   "name": "Abricot",
//     "age": "dix-neuf",
//     "secretIdentity": "Poisson",
//     "powers": [
//   {
//     "test": "Coucou",
//     "members":
//         {
//           "name": "Fraise",
//           "age": "dix-huit",
//           "secretIdentity": "Scorpion",
//           "powers": [
//             "Saut",
//             "Pouvoir",
//             "Acrobate"
//           ]
//         }
//   }
// ]
// }
// }

const placeholder = {
  "test": t('placeholder.test'),
  "members": [
    {
      "name": t('placeholder.members.name'),
      "age": t('placeholder.members.age'),
      "secretIdentity": t('placeholder.members.secretIdentity')
    }
  ]
}

const totalJsonFile = computed(() => {
  const totalJson = []
  try {
    if (jsonText.value) {
      totalJson.push({
        lang: baseLanguage.value.language,
        ...JSON.parse(jsonText.value)
      })
      for (const el in textAreaLanguageConfigs.value) {
        totalJson.push({
          lang: textAreaLanguageConfigs.value[el].configs.language,
          ...JSON.parse(textAreaLanguageConfigs.value[el].text)
        })
      }
      return totalJson
    }
  } catch (e) {
    alert(t('errors.downloadAllFilesJson'))
  }
})

const upload = (event: any) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }

  if (['application/json', 'text/csv'].includes(file.type)) {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        jsonText.value = reader.result.toString()
      }
    }
    reader.readAsText(file)

    switch (file.type) {
      case 'application/json':
        return format.value = 'json'
      case 'text/csv':
        return format.value = 'csv'
    }
  } else {
    alert(t('errors.uploadWrongFormat'))
  }
  isOpen.value = false
}

const scrollToElement = (element: HTMLElement) => {
  element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

const advertisement = t('notifications.jsonFormatError.advertisement')
const steps: any = computed(() => {
  return [
    t('notifications.jsonFormatError.steps.first'),
    t('notifications.jsonFormatError.steps.second'),
    t('notifications.jsonFormatError.steps.third'),
    t('notifications.jsonFormatError.steps.forth'),
    `${JSON.stringify(placeholder, null, 2)}`
  ]
})

const toggleIconsThemeMode = [SunIcon, MoonIcon]

const setColorTheme = (themeMode: "light" | "dark") => {
  colorMode.value = themeMode ? 'light' : 'dark'
}

const allOpenState = ref(true)

const allOpen = () => {
  textAreaLanguageConfigs.value.forEach((config) => config.isOpen = allOpenState.value)
  allOpenState.value = !allOpenState.value
}

</script>
<template>
  <ErrorPopup
      @reset-counter="() => errorJsonFormatCount = 0"
      :is-visible="errorJsonFormatCount > 1"
      :description="advertisement"
      :steps="steps"
      title="Note:"
  />
  <div v-if="listLanguages?.length > 0" class="p-5 dark:bg-gray-900">
    <div
        class="w-full gap-3 p-4 bg-gray-100 rounded-sm flex flex-col justify-between items-center dark:bg-gray-800 dark:text-white ">
      <div class="flex justify-between w-full">
        <div class="flex flex-col w-full justify-center">
          <h1 class="text-4xl font-bold">{{ $t('header.title') }}</h1>
          <p class="font-light">{{ $t('header.subtitle') }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <LangSwitcher/>
          <div class="w-full flex justify-end">
            <Toggle @toggleValue="setColorTheme" :icons="toggleIconsThemeMode" :value="colorMode.value === 'dark'"/>
          </div>
        </div>
      </div>

    </div>
    <div v-if="showUsage?.character_count"
         class="w-full gap-3 p-4 bg-gray-100 rounded-sm mt-8 dark:bg-gray-800 dark:text-white">
      <ProgressBar class="mr-auto" :value="showUsage?.character_count" :max="showUsage.character_limit"/>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="w-full">
        <div class="sticky top-0">
          <div class="flex gap-3">
            <LangTextarea
                v-if="baseLanguage"
                id="sourceLangTitle"
                v-model="jsonText"
                @update:lang="updateBaseLanguage"
                :language="baseLanguage"
                :data="listLanguages"
                :title="$t('textarea.titleSourceLang')"
                :placeholder="'Ex: ' + JSON.stringify(placeholder, null, 2)"
                :can-be-delete="false"
                :can-be-reformat="true"
                @input="errors.jsonFormat = ''"
            >
              <div class="flex justify-end gap-3">
                <button
                    :disabled="isDisabled || !jsonText"
                    class="border border-gray-200 rounded-lg cursor-pointer py-2 px-3 shadow"
                    :class="isDisabled && 'bg-gray-50 cursor-wait' || jsonText ? 'bg-blue-500 text-white hover:bg-blue-600 dark:border-blue-900 dark:bg-blue-700' : 'bg-gray-50 !text-gray-400 !cursor-not-allowed dark:!bg-gray-700 dark:!text-gray-600 dark:!border-gray-600'"
                    @click="submitTranslations"
                >
                  {{ $t('buttons.translatedLang') }}
                </button>
                <button
                    @click="isOpen = true"
                    class="flex items-center justify-center border border-gray-200 rounded-lg cursor-pointer py-2 px-3 bg-white gap-3 hover:bg-gray-50 shadow dark:!bg-gray-700 dark:text-white dark:!border-gray-600 dark:hover:!bg-gray-500"
                >
                  <ArrowUpTrayIcon class="w-5 h-5"/>
                  <span>Import</span>
                </button>
              </div>
            </LangTextarea>
          </div>
          <span v-if="errors?.jsonFormat" class="text-red-600">{{ errors.jsonFormat }}</span>
          <div class="w-full flex mt-2">
            <UButton color="gray" @click="allOpen">{{
                allOpenState ? "Tout montrer" : "Tout cacher"
              }}
            </UButton>
          </div>
          <div class="flex flex-col w-full lg:flex-row gap-3 justify-between mt-3">
            <div class="w-full sm:w-max">
              <button
                  :disabled="isTextAreasEmpty"
                  @click="downloadFile(totalJsonFile)"
                  class="border w-full bg-blue-500 text-white rounded-lg cursor-pointer py-2 px-3 flex justify-center gap-3 hover:bg-blue-600 shadow transition-all duration-300 dark:border-blue-900 dark:bg-blue-700"
                  :class="isTextAreasEmpty && '!bg-gray-50 !text-gray-400 !cursor-not-allowed dark:!bg-gray-700 dark:!text-gray-600 dark:!border-gray-600'"
              >
                <ArrowDownTrayIcon class="w-5 h-5"/>
                {{ $t('buttons.download') }}
              </button>
            </div>
          </div>
          <div class="relative flex items-center w-full gap-3 top-0 z-40 mt-3">
            <button
                :disabled="isDisabled || !(textAreaLanguageConfigs.length - 2 < tagsListLanguages.length)"
                @click="addTextArea"
                class="flex items-center justify-center border border-gray-200 rounded-lg cursor-pointer py-2 px-3 bg-white gap-3 hover:bg-gray-50 shadow dark:!bg-gray-700 dark:text-white dark:!border-gray-600 dark:hover:!bg-gray-500"
                :class="isDisabled && 'bg-gray-50 cursor-wait' || !(textAreaLanguageConfigs.length - 2 < tagsListLanguages.length) && '!bg-gray-50 !text-gray-400 !cursor-not-allowed dark:!bg-gray-700 dark:!text-gray-600 dark:!border-gray-600'"
            >
              <PlusIcon class="w-5 h-5"/>
              {{ $t('buttons.addTranslations') }}
            </button>
            <ul class="flex overflow-x-auto w-full py-2">
              <li :ref="el => { tags[index] = el }" class="pr-2 cursor-pointer"
                  v-for="(textarea, index) in textAreaLanguageConfigs" @click="scrollToElement(textAreasRef[index])">
                <div v-if="textarea && baseLanguage">
                  <div
                      class="w-max bg-white border border-gray-300 px-4 py-2 rounded-lg relative inline-flex hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
                  >
                    <span v-if="textarea && textarea.configs && baseLanguage && baseLanguage.language">
                      {{ `${baseLanguage.language} / ${textarea.configs.language}` }}
                    </span>
                    <span v-if="index === textAreaLanguageConfigs.length - 1 && index > 1"
                          class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 dark:bg-amber-600"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500 dark:bg-amber-700"></span>
                  </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="flex flex-col w-full">
          <transition-group name="list" tag="div">
            <div class="transition-transform transform" :ref="el => { textAreasRef[index] = el }"
                 v-for="(textarea, index) in textAreaLanguageConfigs">
              <div v-if="textarea && baseLanguage">
                <LangTextarea
                    v-if="textarea"
                    :data="listLanguages"
                    v-model="textarea.text"
                    @update:lang="updateTargetLanguage($event, textarea.id)"
                    @delete="removeTextArea(textarea.id)"
                    :language="textarea.configs"
                    :is-loaded="textarea.isLoaded"
                    :can-be-delete="textAreaLanguageConfigs.length > 1"
                    :is-open="textarea.isOpen"
                    :title="$t('textarea.titleTranslatedLang', {translatedLang: `${baseLanguage.language} / ${textarea.configs.language}`})"
                />
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Importer votre fichier
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                   @click="isOpen = false"/>
        </div>
      </template>
      <div
          class="relative h-56 bg-amber-50 border border-amber-300 rounded-md shadow dark:bg-amber-700 dark:border-amber-900 dark:text-white">
        <input
            class="cursor-pointer relative block opacity-0 z-10 h-full w-full"
            ref="file"
            accept='application/json, text/csv'
            @change="upload($event)"
            type="file"
        >
        <div
            class="absolute text-center top-0 left-0 right-0 m-auto h-full flex flex-col justify-center pointer-events-none">
          <p class="z-20">{{ $t('uploadFile.title') }}</p>
          <span class="z-20 text-xs">{{ $t('uploadFile.format') }}</span>
        </div>

      </div>
    </UCard>
  </UModal>
  <UNotifications>
    <template #description>
      <p>En cours {{ countNotLoaded }} / {{ startIndexByLength + 1 }}</p>
    </template>
  </UNotifications>
</template>
<style>
body {
  @apply min-h-screen bg-white dark:bg-gray-900
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
  background: #0047e1;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.list-enter-to, .list-leave {
  opacity: 1;
  transform: translateY(0);
}
</style>
