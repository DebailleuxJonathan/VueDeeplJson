import {createError, defineEventHandler, readBody, sendError} from "h3";
import {chunkArray, processChunks} from "~/server/utils/translate/index";

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

        const words: string[] = []
        const getWordTranslatable = async (json: any, targetLang: string) => {
            for (const prop in json) {
                if (typeof json[prop] === "object" && !Array.isArray(json[prop])) {
                    await getWordTranslatable(json[prop], targetLang);
                } else if (Array.isArray(json[prop])) {
                    for (const element of json[prop]) {
                        if (typeof element === 'string') {
                            words.push(element)
                        } else if (typeof element === 'object') {
                            await getWordTranslatable(element, targetLang);
                        }
                    }
                } else if (typeof json[prop] === 'string') {
                    words.push(json[prop])
                }
            }
        }

        await getWordTranslatable(body.text, body.targetLang)

        const chunkedWords: Array<string[]> = chunkArray(words, 75);

        return await processChunks(chunkedWords, body);
    }
})
