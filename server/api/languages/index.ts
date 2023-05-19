import {createError, defineEventHandler, readBody, sendError} from "h3";

export default defineEventHandler(async (e) => {
    const method = e.node.req.method

    if (method === "GET") {
        const languages: any = await $fetch('https://api-free.deepl.com/v2/languages?type=target', {
            method: "get", params: {
                auth_key: process.env.DEEPL_AUTH_KEY,
            }
        })

        return languages
    }
})
