<template>
  <div>
    <h1>文字列ハッシュ化ツール</h1>
    <div>入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。</div>
    <br>
    <v-text-field v-model="inputString"></v-text-field>
    <v-btn v-on:click="clearString">クリア</v-btn>
    <br>
    <v-data-table :headers="commonDataTableHeaders" :items="resultDataTableItems" hide-default-footer>
      <template v-slot:item.value="{ item }">
        <value-to-clipboard :text="item.value"></value-to-clipboard>
      </template>
    </v-data-table>
    <br>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CryptoJS from "crypto-js"
import {DataTableHeader} from "vuetify";
import ValueToClipboard from "~/components/valueToClipboard.vue";

interface commonDataTableItem {
  key: string,
  value: string,
}

interface PageData {
  inputString: string
  commonDataTableHeaders: DataTableHeader[]
}

export default Vue.extend({
  name: "hash",
  head: {
    title: "文字列ハッシュ化ツール",
    meta: [
      { name: 'description', content: '入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。' },
      { property: 'og:site_name', content: 'nanananakam-webtools' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: '文字列ハッシュ化ツール' },
      { property: 'og:description', content: '入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。' },
      { property: 'og:url', content: 'https://www.nanananakam.com/hash/' },
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      { name: 'twitter:card', content: 'summary' },
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  components:{
    ValueToClipboard
  },
  data():PageData {
    return {
      inputString:"",
      commonDataTableHeaders: [
        {
          "text":"ハッシュ化方法",
          sortable: false,
          value:"key"
        },
        {
          "text":"結果",
          sortable: false,
          value: "value"
        }
      ]
    }
  },
  computed: {
    md5Hex(): string {
      return CryptoJS.MD5(this.inputString).toString(CryptoJS.enc.Hex)
    },
    md5Base64(): string {
      return CryptoJS.MD5(this.inputString).toString(CryptoJS.enc.Base64)
    },
    sha1Hex(): string {
      return CryptoJS.SHA1(this.inputString).toString(CryptoJS.enc.Hex)
    },
    sha1Base64(): string {
      return CryptoJS.SHA1(this.inputString).toString(CryptoJS.enc.Base64)
    },
    sha256Hex(): string {
      return CryptoJS.SHA256(this.inputString).toString(CryptoJS.enc.Hex)
    },
    sha256Base64(): string {
      return CryptoJS.SHA256(this.inputString).toString(CryptoJS.enc.Base64)
    },
    sha512Hex(): string {
      return CryptoJS.SHA512(this.inputString).toString(CryptoJS.enc.Hex)
    },
    sha512Base64(): string {
      return CryptoJS.SHA512(this.inputString).toString(CryptoJS.enc.Base64)
    },
    resultDataTableItems(): commonDataTableItem[] {
      return [
        {
          key: "MD5(HEX形式)",
          value: this.md5Hex
        },
        {
          key: "MD5(Base64形式)",
          value: this.md5Base64
        },
        {
          key: "SHA1(HEX形式)",
          value: this.sha1Hex
        },
        {
          key: "SHA1(Base64形式)",
          value: this.sha1Base64
        },
        {
          key: "SHA256(HEX形式)",
          value: this.sha256Hex
        },
        {
          key: "SHA256(Base64形式)",
          value: this.sha256Base64
        },
        {
          key: "SHA512(HEX形式)",
          value: this.sha512Hex
        },
        {
          key: "SHA512(Base64形式)",
          value: this.sha512Base64
        }
      ]
    }
  },
  methods: {
    clearString: function(){
      this.inputString = ""
    }
  }
})
</script>

<style scoped>

</style>
