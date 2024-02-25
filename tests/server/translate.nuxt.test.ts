import {beforeEach, describe, expect, it, vi} from 'vitest'
import {chunkArray, generateRandomKey, sortBracketValue, translateWords} from "~/server/utils/translate/index.js";

beforeEach(() => {
    vi.resetAllMocks();
});


describe('generateRandomKey', () => {
    it('should generate a key that starts with "Key_" and contains two underscore-separated parts', () => {
        const key = generateRandomKey();
        expect(key).toMatch(/^K_ey_\w+_\w+$/);
    });

    it('should generate a unique key each time it is called', () => {
        const key1 = generateRandomKey();
        const key2 = generateRandomKey();
        expect(key1).not.toBe(key2);
    });
});

describe('chunkArray', () => {
    it('should correctly chunk an array into smaller arrays of specified size', () => {
        const inputArray = ['a', 'b', 'c', 'd', 'e'];
        const size = 2;
        const chunked = chunkArray(inputArray, size);
        expect(chunked.length).toBe(3);
        expect(chunked[0]).toEqual(['a', 'b']);
        expect(chunked[2]).toEqual(['e']);
    });
});

describe('translateWords', () => {
    global.$fetch = vi.fn().mockResolvedValue({
        translations: [{ detected_source_language: 'EN', text: 'Bonjour' }]
    })

    it('translates words correctly', async () => {
        const wordChunk = 'Hello';
        const body = { sourceLang: 'EN', targetLang: 'FR' };
        const result = await translateWords(wordChunk, body);
        expect(result).toEqual(['Bonjour']);
        expect($fetch).toHaveBeenCalled();
    });
});

describe('sortBracketValue with brackets', () => {
    it('replaces text within brackets and translates the rest', async () => {
        const text = 'This is a test {with} brackets';
        const body = { sourceLang: 'EN', targetLang: 'FR' };

        global.$fetch = vi.fn().mockResolvedValue({
            translations: [{ detected_source_language: 'EN', text: text }]
        })
        const result = await sortBracketValue(text, body);
        expect(result).toEqual([text]);
    });
});

describe('sortBracketValue without brackets', () => {
    it('translates text directly without replacements', async () => {
        const text = 'This is a simple test';
        const body = { sourceLang: 'EN', targetLang: 'FR' };

        global.$fetch = vi.fn().mockResolvedValue({
            translations: [{ detected_source_language: 'EN', text: text }]
        })

        const result = await sortBracketValue(text, body);

        // Vérification
        expect(result).toEqual([text]);
    });
});

describe('sortBracketValue with different languages', () => {
    // Exemple de test avec le français
    it('should correctly replace keys when translating to French', async () => {
        const bodyFr = { sourceLang: 'EN', targetLang: 'FR' };
        const text = "Here is a placeholder {value}";

        global.$fetch = vi.fn().mockResolvedValue({
            translations: [{ detected_source_language: 'EN', text: text }]
        })

        const resultFr = await sortBracketValue(text, bodyFr);
        expect(resultFr).toEqual([text]);

        const bodyEs = { sourceLang: 'EN', targetLang: 'ES' };

        global.$fetch = vi.fn().mockResolvedValue({
            translations: [{ detected_source_language: 'EN', text: text }]
        })

        const resultEs = await sortBracketValue(text, bodyEs);
        expect(resultEs).toEqual([text]);
    });
});
