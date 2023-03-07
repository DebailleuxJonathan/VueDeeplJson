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
    const newJson = JSON.parse(jsonText.value)
    isDisabled.value = true
    for (const element of translatedLanguages.value) {
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


</script>
<template>
  <div class="p-5">
    <h1 class="text-2xl font-semibold">Traduction JSON Deepl</h1>
    <div class="mt-8 flex gap-3 h-96">
      <LangTextarea
          class="w-2/3"
          v-model="jsonText"
          @update:lang="updateSourceLang"
          :language="sourceLang"
          title="Langue de base"
          :placeholder="'Ex: ' + JSON.stringify(placeholder, null, 2)"
          @input="errors.jsonFormat = ''"
      />
      <div class="flex flex-col justify-end gap-3">
        <button
            :disabled="isDisabled"
            class="border border-gray-200 shadow-sm rounded-lg cursor-pointer p-2 hover:bg-gray-50"
            :class="isDisabled && 'bg-gray-50 cursor-wait'" @click="multipleTranslate"
        >
          Traduire
        </button>
        <button
            :disabled="isDisabled"
            @click="addTranslatedText"
            v-if="Object.keys(Lang).length - 1 > translatedLanguages.length"
            class="flex border border-gray-200 shadow-sm rounded-lg cursor-pointer p-2 gap-3 hover:bg-gray-50"
            :class="isDisabled && 'bg-gray-50 cursor-wait'"
        >
          Ajouter un textarea
        </button>
      </div>
    </div>
    <span v-if="errors?.jsonFormat" class="text-red-600">{{ errors.jsonFormat }}</span>
    <div class="grid grid-cols-2 auto-rows-auto gap-3 w-full mt-5">
      <div class="h-96" v-for="(textarea, index) in translatedLanguages">
        <LangTextarea
            v-model="textarea.text"
            @update:lang="updateTargetLang($event, index)"
            :language="textarea.lang"
            :is-loaded="textarea.isLoaded"
            title="Traduction"
        />
      </div>
    </div>
  </div>
</template>
