import {ref} from 'vue'
import Languages from "~/types/lang";
import useLocalStorage from "~/composables/localStorage";

export const useLanguages = () => {
    const data: any = ref(null)
    const {languages} = useLocalStorage()
    const cachedData = languages.value

    const fetchLanguages = async () => {
        if (cachedData.length > 0) {
            data.value = cachedData
        } else {
            const res = await $fetch('/api/languages', {
                method: "get"
            })

            data.value = res
            languages.value = res
        }
    }

    const getLang = async (res: any, lang: any) => {
        if (res.length > 0) {
            return res.find((key: Languages) => key.language === (typeof lang === "string" ? lang : lang.language))
        }
    }

    return {
        data,
        fetchLanguages,
        languages,
        getLang,
    }
}
