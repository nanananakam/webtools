<template>
  <div>
    <h1>送信ヘッダー確認ツール</h1>
    <div>お使いのブラウザから送信されたリクエストをサーバーで受信した際のヘッダー情報を表示します。</div>
    <v-data-table :headers="commonDataTableHeaders" :items="result" :loading="loading" :items-per-page="minusOne" hide-default-footer></v-data-table>
    <div>※Cloudflare CDN、Oracle Cloudロードバランサーで付加・変更された情報を含みます。</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import {DataTableHeader} from "vuetify";

interface commonDataTableItem {
  key: string,
  value: string,
}

interface PageData {
  minusOne: -1,
  commonDataTableHeaders: DataTableHeader[],
  result: commonDataTableItem[],
  loading: boolean,
}

export default Vue.extend({
  name: "echoHeader",
  head: {
    title: "送信ヘッダー確認ツール",
    meta: [
      { name: 'description', content: 'お使いのブラウザから送信されたリクエストをサーバーで受信した際のヘッダー情報を表示します。' },
      { property: 'og:site_name', content: 'nanananakam-webtools' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: '送信ヘッダー確認ツール' },
      { property: 'og:description', content: 'お使いのブラウザから送信されたリクエストをサーバーで受信した際のヘッダー情報を表示します。' },
      { property: 'og:url', content: 'https://www.nanananakam.com/echoHeader/' },
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      { name: 'twitter:card', content: 'summary' },
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data():PageData {
    return {
      minusOne: -1,
      result: [],
      loading: true,
      commonDataTableHeaders: [
        {
          text: "Header",
          sortable: false,
          value: "key"
        },
        {
          text: "値",
          sortable: false,
          value: "value"
        }
      ],
    }
  },
  beforeMount() {
    this.$axios.post("https://www.nanananakam.com/api/echoHeader",{})
      .then(res => {
        for (let key in res.data) {
          this.result.push({
            key: key,
            value: res.data[key]
          })
        }
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      })
  }
})
</script>

<style scoped>

</style>
