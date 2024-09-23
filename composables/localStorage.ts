import {RemovableRef, useStorage} from "@vueuse/core";
import type {Languages} from "~/types/lang.js";

const languages: RemovableRef<Languages[]> = useStorage('languages', [])
const localeLanguage: RemovableRef<Languages[]> = useStorage('localeLanguage', null)

export default function useLocalStorage() {

    return {
        languages,
        localeLanguage
    }
}
