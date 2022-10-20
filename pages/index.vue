<template>
  <div>
    <h1>nanananakam webtools</h1>
    <div>Web開発・運用であるとうれしいちょっとしたツール集です。</div>
    <v-card class="ma-10 px-5 pb-5" v-for="item in items">
      <v-card-title><a :href="item.to"><v-icon>{{item.icon}}</v-icon>{{item.title}}</a></v-card-title>
      <v-card-tetx>{{item.text}}</v-card-tetx>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  mdiArrowCollapseVertical,
  mdiClockOutline,
  mdiCounter,
  mdiFileArrowLeftRightOutline, mdiInformation,
  mdiMapMarker, mdiQrcodeEdit
} from "@mdi/js";
export default Vue.extend({
  name: 'IndexPage',
  head: {
    title: "top",
    meta: [
      { name: 'description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。' },
      { property: 'og:site_name', content: 'nanananakam webtools' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'nanananakam webtools' },
      { property: 'og:description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。' },
      { property: 'og:url', content: 'https://www.nanananakam.com/' },
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      { name: 'twitter:card', content: 'summary' },
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data(){
    return {
      items: [
        {
          icon: mdiClockOutline,
          title: 'UnixTime便利ツール',
          to: '/unixtime/',
          text: "UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。"
        },
        {
          icon: mdiMapMarker,
          title: 'IP情報確認ツール',
          to: '/whois/',
          text: "入力されたIPに関する情報をRDAP(whois)、IP2Location LITE、ipapiから一括取得し表示します。"
        },
        {
          icon: mdiCounter,
          title: '文字数カウントツール',
          to: '/length/',
          text: "フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。"
        },
        {
          icon: mdiArrowCollapseVertical,
          title: "文字列ハッシュ化ツール",
          to: '/hash/',
          text: "入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。"
        },
        {
          icon: mdiFileArrowLeftRightOutline,
          title: "Base64ツール",
          to: '/base64/',
          text: "フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。"
        },
        {
          icon: mdiQrcodeEdit,
          title: "QRコード作成ツール",
          to: "/qrcode/",
          text: "入力された文字列からQRコードを生成します。ダウンロードもできます。"
        },
        {
          icon: mdiInformation,
          title: "このサイトについて",
          to: '/about/',
          text: "このサイトについて・プライバシーポリシー・免責事項"
        },
      ],
    }
  }
})
</script>
