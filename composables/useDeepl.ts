const useDeepl = () => {
    const showUsage = ref()
    const addTranslate: any = async (text: any, sourceLang: string, targetLang: string) => {
        console.log(text)
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
