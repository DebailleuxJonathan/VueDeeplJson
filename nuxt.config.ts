export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils/module',
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],

  supabase: {
      redirect: false
  },

  colorMode: {
      classSuffix: '',
  },

  i18n: {
      vueI18n: './i18n.config.ts'
  },

  tailwindcss: {
      cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
      configPath: 'tailwind.config',
      exposeConfig: {
          level: 2
      },
      config: {},
      viewer: true,
  },

  shadcn: {
      prefix: '',
      componentDir: './components/ui'
  },

  compatibilityDate: '2024-09-24'
})