// plugins/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { firebaseConfig } from '../firebase.config.js'

export default defineNuxtPlugin((nuxtApp) => {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    nuxtApp.provide('firebase', { app, auth })
    nuxtApp.vueApp.provide('firebase', { app, auth })
})
