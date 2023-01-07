<template>
  <div>
    <h1>ファイルBase64エンコードツール</h1>
    <div>入力されたファイルをBase64に変換します。</div>
    <br>
    <v-file-input v-model="inputFile" label="ファイルを選択してください" show-size></v-file-input>
    <v-btn v-on:click="exec">Base64変換</v-btn>
    <v-btn v-if="inputFile != null" v-on:click="clear">クリア</v-btn>
    <v-textarea disabled v-model="result" :loading="loading"></v-textarea>
    <div v-if="result">
      クリップボードへコピーはこちら→<value-to-clipboard :text="result" :show-text="1 === 0" style="display: inline"></value-to-clipboard>
    </div>
    <h2>解説</h2>
    <div>Base64エンコードは、データを印字可能な64種類の英数字記号を用いて表現する形式で、BASIC認証や電子メールなど、ASCII外の文字やバイナリデータを扱うことに制約がある場面でそれらのデータを扱うために利用されます。</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import CryptoJS from "crypto-js"
import ValueToClipboard from "../components/valueToClipboard.vue";

interface PageData {
  inputFile: File | null
  result: string
  loading: boolean
}

export default Vue.extend({
  name: "base64",
  head: {
    title: "ファイルBase64エンコードツール",
    meta: [
      {name: 'description', content: '入力されたファイルをBase64に変換します。'},
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: 'Base64エンコード・デコードツール'},
      {property: 'og:description', content: '入力されたファイルをBase64に変換します。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/fileBase64/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.nanananakam.com/fileBase64/'
      }
    ]
  },
  components: {
    ValueToClipboard
  },
  data(): PageData {
    return {
      inputFile: null,
      result:  "",
      loading: false
    }
  },
  methods: {
    clear: function() {
      this.inputFile = null
      this.result = ""
      this.loading = false
    },
    exec: function(){
      if (this.inputFile == null) {
        this.clear()
      } else {
        this.loading = true
        const reader = new FileReader()
        const t = this
        reader.onloadend = function (event) {
          if (event.target == null) {
            t.clear()
          } else {
            const arrayBuffer = event.target.result
            if (typeof reader.result == "string") {
              console.error("unexpected error")
              t.clear()
            } else {
              // TODO: out of memoryの時にエラー表示できるようにする
              // @ts-ignore
              const inputWordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
              t.result = CryptoJS.enc.Base64.stringify(inputWordArray)
              t.loading = false
            }
          }
        }
        reader.readAsArrayBuffer(this.inputFile)
      }
    }
  }
})
</script>

<style scoped>

</style>
