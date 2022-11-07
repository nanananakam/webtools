<template>
  <div>
    <h1>nanananakam webtools</h1>
    <div>Web開発・運用であるとうれしいちょっとしたツール集です。</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'IndexPage',
  head: {
    title: "top",
    meta: [
      {name: 'description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。'},
      {property: 'og:site_name', content: 'nanananakam webtools'},
      {property: 'og:type', content: 'website'},
      {property: 'og:title', content: 'nanananakam webtools'},
      {property: 'og:description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  }
})
</script>
