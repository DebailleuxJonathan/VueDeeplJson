<script setup lang="ts">
import {ref} from 'vue'
import useDeepl from "~/composables/useDeepl";
import useDownloadFile from "~/composables/downloadFile";
import LangTextarea from "~/components/LangTextarea.vue";
import {Lang} from "~/types/lang";
import {ArrowDownTrayIcon} from "@heroicons/vue/24/outline"

const {addTranslate, languages} = useDeepl()
const {downloadFile} = useDownloadFile()


const jsonText = ref('')

const getLanguage = (lang: string) => {
  return languages.value?.find((language: any) => language.language === lang)?.language
}

const sourceLang = ref(getLanguage('FR'))
const index = ref(1)
const errors = ref<any>({
  jsonFormat: ''
})


const isDisabled = ref(false)
const translatedLanguages = ref([
  {
    lang: getLanguage('EN-GB'),
    text: '',
    isLoaded: true
  },
  {
    lang: getLanguage('ES'),
    text: '',
    isLoaded: true
  }
])

// const startIndex = ref(translatedLanguages.value.length)

const testIndex = () => {
  const languageIndex: any = ref(languages.value)
  const test = translatedLanguages.value.filter((e) => languageIndex.value?.findIndex((obj: any) => obj.language === e.lang))
  for (const truc in test) {
    const machin = languageIndex.value?.findIndex((obj: any) => obj.language === test[truc].lang);
    if (machin !== -1) {
      languageIndex.value?.splice(machin, 1);
    }
  }

  return languageIndex.value
}

const startIndex = ref(-1)

const addTranslatedText = async () => {
  startIndex.value++
  translatedLanguages.value.push({
    lang: testIndex()[startIndex.value].language,
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

const multipleTranslate = async () => {
  try {
    for (const element of translatedLanguages.value) {
      const newJson = JSON.parse(jsonText.value)
      isDisabled.value = true
      element.isLoaded = false
      await translate(newJson, element.lang)
      element.text = JSON.stringify(newJson, null, 2);
      element.isLoaded = true
    }
    isDisabled.value = false
  } catch (e) {
    errors.value.jsonFormat = 'Format du JSON incorrect'
  }

}

const translate = async (json: any, e: any) => {
  for (const prop in json) {
    if (typeof json[prop] === "object" && !Array.isArray(json[prop])) {
      await translate(json[prop], e);
    } else if (Array.isArray(json[prop])) {
      for (const element of json[prop]) {
        const index1: number = json[prop].indexOf(element);
        if (typeof element === 'string') {
          const res: any = await addTranslate(element, sourceLang.value, e)
          json[prop][index1] = res.text
        } else if (typeof element === 'object') {
          await translate(element, e);
        }
      }
    } else if (typeof json[prop] === 'string') {
      const res: any = await addTranslate(json[prop], sourceLang.value, e)
      json[prop] = res.text
    }
  }
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
};

const placeholder = {
  "test": "Coucou",
  "members": [
    {
      "name": "Fraise",
      "age": "dix-huit",
      "secretIdentity": "Scorpion",
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

  if (['application/json'].includes(file.type)) {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        jsonText.value = reader.result.toString()
      }
    }
    reader.readAsText(file)
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
            <div class="flex gap-3">
              <button
                  :disabled="isDisabled"
                  class="border border-gray-200 shadow-sm rounded-lg cursor-pointer py-2 px-3 hover:bg-gray-50 shadow"
                  :class="isDisabled && 'bg-gray-50 cursor-wait'" @click="multipleTranslate"
              >
                Traduire
              </button>
              <button
                  :disabled="isDisabled || !(testIndex().length - 1 > translatedLanguages.length)"
                  @click="addTranslatedText"
                  class="border border-gray-200 shadow-sm rounded-lg cursor-pointer py-2 px-3  gap-3 hover:bg-gray-50 shadow"
                  :class="isDisabled && 'bg-gray-50 cursor-wait' || !(testIndex().length - 1 > translatedLanguages.length) && 'bg-gray-50 cursor-not-allowed'"
              >
                Ajouter un textarea
              </button>
            </div>
            <div>
              <button
                  :disabled="isTextareasEmpty"
                  @click="downloadFile(totalJsonFile)"
                  class="border bg-blue-500 text-white shadow-sm rounded-lg cursor-pointer py-2 px-3 flex gap-3 hover:bg-blue-600 shadow"
                  :class="isTextareasEmpty && '!bg-gray-50 !text-gray-400 cursor-not-allowed'"
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
                accept='application/json'
                @change="upload($event)"
                type="file"
            >
            <div
                class="absolute text-center top-0 left-0 right-0 m-auto h-full flex flex-col justify-center pointer-events-none">
              <p class="z-20">Sélectionner ou glisser un fichier</p>
              <span class="z-20 text-xs">au format JSON</span>
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
