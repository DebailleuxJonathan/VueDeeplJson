import {describe, it, expect, vi} from 'vitest';
import myEventHandler from '~/server/api/translate/index.js';
import {H3Event} from "h3";

vi.mock('h3', () => ({
    ...vi.importActual('h3'),
    defineEventHandler: vi.fn((handler) => handler),
    createError: vi.fn(),
    sendError: vi.fn(),
    readBody: vi.fn(() => {
        return {
            text: {
                couleurs: ["Rouge {rouge}", "Bleu {bleu}"]
            },
            targetLang: 'EN'
        }
    }),
}));
describe('Test my translation handler', () => {
    it('should translate JSON correctly', async () => {
        const fakeEvent: H3Event = {
            node: {
                req: {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                }
            },
        } as unknown as H3Event;

        global.$fetch = vi.fn()
            .mockResolvedValueOnce({
                translations: [{
                    detected_source_language: 'EN', text: "Red {rouge}",
                    targetLang: 'EN'
                }]
            })
            .mockResolvedValueOnce({
                translations: [{
                    detected_source_language: 'EN', text: "Blue {bleu}",
                    targetLang: 'EN'
                }]
            })

        const result = await myEventHandler(fakeEvent);

        expect(result).toEqual({
            couleurs: ["Red {rouge}", "Blue {bleu}"]
        });
    });
});
