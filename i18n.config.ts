import useLocalStorage from "~/composables/localStorage";

export default defineI18nConfig(async () => {
        const {localeLanguage} = useLocalStorage()
        const modules = import.meta.glob('./locales/*.json')

        const messages: Record<string, any> = {}

        for (const path in modules) {
            const locale = path.match(/\.\/locales\/(.*)\.json$/)?.[1]
            if (locale) {
                messages[locale] = await modules[path]()
            }
        }

        return {
            legacy: false,
            locale: localeLanguage.value || 'en-gb',
            messages,
            detectBrowserLanguage: {
                useCookie: true,
                cookieKey: 'i18n_redirected',
                alwaysRedirect: true,
            },
            strategy: 'prefix_and_default',
        }
    }
)
