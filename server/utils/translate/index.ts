interface TranslatedText {
    translations: GetTranslatedText[]
}

interface GetTranslatedText {
    detected_source_language: string
    text: string
}

export const generateRandomKey = () => {
    return 'K_ey_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
};

export const chunkArray = (array: string[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

export const translateWords = async (wordChunk: string, body: { sourceLang: string, targetLang: string }) => {
    const translatedTexts: TranslatedText = await $fetch('https://api.deepl.com/v2/translate', {
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

export const replaceStringsInJsonWithTranslations = (jsonObjectToTranslate: any, translatedStrings: string[]) => {
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

export const sortBracketValue = async (text: string, body: any) => {
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

        let tempTranslatedTexts = await translateWords(tempText, body)

        let translatedTexts: string[] = []
        tempTranslatedTexts.forEach((translatedText: string, index: number) => {
            console.log(translatedText)
            let tempArray: string[] = []
            Object.keys(placeholders).forEach(key => {
                return tempArray.push(translatedText.replace(key, placeholders[key]))
            });
            console.log(tempArray)
            translatedTexts.push(tempArray[index])
        })
        return translatedTexts

    } else {
        return await translateWords(text, body)
    }
}

export const processChunks = async (chunkedWords: string[][], body: any) => {
    let allTranslatedText: string[] = [];
    for (const chunks of chunkedWords) {
        for (const chunk of chunks) {
            const translatedChunk = await sortBracketValue(chunk, body)
            allTranslatedText = allTranslatedText.concat(translatedChunk);
        }
    }
    return replaceStringsInJsonWithTranslations(body.text, allTranslatedText);
};
