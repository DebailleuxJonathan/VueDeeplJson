import {RemovableRef, useStorage} from "@vueuse/core";
import Languages from "~/types/lang";

const languages: RemovableRef<Languages[]> = useStorage('languages', [])

export default function useLocalStorage() {

    return {
        languages
    }
}
