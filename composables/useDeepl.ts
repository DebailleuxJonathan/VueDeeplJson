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

    return {
        addTranslate,
    }
}

export default useDeepl
