import useLocalStorage from "~/composables/localStorage";

const {languages} = useLocalStorage()
import type {Languages} from "~/types/lang";

export const isUsedLanguage = (value: string) => {
    return languages.value.find((language: Languages) => language.language === value)?.isUsed
}

export const setUsedLanguage = (value: string, isUsed: boolean) => {
    if (languages.value.find((language: Languages) => language.language === value)) {
        return languages.value.find((language: Languages) => language.language === value).isUsed = isUsed
    }
}
