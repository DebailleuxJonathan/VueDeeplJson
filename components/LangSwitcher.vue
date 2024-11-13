<script setup lang="ts">
import useLocalStorage from "~/composables/localStorage";

const {locale, setLocale} = useI18n()
const {languages, localeLanguage} = useLocalStorage()

const formattedLanguages = ref(languages.value.map(lang => {
  return {name: lang.name, value: lang.language.toLowerCase()};
}))

const language = computed(() => {
  return formattedLanguages.value.find((language) => language.value.toLowerCase() === locale.value.toLowerCase())
});

const selectedOption = ref(language.value?.value);

const handleSelect = () => {
  setLocale(selectedOption.value)
  localeLanguage.value = selectedOption.value
}
watch(selectedOption, () => handleSelect())
</script>

<template>
  <Select v-model="selectedOption">
    <SelectTrigger class="w-full">
      <SelectValue :placeholder="language?.name"/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="(formattedLanguage, index) in formattedLanguages" :value="formattedLanguage?.value">
          {{ formattedLanguage?.name }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
