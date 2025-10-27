export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],
  fonts: {
    google: {
      families: {
        Inter: true,
      }
    }
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/'],
    }
  },
  // Remove the vite config entirely or use this:
  vite: {
    optimizeDeps: {
      exclude: ['@supabase/supabase-js']
    }
  }
})