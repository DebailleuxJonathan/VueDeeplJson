import {RemovableRef, useStorage} from "@vueuse/core";
import type {Languages} from "~/types/lang.js";

const languages: RemovableRef<Languages[]> = useStorage('languages', [])

export default function useLocalStorage() {

    return {
        languages
    }
}
