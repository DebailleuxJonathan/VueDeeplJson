
const useDeepl = () => {
    const addTranslate: any = async (text: any, sourceLang: string, targetLang: string) => {
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

    const fetchLanguages = async <T>(): Promise<T> => {
        try {
            return await $fetch('/api/languages', {
                method: "get"
            })
        } catch (e: any) {
            return e.message
        }
    }

    return {
        addTranslate,
        fetchLanguages
    }
}

export default useDeepl
