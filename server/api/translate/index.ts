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

        const chunkArray = (array: any, size: number) => {
            const chunkedArr = [];
            for (let i = 0; i < array.length; i += size) {
                chunkedArr.push(array.slice(i, i + size));
            }
            return chunkedArr;
        };

        const chunkedWords = chunkArray(words, 75);


        const translateWords = async (wordChunk: string) => {
            const translatedTexts = await $fetch('https://api-free.deepl.com/v2/translate', {
                method: "post",
                params: {
                    auth_key: process.env.DEEPL_AUTH_KEY,
                    text: wordChunk,
                    source_lang: body.sourceLang,
                    target_lang: body.targetLang
                }
            });
            return translatedTexts.translations.map(translatedText => translatedText.text);
        };

        const replaceJSONValues = (json: any, splitTranslatedText: string[]) => {
            let index = 0;
            const translate = (obj: any) => {
                for (const prop in obj) {
                    if (typeof obj[prop] === "object" && !Array.isArray(obj[prop])) {
                        translate(obj[prop]);
                    } else if (Array.isArray(obj[prop])) {
                        for (let i = 0; i < obj[prop].length; i++) {
                            if (typeof obj[prop][i] === 'object') {
                                translate(obj[prop][i]);
                            } else {
                                obj[prop][i] = splitTranslatedText[index];
                                index++;
                            }
                        }
                    } else if (typeof obj[prop] === "string") {
                        obj[prop] = splitTranslatedText[index];
                        index++;
                    }
                }
            };
            translate(json);
            return json;
        };

        const processChunks = async () => {
            let allTranslatedText: string[] = [];
            for (const chunk of chunkedWords) {
                const translatedChunk = await translateWords(chunk);
                allTranslatedText = allTranslatedText.concat(translatedChunk);
            }
            return replaceJSONValues(body.text, allTranslatedText);
        };

        return await processChunks();
    }
})
