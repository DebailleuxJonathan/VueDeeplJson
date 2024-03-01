import {ref} from 'vue'
import type {Languages} from "~/types/lang.js";
import useLocalStorage from "~/composables/localStorage";

export const useLanguages = () => {
    const data: any = ref(null)
    const {languages} = useLocalStorage()
    const cachedData = languages.value

    const fetchLanguages = async () => {
        if (cachedData.length > 0) {
            await cachedData.forEach((language: Languages) => language.isUsed = false)
            data.value = cachedData
        } else {
            const res = await $fetch('/api/languages', {
                method: "get"
            })

            await res.forEach((language: Languages) => language.isUsed = false)
            data.value = res
            languages.value = res
            languages.value.forEach((language: Languages) => language.isUsed = false)
        }
    }

    const getLang = (lang: any) => {
        if (languages.value.length > 0) {
            const currentLanguage = languages.value.find((key: Languages) => key.language === (typeof lang === "string" ? lang : lang.language))
            currentLanguage.isUsed = true
            return currentLanguage
        }
    }

    return {
        data,
        fetchLanguages,
        languages,
        getLang,
    }
}
