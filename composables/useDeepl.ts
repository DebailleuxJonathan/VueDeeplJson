import {ref} from 'vue'

const useDeepl = () => {
    const translatedDatas = ref()
    const addTranslate = async (text: string, sourceLang: string, targetLang: string) => {
        try {
            const test: any = await $fetch('/api/translate', {
                method: "post", body: {
                    text: text,
                    sourceLang: sourceLang,
                    targetLang: targetLang
                }
            })
            translatedDatas.value = test
            return test
        } catch (e) {
            console.log(e)
        }
    }
    return {
        translatedDatas,
        addTranslate
    }
}

export default useDeepl
