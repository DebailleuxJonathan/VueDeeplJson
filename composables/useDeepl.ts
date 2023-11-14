import {aw} from "~/.output/public/_nuxt/entry.39823149";

const useDeepl = () => {
    const showUsage = ref()
    const addTranslate: any = async (text: any, sourceLang: string, targetLang: string) => {
        try {
            await fetchUsageDeepl()
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

    const fetchUsageDeepl: any = async () => {
        try {
            showUsage.value = await $fetch('/api/usage', {
                method: "get"
            })
            console.log(showUsage.value)
        } catch (e) {
            console.log(e)
        }
    }

    return {
        addTranslate,
        fetchUsageDeepl,
        showUsage
    }
}

export default useDeepl
