export default defineNuxtConfig({
    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/color-mode',
        '@nuxt/test-utils/module',
        '@nuxt/ui',
        '@nuxtjs/supabase'
    ],
    supabase: {
        redirect: false
    },
    colorMode: {
        classSuffix: '',
    },
    css: ['~/assets/css/main.css'],
    i18n: {
        vueI18n: './i18n.config.ts'
    },
})
