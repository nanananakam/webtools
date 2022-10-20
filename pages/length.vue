<template>
  <div>
      <h1>文字数カウントツール</h1>
      <div>フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。</div>
      <br>
      <v-textarea solo v-model="inputString"></v-textarea>
      <v-btn v-on:click="clearString">クリア</v-btn>
      <br>
      <v-data-table :headers="commonDataTableHeaders" :items="resultDataTableItems" hide-default-footer></v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {DataTableHeader} from "vuetify";

interface commonDataTableItem {
  key: string,
  value: string,
}

interface PageData {
  inputString: string,
  commonDataTableHeaders: DataTableHeader[],
  textEncoder: TextEncoder | null,
  segmenter: Intl.Segmenter | null
}

export default Vue.extend({
  name: "length",
  head: {
    title:"文字数カウントツール",
    meta: [
      { name: 'description', content: 'フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。' },
      { property: 'og:site_name', content: 'nanananakam-webtools' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: '文字数カウントツール' },
      { property: 'og:description', content: 'フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。' },
      { property: 'og:url', content: 'https://www.nanananakam.com/length/' },
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      { name: 'twitter:card', content: 'summary' },
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data(): PageData{
    let textEncoder = null
    if ("TextEncoder" in global){
      textEncoder = new TextEncoder()
    }
    let segmenter = null
    if ("Segmenter" in Intl) {
      segmenter = new Intl.Segmenter("ja", {granularity: "grapheme"});
    }
    return {
      textEncoder: textEncoder,
      segmenter: segmenter,
      inputString:"例えば👨‍👩‍👧‍👦のような絵文字が含まれたり、https://www.nanananakam.com/length/などURLが含まれる場合でもそれぞれの数え方で正しく数えることができます。",
      commonDataTableHeaders:[
        {
          text:"カウント方法",
          sortable:false,
          value:"key"
        },
        {
          text:"文字数",
          sortable:false,
          value:"value"
        }
      ]
    }
  },
  computed: {
    jsLength(): number {
      return this.inputString.length
    },
    codePointsNum(): number {
      return [...this.inputString].length
    },
    graphemeNum(): number | string {
      if (this.segmenter != null){
        return [...this.segmenter.segment(this.inputString)].length
      } else {
        return "このブラウザではIntl.Segmenterがサポートされていません。Google Chrome最新版をご利用ください。"
      }
    },
    utf8ByteNum(): number | string {
      if (this.textEncoder != null) {
        return this.textEncoder.encode(this.inputString).byteLength
      } else {
        return "このブラウザではTextEncoderがサポートされていません。Google Chrome最新版をご利用ください。"
      }
    },
    twitterNumString(): string {
      if (this.segmenter == null) {
        return "このブラウザではIntl.Segmenterがサポートされていません。Google Chrome最新版をご利用ください。"
      }
      if (this.textEncoder == null) {
        return "このブラウザではTextEncoderがサポートされていません。Google Chrome最新版をご利用ください。"
      }
        const urlRegex = /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
        const urlReplacedInputValue = this.inputString.replace(urlRegex, "12345678901234567890123") //URLは半角23文字相当となる
        const twitterNum = [...this.segmenter.segment(urlReplacedInputValue)]
          .map(s => {
            if (this.textEncoder!.encode(s.segment).byteLength == 1) {
              return 0.5 as number;
            } else {
              return 1 as number;
            }
          })
          .reduce((a, b) => {
            return a + b;
          },0)
        return twitterNum.toString() + "/140"
    },
    resultDataTableItems(): commonDataTableItem[]{
      return [
        {
          key: "UTF-8ユニット数(=Byte数)",
          value: this.utf8ByteNum.toString()
        },
        {
          key: "UTF-16ユニット数(javascriptのlength)",
          value: this.jsLength.toString()
        },
        {
          key: "Unicodeコードポイント数",
          value: this.codePointsNum.toString()
        },
        {
          key: "書記素数",
          value: this.graphemeNum.toString()
        },
        {
          key: "twitter文字数(URL対応)",
          value: this.twitterNumString
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
