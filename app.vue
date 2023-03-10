<script setup lang="ts">
import {ref} from 'vue'
import useDeepl from "~/composables/useDeepl";
import useDownloadFile from "~/composables/downloadFile";
import LangTextarea from "~/components/LangTextarea.vue";
import {Lang} from "~/types/lang";
import {ArrowDownTrayIcon} from "@heroicons/vue/24/outline"
import useConvertToJson from "~/composables/convertToJson";
import FormatDropdown from "~/components/FormatDropdown.vue";

const {addTranslate} = useDeepl()
const {downloadFile} = useDownloadFile()
const {csvToJson} = useConvertToJson()

const jsonText = ref('')

const sourceLang = ref(Lang.FR)
const index = ref(1)
const errors = ref<any>({
  jsonFormat: ''
})

const isDisabled = ref(false)
const translatedLanguages = ref([
  {
    lang: Object.keys(Lang)[index.value],
    text: '',
    isLoaded: true
  },
  {
    lang: Object.keys(Lang)[index.value + 1],
    text: '',
    isLoaded: true
  }
])

const startIndex = ref(translatedLanguages.value.length)

const format = ref('json')

const addTranslatedText = async () => {
  startIndex.value++
  translatedLanguages.value.push({
    lang: Object.keys(Lang)[startIndex.value],
    text: '',
    isLoaded: true
  })
}

const updateSourceLang = (lang: Lang) => {
  sourceLang.value = lang
}
const updateTargetLang = (lang: Lang, index: number) => {
  translatedLanguages.value[index].lang = lang
}
const array:any = ref([])

const multipleTranslate = async () => {
  if (format.value === 'json') {
    try {
      for (const element of translatedLanguages.value) {
        const newJson = JSON.parse(jsonText.value)
        isDisabled.value = true
        element.isLoaded = false
        await getWordTranslatable(newJson, element.lang)
        const res = await addTranslate(array.value, sourceLang.value,  element.lang)
        const testSplit = res.text.split('; ')
        await translate(newJson, testSplit)
        element.text = JSON.stringify(newJson, null, 2);
        element.isLoaded = true
        array.value = []
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
        await getWordTranslatable(newJson, element.lang)
        const res = await addTranslate(array.value, sourceLang.value,  element.lang)
        const testSplit = res.text.split('; ')
        await translate(newJson, testSplit)
        element.text = JSON.stringify(newJson, null, 2);
        element.isLoaded = true
        array.value = []
      }
      isDisabled.value = false
    } catch (e) {
      errors.value.jsonFormat = 'Format du CSV incorrect'
    }
  }
}

const getWordTranslatable = async (json: any, e: any) => {
  for (const prop in json) {
    if (typeof json[prop] === "object" && !Array.isArray(json[prop])) {
      await getWordTranslatable(json[prop], e);
    }
    else if (Array.isArray(json[prop])) {
      for (const element of json[prop]) {
        if (typeof element === 'string') {
          array.value.push(element)
        }
        else if (typeof element === 'object') {
          await getWordTranslatable(element, e);
        }
      }
    }
    else if (typeof json[prop] === 'string') {
      array.value.push(json[prop])
    }
  }
}

let indexTranslate = 0

const translate = (json: any, split: any) => {
  for (const prop in json) {
    if (typeof json[prop] === "object" && !Array.isArray(json[prop])) {
      translate(json[prop], split)
    }
    else if (Array.isArray(json[prop])){
      for (const element of json[prop]) {
        const index1: number = json[prop].indexOf(element);
        if (typeof element === 'string') {
          json[prop][index1] = split[indexTranslate]
          indexTranslate++
        }
        else if (typeof element === 'object') {
          translate(element, split)
        }
      }
    }
    else if(typeof json[prop] === "string") {
      json[prop] = split[indexTranslate]
    }
    indexTranslate++
  }
  indexTranslate = 0
}

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

const isTextareasEmpty = computed(() => {
  for (let i = 0; i < translatedLanguages.value.length; i++) {
    if (translatedLanguages.value[i].text !== '') {
      return false
    }
  }
  return true
})

const totalJsonFile = computed(() => {
  const totalJson = []
  try {
    if (jsonText.value) {
      totalJson.push({
        lang: sourceLang.value,
        ...JSON.parse(jsonText.value)
      })
      for (const el in translatedLanguages.value) {
        totalJson.push({
          lang: translatedLanguages.value[el].lang,
          ...JSON.parse(translatedLanguages.value[el].text)
        })
      }
      return totalJson
    }
  } catch (e) {
    return "Problème dans l'un des formats JSON"
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
</script>
<template>
  <div class="p-5">
    <h1 class="text-2xl font-semibold">Traduction JSON Deepl</h1>
    <div class="flex flex-col md:flex-row gap-4 mt-8">
      <div class="w-full">
        <div class="sticky top-0">

          <div class="flex gap-3 h-96">
            <LangTextarea
                v-model="jsonText"
                @update:lang="updateSourceLang"
                :language="sourceLang"
                title="Langue choisie"
                :placeholder="'Ex: ' + JSON.stringify(placeholder, null, 2)"
                @input="errors.jsonFormat = ''"
            />
          </div>
          <span v-if="errors?.jsonFormat" class="text-red-600">{{ errors.jsonFormat }}</span>
          <div class="flex flex-col gap-3 mt-3">
            <div class="flex flex-col lg:flex-row gap-3 justify-between">
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                    :disabled="isDisabled"
                    class="border border-gray-200 rounded-lg cursor-pointer py-2 px-3 hover:bg-gray-50 shadow"
                    :class="isDisabled && 'bg-gray-50 cursor-wait'" @click="multipleTranslate"
                >
                  Traduire
                </button>
                <button
                    :disabled="isDisabled || !(Object.keys(Lang).length - 1 > translatedLanguages.length)"
                    @click="addTranslatedText"
                    class="border border-gray-200 rounded-lg cursor-pointer py-2 px-3  gap-3 hover:bg-gray-50 shadow"
                    :class="isDisabled && 'bg-gray-50 cursor-wait' || !(Object.keys(Lang).length - 1 > translatedLanguages.length) && 'bg-gray-50 cursor-not-allowed'"
                >
                  Ajouter un champ
                </button>
                <FormatDropdown class="z-50 cursor-pointer rounded-md" :format="format" v-model="format"/>
              </div>
              <div>
                <button
                    :disabled="isTextareasEmpty"
                    @click="downloadFile(totalJsonFile)"
                    class="border bg-blue-500 text-white rounded-lg cursor-pointer py-2 px-3 flex gap-3 hover:bg-blue-600 shadow"
                    :class="isTextareasEmpty && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
                >
                  <ArrowDownTrayIcon class="w-5 h-5"/>
                  Télécharger
                </button>
              </div>
            </div>
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
        <div class="grid grid-rows-2 grid-cols-1 gap-3 w-full">
          <div class="h-96" v-for="(textarea, index) in translatedLanguages">
            <LangTextarea
                v-model="textarea.text"
                @update:lang="updateTargetLang($event, index)"
                @focus="$event.target.select()"
                :language="textarea.lang"
                :is-loaded="textarea.isLoaded"
                :title="`Traduction ${sourceLang} - ${textarea.lang}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
