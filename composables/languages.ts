import {useLocalStorage} from '@vueuse/core'
import useDeepl from "./useDeepl";
import Languages from "~/types/lang";

const useLanguages = () => {

    const localStorage: any = useLocalStorage('languages', [])

    const {fetchLanguages} = useDeepl()

    const test = async () => {
        if (Object.keys(localStorage.value).length === 0) {
            const res: any = await fetchLanguages()
            localStorage.value = res
        }
    }

    test()

    const getLang = (lang: string) => {
        if (localStorage.value.length > 0) {
            return localStorage.value.find((key: Languages) => key.language === lang)
        }
    }


    return {
        localStorage,
        getLang
    }
}

export default useLanguages
