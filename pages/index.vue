<script setup lang='ts'>
import {useLanguages} from "~/composables/languages";
import {ref} from "vue";
import useDeepl from "~/composables/useDeepl";
import useDownloadFile from "~/composables/downloadFile";
import useConvertToJson from "~/composables/convertToJson";
import {ArrowDownTrayIcon, PlusIcon} from "@heroicons/vue/24/outline"
import FormatDropdown from "~/components/FormatDropdown.vue";
import Languages from "~/types/lang";

const {fetchLanguages, data, getLang} = useLanguages()
const {addTranslate} = useDeepl()
const {downloadFile} = useDownloadFile()
const {csvToJson} = useConvertToJson()

const translatedLanguages: any = ref([])
const sourceLang: any = ref(null)
const jsonText = ref('')
const index = ref(1)
const errors = ref<any>({
  jsonFormat: ''
})
const isDisabled = ref(false)
const listLanguages = ref<Languages[]>([])

onMounted(async () => {
  await fetchLanguages()
  listLanguages.value = data.value

  translatedLanguages.value = [
    {
      lang: await getLang(listLanguages.value, 'EN-GB'),
      text: '',
      isLoaded: true
    },
    {
      lang: await getLang(listLanguages.value, 'ES'),
      text: '',
      isLoaded: true
    }
  ]

  sourceLang.value = await getLang(listLanguages.value, 'FR')
})

const isTextareasEmpty = computed(() => {
  for (let i = 0; i < translatedLanguages.value.length; i++) {
    if (translatedLanguages.value[i].text !== '') {
      return false
    }
  }
  return true
})

const updateSourceLang = async (lang: string) => {
  if (listLanguages.value) {
    sourceLang.value = await getLang(listLanguages.value, lang)
  }
}

const startIndex = ref(translatedLanguages.value.length)

const format = ref('json')

const addTranslatedText = async () => {
  startIndex.value++

  translatedLanguages.value.push({
    lang: listLanguages.value[startIndex.value],
    text: '',
    isLoaded: true
  })
  setTimeout(() => {
    scrollToElement(tags.value[startIndex.value - 1])
  }, 50)
}

const updateTargetLang = async (lang: Languages, index: number) => {
  translatedLanguages.value[index].lang = await getLang(listLanguages.value, lang)
}

const multipleTranslate = async () => {
  if (format.value === 'json') {
    try {
      for (const element of translatedLanguages.value) {
        const newJson = JSON.parse(jsonText.value)
        isDisabled.value = true
        element.isLoaded = false
        const res = await addTranslate(newJson, sourceLang.value.language, element.lang.language)
        element.text = JSON.stringify(res, null, 2);
        element.isLoaded = true
      }
      isDisabled.value = false
    } catch (e) {
      errors.value.jsonFormat = 'Format du JSON incorrect'
    }
  } else if (format.value === 'csv') {
    try {
      const newJson = JSON.parse(csvToJson(jsonText.value))
      jsonText.value = JSON.stringify(newJson, null, 2)
      for (const element of translatedLanguages.value) {
        isDisabled.value = true
        element.isLoaded = false
        const res = await addTranslate(newJson, sourceLang.value.language, element.lang.language)
        element.text = JSON.stringify(res, null, 2);
        element.isLoaded = true
      }
      isDisabled.value = false
    } catch (e) {
      errors.value.jsonFormat = 'Format du CSV incorrect'
    }
  }
}

const textareas: any = ref([])

const tags: any = ref([])

const objectToTranslate = {
  "test": "Coucou",
  "members": [
    {
      "name": "Abricot",
      "age": "dix-neuf",
      "secretIdentity": "Poisson",
      "powers": [
        {
          "test": "Coucou",
          "members": [
            {
              "name": "Fraise",
              "age": "dix-huit",
              "secretIdentity": "Scorpion",
              "powers": [
                "Saut",
                "Pouvoir",
                "Acrobate"
              ]
            }
          ]
        }
      ]
    }
  ]
}

const placeholder = {
  "test": "Coucou",
  "members": [
    {
      "name": "Fraise",
      "age": "dix-huit",
      "secretIdentity": "Scorpion"
    }
  ]
}

