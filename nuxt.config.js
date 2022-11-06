import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - nanananakam-webtools',
    title: 'nanananakam-webtools',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    //link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-gtag',
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/recaptcha',
    '@nuxtjs/google-adsense',
    '@nuxtjs/sitemap',
    'vue-social-sharing/nuxt'
  ],

  'google-adsense': {
    id: 'ca-pub-8612254432102560',
    pageLevelAds: true,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
    },
    defaultAssets: {
      icons: "mdiSvg",
      font: false,
    }
  },

  "google-fonts": {
    families: {
      Roboto: true
    },
    download: true,
    inject: true
  },

  "google-gtag": {
    id: "G-BKHJMCZ8H1",
    debug: true
  },

  recaptcha: {
    siteKey: "6LcJfH8iAAAAADjaTzuK39IJAJ4OS-5bbIwzHUeT",
    version: 2,
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://www.nanananakam.com',
    filter ({ routes }) {
      return routes.map(route => {
        route.url = `${route.url}/`
        return route
      })
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
