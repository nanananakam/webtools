<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-spacer></v-spacer>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-spacer></v-spacer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; 2022-{{ new Date().getFullYear() }} <a href="https://github.com/nanananakam/webtools">nanananakam</a></span>
      <span class="ml-5"><a href="/about/">プライバシーポリシー・免責事項</a></span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import {mdiClockOutline, mdiMapMarker, mdiInformation, mdiCounter, mdiArrowCollapseVertical, mdiFileArrowLeftRightOutline} from "@mdi/js";

export default Vue.extend({
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: mdiClockOutline,
          title: 'UnixTime便利ツール',
          to: '/unixtime/',
        },
        {
          icon: mdiMapMarker,
          title: 'IP情報確認ツール',
          to: '/whois/'
        },
        {
          icon: mdiCounter,
          title: '文字数カウントツール',
          to: '/length/'
        },
        {
          icon: mdiArrowCollapseVertical,
          title: "文字列ハッシュ化ツール",
          to: '/hash/'
        },
        {
          icon: mdiFileArrowLeftRightOutline,
          title: "Base64ツール",
          to: '/base64/'
        },
        {
          icon: mdiInformation,
          title: "このサイトについて",
          to: '/about/'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  beforeMount() {
    // Cloudflare PagesがDomain-level redirectsに対応していないので仕方なくjs redirectを行う
    // https://developers.cloudflare.com/pages/platform/redirects/
    const origin = window.location.origin
    if (
      origin.indexOf("www.nanananakam.com")==-1
      &&
      origin.indexOf("pages.dev")==-1
      &&
      origin.indexOf("localhost")==-1
    ){
      window.location.href = "https://www.nanananakam.com"+window.location.pathname
    }
  },
  computed: {
    title(): string {
      if ( this.$route.fullPath.startsWith('/unixtime')){
        return "UnixTime便利ツール"
      }
      if ( this.$route.fullPath.startsWith('/whois')){
        return "IP情報確認ツール"
      }
      if ( this.$route.fullPath.startsWith('/length')){
        return "文字数カウントツール"
      }
      if ( this.$route.fullPath.startsWith('/hash')){
        return "文字列ハッシュ化ツール"
      }
      if ( this.$route.fullPath.startsWith('/base64')){
        return "Base64エンコード・デコードツール"
      }
      if ( this.$route.fullPath.startsWith('/about')){
        return "このサイトについて"
      }
      return "nanananakam tools"
    }
  }
})
</script>
