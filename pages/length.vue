<template>
  <div>
    <h1>文字数カウントツール</h1>
    <div>フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。</div>
    <br>
    <v-textarea solo v-model="inputString"></v-textarea>
    <v-btn v-on:click="clearString">クリア</v-btn>
    <br>
    <v-data-table :headers="commonDataTableHeaders" :items="resultDataTableItems" hide-default-footer></v-data-table>
    <br>
    <h2>解説</h2>
    <h3>UTF-8ユニット数</h3>
    <div>UTF-8ユニット数は現在最も標準的に使われる文字コードであるUTF-8で表現した際のユニット数です。UTF-8の1ユニットは1バイトなのでバイト数と同一です。ASCII文字が1、多くの日本語文字が3になりますが、絵文字などは4以上になるものもあります。</div>
    <h3>UTF-16ユニット数</h3>
    <div>UTF-16ユニット数はJavascriptやJavaの内部表現などに用いられる文字コードであるUTF-16で表現した際のユニット数です。半角文字・全角文字ともに1と数えられるものが多いですが、絵文字などは2以上に数えられるものがあります。</div>
    <h3>Unicodeコードポイント数</h3>
    <div>Unicodeコードポイント数は、Unicodeで定められたまとまりの単位の数を表します。多くの文字が1と数えられますが、前後のUnicodeコードポイントと合わせて1文字を表す場合もあります。</div>
    <h3>書記素数</h3>
    <div>複数の絵文字を結合した結合絵文字などを含めて、「書記言語において意味上の区別を可能にする最小の図形単位をいう」(<a href="https://ja.wikipedia.org/wiki/%E6%9B%B8%E8%A8%98%E7%B4%A0">wikipedia:書記素</a>)とされます。非エンジニアの方の感覚でいう「文字数」に最も近いものになります。</div>
    <h3>twitter文字数</h3>
    <div>twitterの140文字制限では、ASCII文字は0.5文字、それ以外の文字は1文字と数えられますが、URLは13.5文字と数えられます。</div>
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
    title: "文字数カウントツール",
    meta: [
      {
        name: 'description',
        content: 'フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。'
      },
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: '文字数カウントツール'},
      {
        property: 'og:description',
        content: 'フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。'
      },
      {property: 'og:url', content: 'https://www.nanananakam.com/length/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data(): PageData {
    let textEncoder = null
    if ("TextEncoder" in global) {
      textEncoder = new TextEncoder()
    }
    let segmenter = null
    if ("Segmenter" in Intl) {
      segmenter = new Intl.Segmenter("ja", {granularity: "grapheme"});
    }
    return {
      textEncoder: textEncoder,
      segmenter: segmenter,
      inputString: "例えば👨‍👩‍👧‍👦のような絵文字が含まれたり、https://www.nanananakam.com/length/などURLが含まれる場合でもそれぞれの数え方で正しく数えることができます。",
      commonDataTableHeaders: [
        {
          text: "カウント方法",
          sortable: false,
          value: "key"
        },
        {
          text: "文字数",
          sortable: false,
          value: "value"
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
      if (this.segmenter != null) {
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
        }, 0)
      return twitterNum.toString() + "/140"
    },
    resultDataTableItems(): commonDataTableItem[] {
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
    clearString: function () {
      this.inputString = ""
    }
  }
})
</script>

<style scoped>

</style>
