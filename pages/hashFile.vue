<template>
  <div>
    <h1>ファイルハッシュ確認ツール</h1>
    <div>入力されたファイルのmd5,sha1,sha256,sha512ハッシュをそれぞれHEX形式,Base64形式で出力します。</div>
    <br>
    <v-file-input v-model="inputFile"></v-file-input>
    <v-btn v-on:click="exec">ハッシュ生成</v-btn>
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

interface commonDataTableItem {
  key: string,
  value: string,
}

interface PageData {
  inputFile: File | null
  commonDataTableHeaders: DataTableHeader[],
  resultDataTableItems: commonDataTableItem[],
  loading: boolean
}

export default Vue.extend({
  name: "hashFile",
  head: {
    title: "ファイルハッシュ確認ツール",
    meta: [
      {name: 'description', content: '入力されたファイルのmd5,sha1,sha256,sha512ハッシュをそれぞれHEX形式,Base64形式で出力します。'},
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: 'ファイルハッシュ化ツール'},
      {property: 'og:description', content: '入力されたファイルのmd5,sha1,sha256,sha512ハッシュをそれぞれHEX形式,Base64形式で出力します。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/hash/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.nanananakam.com/hash/'
      }
    ]
  },
  components: {
    ValueToClipboard
  },
  data(): PageData {
    return {
      inputFile: null,
      resultDataTableItems: [
        {
          key: "MD5(HEX形式)",
          value: ""
        },
        {
          key: "MD5(Base64形式)",
          value: ""
        },
        {
          key: "SHA1(HEX形式)",
          value: ""
        },
        {
          key: "SHA1(Base64形式)",
          value: ""
        },
        {
          key: "SHA256(HEX形式)",
          value: ""
        },
        {
          key: "SHA256(Base64形式)",
          value: ""
        },
        {
          key: "SHA512(HEX形式)",
          value: ""
        },
        {
          key: "SHA512(Base64形式)",
          value: ""
        }
      ],
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
              const md5 = CryptoJS.MD5(inputWordArray)
              const md5hex = md5.toString(CryptoJS.enc.Hex)
              const md5base64 = md5.toString(CryptoJS.enc.Base64)
              const sha1 = CryptoJS.SHA1(inputWordArray)
              const sha1hex = sha1.toString(CryptoJS.enc.Hex)
              const sha1base64 = sha1.toString(CryptoJS.enc.Base64)
              const sha256 = CryptoJS.SHA256(inputWordArray)
              const sha256hex = sha256.toString(CryptoJS.enc.Hex)
              const sha256base64 = sha256.toString(CryptoJS.enc.Base64)
              const sha512 = CryptoJS.SHA512(inputWordArray)
              const sha512hex = sha512.toString(CryptoJS.enc.Hex)
              const sha512base64 = sha512.toString(CryptoJS.enc.Base64)
              t.resultDataTableItems = [
                {
                  key: "MD5(HEX形式)",
                  value: md5hex
                },
                {
                  key: "MD5(Base64形式)",
                  value: md5base64
                },
                {
                  key: "SHA1(HEX形式)",
                  value: sha1hex
                },
                {
                  key: "SHA1(Base64形式)",
                  value: sha1base64
                },
                {
                  key: "SHA256(HEX形式)",
                  value: sha256hex
                },
                {
                  key: "SHA256(Base64形式)",
                  value: sha256base64
                },
                {
                  key: "SHA512(HEX形式)",
                  value: sha512hex
                },
                {
                  key: "SHA512(Base64形式)",
                  value: sha512base64
                }
              ]
              t.loading = false
            }
          }
        }
        reader.readAsArrayBuffer(this.inputFile)
      }
    },
    setNull: function () {
      this.resultDataTableItems = [
        {
          key: "MD5(HEX形式)",
          value: ""
        },
        {
          key: "MD5(Base64形式)",
          value: ""
        },
        {
          key: "SHA1(HEX形式)",
          value: ""
        },
        {
          key: "SHA1(Base64形式)",
          value: ""
        },
        {
          key: "SHA256(HEX形式)",
          value: ""
        },
        {
          key: "SHA256(Base64形式)",
          value: ""
        },
        {
          key: "SHA512(HEX形式)",
          value: ""
        },
        {
          key: "SHA512(Base64形式)",
          value: ""
        }
      ]
      this.loading = false
    }
  }
})
</script>

<style scoped>

</style>