const totalJsonFile = computed(() => {
  const totalJson = []
  try {
    if (jsonText.value) {
      totalJson.push({
        lang: sourceLang.value.language,
        ...JSON.parse(jsonText.value)
      })
      for (const el in translatedLanguages.value) {
        totalJson.push({
          lang: translatedLanguages.value[el].lang.language,
          ...JSON.parse(translatedLanguages.value[el].text)
        })
      }
      return totalJson
    }
  } catch (e) {
    alert("Problème dans l'un des formats JSON")
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
    alert('Mauvais format de fichier')
  }
}

const scrollToElement = (element: HTMLElement) => {
  element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

</script>
<template>
  <div v-if="listLanguages?.length > 0" class="p-5">
    <h1 class="text-2xl font-semibold">Traduction JSON Deepl</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div class="w-full">
        <div class="sticky top-0">
          <div class="flex gap-3">
            <LangTextarea
                v-if="sourceLang"
                id="sourceLangTitle"
                v-model="jsonText"
                @update:lang="updateSourceLang"
                :language="sourceLang"
                :data="listLanguages"
                title="Langue choisie"
                :placeholder="'Ex: ' + JSON.stringify(placeholder, null, 2)"
                @input="errors.jsonFormat = ''"
            />
          </div>
          <span v-if="errors?.jsonFormat" class="text-red-600">{{ errors.jsonFormat }}</span>
          <div class="relative flex items-center w-full gap-3 top-0 z-50">
            <ul class="flex overflow-x-auto w-full pb-2">
              <li :ref="el => { tags[index] = el }" class="pr-2 cursor-pointer"
                  v-for="(textarea, index) in translatedLanguages" @click="scrollToElement(textareas[index])">
                <div v-if="textarea && sourceLang">
                  <div
                      class="w-max bg-white border border-gray-300 mt-4 px-4 py-2 rounded-lg relative inline-flex hover:bg-gray-50">
                    {{ `${sourceLang.language} / ${textarea.lang.language}` }}
                    <span v-if="index === translatedLanguages.length - 1 && index > 1"
                          class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="flex flex-col w-full lg:flex-row gap-3 justify-between">
            <div class="w-full flex-wrap flex flex-col sm:flex-row gap-3">
              <button
                  :disabled="isDisabled || !jsonText"
                  class="border border-gray-200 rounded-lg cursor-pointer py-2 px-3 shadow"
                  :class="isDisabled && 'bg-gray-50 cursor-wait' || jsonText ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-50 !text-gray-400 !cursor-not-allowed'"
                  @click="multipleTranslate"
              >
                Traduire
              </button>
              <button
                  :disabled="isDisabled || !(listLanguages.length - 1 > translatedLanguages.length)"
                  @click="addTranslatedText"
                  class="flex items-center justify-center border border-gray-200 rounded-lg cursor-pointer py-2 px-3 bg-white gap-3 hover:bg-gray-50 shadow"
                  :class="isDisabled && 'bg-gray-50 cursor-wait' || !(listLanguages.length - 1 > translatedLanguages.length) && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
              >
                <PlusIcon class="w-5 h-5"/>
                {{ 'traductions' }}
              </button>
              <FormatDropdown class="cursor-pointer rounded-md" :format="format" v-model="format"/>
            </div>
            <div class="w-full sm:w-max">
              <button
                  :disabled="isTextareasEmpty"
                  @click="downloadFile(totalJsonFile)"
                  class="border w-full bg-blue-500 text-white rounded-lg cursor-pointer py-2 px-3 flex justify-center gap-3 hover:bg-blue-600 shadow transition-all duration-300"
                  :class="isTextareasEmpty && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
              >
                <ArrowDownTrayIcon class="w-5 h-5"/>
                Télécharger
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-4 mt-4">
            <div class="relative h-56 bg-amber-50 border border-amber-300 rounded-md shadow">
              <input
                  class="cursor-pointer relative block opacity-0 z-10 h-full w-full"
                  ref="file"
                  accept='application/json, text/csv'
                  @change="upload($event)"
                  type="file"
              >
              <div
                  class="absolute text-center top-0 left-0 right-0 m-auto h-full flex flex-col justify-center pointer-events-none">
                <p class="z-20">Sélectionner ou glisser un fichier</p>
                <span class="z-20 text-xs">au format .json / .csv</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="flex flex-col w-full">
          <div :ref="el => { textareas[index] = el }" v-for="(textarea, index) in translatedLanguages">
            <div v-if="textarea && sourceLang">
              <LangTextarea
                  v-if="textarea"
                  :data="listLanguages"
                  v-model="textarea.text"
                  @update:lang="updateTargetLang($event, index)"
                  @focus="$event.target.select()"
                  :language="textarea.lang"
                  :is-loaded="textarea.isLoaded"
                  :title="`Traduction ${sourceLang.language} / ${textarea.lang.language}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
