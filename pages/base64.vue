<template>
  <div>
    <h1>Base64エンコード・デコードツール</h1>
    <div>フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。</div>
    <br>
    <v-textarea solo v-model="inputString"></v-textarea>
    <v-btn v-on:click="clearString">クリア</v-btn>
    <v-radio-group v-model="convertType" row>
      <v-radio label="文字列->Base64" value="to_base_64"></v-radio>
      <v-radio label="Base64->文字列" value="from_base_64"></v-radio>
    </v-radio-group>
    <br>
    <v-textarea disabled v-model="result"></v-textarea>
    <br>
    <h2>解説</h2>
    <div>Base64エンコードは、データを印字可能な64種類の英数字記号を用いて表現する形式で、BASIC認証や電子メールなど、ASCII外の文字やバイナリデータを扱うことに制約がある場面でそれらのデータを扱うために利用されます。</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import CryptoJS from "crypto-js"

const CONVERT_TYPE = {
  to_base_64: "to_base_64",
  from_base_64: "from_base_64",
} as const
type CONVERT_TYPE = typeof CONVERT_TYPE[keyof typeof CONVERT_TYPE];

interface PageData {
  inputString: string,
  convertType: CONVERT_TYPE
}

export default Vue.extend({
  name: "base64",
  head: {
    title: "Base64エンコード・デコードツール",
    meta: [
      {name: 'description', content: 'フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。'},
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: 'Base64エンコード・デコードツール'},
      {property: 'og:description', content: 'フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/base64/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data(): PageData {
    return {
      inputString: "",
      convertType: "to_base_64"
    }
  },
  computed: {
    result(): string {
      if (this.convertType == "to_base_64") {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(this.inputString))
      } else {
        try {
          return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(this.inputString))
        } catch (e) {
          console.log(e)
          return "入力がBase64ではありません"
        }
      }
    }
  },
  methods: {
    clearString: function () {
      this.inputString = ""
    }
  }
})
</script>

<style scoped>

</style>
