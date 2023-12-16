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

    const generateRandomKey = () => {
        return 'Key_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
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

        const chunkedWords: Array<string[]> = chunkArray(words, 75);

        const translateWords = async (wordChunk: string) => {
            const translatedTexts: translatedText = await $fetch('https://api.deepl.com/v2/translate', {
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

        const sortBracketValue = async (text: string) => {
            const regex = /\{.*?\}/g;
            let matches = text.match(regex);

            if (matches) {
                let tempText = text;
                const placeholders: any = {};
                matches.forEach(match => {
                    const randomKey = generateRandomKey();
                    placeholders[randomKey] = match;
                    tempText = tempText.replace(match, randomKey);
                });

                let tempTranslatedTexts = await translateWords(tempText)

                let translatedTexts: string[] = []
                tempTranslatedTexts.forEach((translatedText, index) => {
                    let tempArray: string[] = []
                    Object.keys(placeholders).forEach(key => {
                        return tempArray.push(translatedText.replace(key, placeholders[key]))
                    });
                    translatedTexts.push(tempArray[index])
                })
                return translatedTexts

            } else {
                return await translateWords(text)
            }
        }

        const replaceStringsInJsonWithTranslations = (jsonObjectToTranslate: any, translatedStrings: string[]) => {
            let translationIndex = 0;
            const recursiveReplace = (currentObject: any) => {
                for (const property in currentObject) {
                    if (typeof currentObject[property] === "object" && !Array.isArray(currentObject[property])) {
                        recursiveReplace(currentObject[property]);
                    } else if (Array.isArray(currentObject[property])) {
                        for (let i = 0; i < currentObject[property].length; i++) {
                            if (typeof currentObject[property][i] === 'object') {
                                recursiveReplace(currentObject[property][i]);
                            } else {
                                currentObject[property][i] = translatedStrings[translationIndex];
                                translationIndex++;
                            }
                        }
                    } else if (typeof currentObject[property] === "string") {
                        currentObject[property] = translatedStrings[translationIndex];
                        translationIndex++;
                    }
                }
            };
            recursiveReplace(jsonObjectToTranslate);
            return jsonObjectToTranslate;
        };

        const processChunks = async () => {
            let allTranslatedText: string[] = [];
            for (const chunks of chunkedWords) {
                for (const chunk of chunks) {
                    const translatedChunk = await sortBracketValue(chunk)
                    allTranslatedText = allTranslatedText.concat(translatedChunk);
                }
            }
            return replaceStringsInJsonWithTranslations(body.text, allTranslatedText);
        };

        return await processChunks();
    }
})
