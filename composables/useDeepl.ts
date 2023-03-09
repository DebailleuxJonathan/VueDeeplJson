import {ref} from 'vue'

const useDeepl = () => {
    const { data: languages }: any = useAsyncData('languages', () => {
        return $fetch("/api/languages")
    })
    const addTranslate = async (text: string, sourceLang: string, targetLang: string) => {
        try {
            return await $fetch('/api/translate', {
                method: "post", body: {
                    text: text,
                    sourceLang: sourceLang,
                    targetLang: targetLang
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    return {
        languages,
        addTranslate,
    }
}

export default useDeepl
