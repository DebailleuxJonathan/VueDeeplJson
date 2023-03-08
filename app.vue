<script setup lang="ts">
import {ref} from 'vue'
import useDeepl from "~/composables/useDeepl";
import LangTextarea from "~/components/LangTextarea.vue";
import {Lang} from "~/types/lang";

const {addTranslate} = useDeepl()

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
          const res = await addTranslate(element, sourceLang.value, e)
          json[prop][index1] = res.text
        } else if (typeof element === 'object') {
          await translate(element, e);
        }
      }
    } else if (typeof json[prop] === 'string') {
      const res = await addTranslate(json[prop], sourceLang.value, e)
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
              title="Langue de base"
              :placeholder="'Ex: ' + JSON.stringify(placeholder, null, 2)"
              @input="errors.jsonFormat = ''"
          />
        </div>
        <span v-if="errors?.jsonFormat" class="text-red-600">{{ errors.jsonFormat }}</span>
        <div class="flex flex-col gap-3 mt-3">
          <div class="flex gap-3">
            <button
                :disabled="isDisabled"
                class="border border-gray-200 shadow-sm rounded-lg cursor-pointer py-2 px-3 hover:bg-gray-50"
                :class="isDisabled && 'bg-gray-50 cursor-wait'" @click="multipleTranslate"
            >
              Traduire
            </button>
            <button
                :disabled="isDisabled || !(Object.keys(Lang).length - 1 > translatedLanguages.length)"
                @click="addTranslatedText"
                class="border border-gray-200 shadow-sm rounded-lg cursor-pointer py-2 px-3  gap-3 hover:bg-gray-50"
                :class="isDisabled && 'bg-gray-50 cursor-wait' || !(Object.keys(Lang).length - 1 > translatedLanguages.length) && 'bg-gray-50 cursor-not-allowed'"
            >
              Ajouter un textarea
            </button>
          </div>
          <div class="relative h-56 bg-gray-50 border border-gray-300 rounded-md">
            <input
                class="cursor-pointer relative block opacity-0 z-10 h-full w-full"
                ref="file"
                accept='application/json'
                @change="upload($event)"
                type="file"
            >
            <div class="absolute text-center top-0 left-0 right-0 m-auto h-full flex flex-col justify-center pointer-events-none">
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
                title="Traduction"
            />
          </div>
        </div>

      </div>
    </div>


  </div>
</template>
