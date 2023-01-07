<template>
  <div>
    <h1>ファイルハッシュ確認ツール</h1>
    <div>入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。</div>
    <br>
    <v-file-input v-model="inputFile" label="ファイルを選択してください" show-size></v-file-input>
    <v-radio-group v-model="hashAlgo" row>
      <v-radio label="MD5" value="MD5"></v-radio>
      <v-radio label="SHA1" value="SHA1"></v-radio>
      <v-radio label="SHA256" value="SHA256"></v-radio>
      <v-radio label="SHA512" value="SHA512"></v-radio>
    </v-radio-group>
    <v-radio-group v-model="hashFormat" row>
      <v-radio label="HEX形式" value="HEX"></v-radio>
      <v-radio label="Base64形式" value="Base64"></v-radio>
    </v-radio-group>
    <v-btn v-on:click="exec">ハッシュ生成</v-btn>
    <v-btn v-if="inputFile != null" v-on:click="clear">クリア</v-btn>
    <br>
    <v-data-table :headers="commonDataTableHeaders" :items="resultDataTableItems"  :loading="loading" hide-default-footer>
      <template v-slot:item.value="{ item }">
        <value-to-clipboard :text="item.value"></value-to-clipboard>
      </template>
    </v-data-table>
    <br>
    <h2>解説</h2>
    <h3>MD5</h3>
    <div>MD5は、ダイジェスト長が128bitの暗号学的ハッシュ関数のひとつです。歴史的に広く用いられていましたが、現在では強度は十分でないとされています。</div>
    <h3>SHA1</h3>
    <div>
      SHA1は、ダイジェスト長が160bitの暗号学的ハッシュ関数のひとつです。現在ではSHA1についても強度が十分でないとされ、電子証明書においてはSHA256以上の強度が必要とされています。
    </div>
    <h3>SHA256</h3>
    <div>SHA256は、SHA1の後継である暗号学的ハッシュ関数の一つであるSHA2のうち、ダイジェスト長が256bitのものです。</div>
    <h3>SHA512</h3>
    <div>SHA512は、SHA1の後継である暗号学的ハッシュ関数の一つであるSHA2のうち、ダイジェスト長が512bitのものです。</div>
    <h3>HEX形式</h3>
    <div>HEX形式は、バイナリデータを0から9の数字とaからfまでの文字の16種類を用いて16進数で表現する形式です。</div>
    <h3>Base64形式</h3>
    <div>Base64形式は、バイナリデータを印字可能な64種類の英数字記号を用いて表現する形式です。HEX形式よりも短い文字数で表現できます。</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CryptoJS from "crypto-js"
import {DataTableHeader} from "vuetify";
import ValueToClipboard from "../components/valueToClipboard.vue";
import * as constants from "constants";

interface commonDataTableItem {
  key: string,
  value: string,
}

const HASH_ALGO = {
  MD5: "MD5",
  SHA1: "SHA1",
  SHA256: "SHA256",
  SHA512: "SHA512"
} as const
type HASH_ALGO = typeof HASH_ALGO[keyof typeof HASH_ALGO]

const HASH_FORMAT = {
  HEX: "HEX",
  BASE64: "Base64"
} as const
type HASH_FORMAT = typeof HASH_FORMAT[keyof typeof HASH_FORMAT]

interface PageData {
  inputFile: File | null
  hashAlgo: HASH_ALGO,
  hashFormat: HASH_FORMAT,
  commonDataTableHeaders: DataTableHeader[],
  resultDataTableItems: commonDataTableItem[],
  loading: boolean
}

export default Vue.extend({
  name: "hashFile",
  head: {
    title: "ファイルハッシュ確認ツール",
    meta: [
      {name: 'description', content: '入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。'},
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: 'ファイルハッシュ化ツール'},
      {property: 'og:description', content: '入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/hashFile/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.nanananakam.com/hashFile/'
      }
    ]
  },
  components: {
    ValueToClipboard
  },
  data(): PageData {
    return {
      inputFile: null,
      hashAlgo: "MD5",
      hashFormat: "HEX",
      resultDataTableItems: [],
      commonDataTableHeaders: [
        {
          "text": "ハッシュ化方法",
          sortable: false,
          value: "key"
        },
        {
          "text": "結果",
          sortable: false,
          value: "value"
        }
      ],
      loading: false
    }
  },
  methods: {
    clear: function () {
      this.inputFile = null
      this.setNull()
    },
    exec: function () {
      if (this.inputFile == null) {
        this.setNull()
      } else {
        this.resultDataTableItems = []
        this.loading = true
        const reader = new FileReader()
        const t = this
        reader.onloadend = function (event) {
          if (event.target == null) {
            t.setNull()
          } else {
            const arrayBuffer = event.target.result
            if (typeof reader.result == "string") {
              console.error("unexpected error")
              t.setNull()
            } else {
              // @ts-ignore
              const inputWordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
              let hashedWordArray = CryptoJS.lib.WordArray.create()
              switch(t.hashAlgo){
                case "MD5":
                  hashedWordArray = CryptoJS.MD5(inputWordArray)
                  break;
                case "SHA1":
                  hashedWordArray = CryptoJS.SHA1(inputWordArray)
                  break;
                case "SHA256":
                  hashedWordArray = CryptoJS.SHA256(inputWordArray)
                  break;
                case "SHA512":
                  hashedWordArray = CryptoJS.SHA512(inputWordArray)
                  break;
              }
              let hashedString = ""
              switch (t.hashFormat) {
                case "HEX":
                  hashedString = hashedWordArray.toString(CryptoJS.enc.Hex)
                  break;
                case "Base64":
                  hashedString = hashedWordArray.toString(CryptoJS.enc.Base64)
              }
              t.resultDataTableItems = [
                {
                  key: t.hashAlgo+"("+t.hashFormat+"形式)",
                  value: hashedString
                },
              ]
              t.loading = false
            }
          }
        }
        reader.readAsArrayBuffer(this.inputFile)
      }
    },
    setNull: function () {
      this.resultDataTableItems = []
      this.loading = false
    }
  }
})
</script>

<style scoped>

</style>
