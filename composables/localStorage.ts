import {RemovableRef, useStorage} from "@vueuse/core";
import { Languages } from '~/types/lang'

const languages: RemovableRef<Languages[]> = useStorage('languages', [])
const localeLanguage: RemovableRef<string> = useStorage('localeLanguage', null)

export default function useLocalStorage() {

    return {
        languages,
        localeLanguage,
    }
}
