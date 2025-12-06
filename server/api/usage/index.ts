import {defineEventHandler} from "h3";

export default defineEventHandler(async (e) => {
    const method = e.node.req.method

    if(method === 'GET') {
        const usage: any = await $fetch(`${process.env.DEEPL_URL}/usage`, {
            method: "get", params: {
                auth_key: process.env.DEEPL_AUTH_KEY
            }
        })

        return usage
    }
})
