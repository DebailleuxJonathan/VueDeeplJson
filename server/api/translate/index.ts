import {createError, defineEventHandler, readBody, sendError} from "h3";

interface translatedText {
    translations: getTranslatedText[]
}

interface getTranslatedText {
    detected_source_language: string
    text: string
}

export default defineEventHandler(async (e) => {
    const method = e.node.req.method

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

        const formatBody = body.text.join('; ').toString()

        const translatedText: translatedText = await $fetch('https://api-free.deepl.com/v2/translate', {
            method: "post", params: {
                auth_key: process.env.DEEPL_AUTH_KEY,
                text: formatBody,
                source_lang: body.sourceLang,
                target_lang: body.targetLang
            }
        })

        return translatedText.translations[0]
    }
})
