import {createError, defineEventHandler, readBody, sendError} from "h3";

interface translatedText {
    translations: getTranslatedText[]
}

interface getTranslatedText {
    detected_source_language: string
    text: string
}

const translations: getTranslatedText[] = []

export default defineEventHandler(async (e) => {
    const method = e.node.req.method

    if (method === "GET") {
        // console.log(translations)
        return translations
    }

    if (method === "POST") {
        const body = await readBody(e)

        if (!body.text) {
            const todoNotFoundError = createError({
                statusCode: 404,
                statusMessage: "No item provided",
                data: {}
            })

            sendError(e, todoNotFoundError)
        }

        const cool: translatedText = await $fetch('https://api-free.deepl.com/v2/translate', {
            method: "post", params: {
                auth_key: process.env.DEEPL_AUTH_KEY,
                text: body.text,
                source_lang: body.sourceLang,
                target_lang: body.targetLang
            }
        })

        translations.push(cool.translations[0])

        return cool.translations[0]
    }
})
