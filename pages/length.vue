<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col xs="12" sm="12" md="12" lg="9" xl="6">
      <h1>文字数カウントツール</h1>
      <div>フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します、</div>
      <v-textarea v-model="inputString"></v-textarea>
      <v-data-table :headers="commonDataTableHeaders" :items="resultDataTableItems" hide-default-footer></v-data-table>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
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
  commonDataTableHeaders: DataTableHeader[]
}

export default Vue.extend({
  name: "length",
  data(): PageData{
    return {
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
      if ("Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("ja", {granularity: "grapheme"});
        return [...segmenter.segment(this.inputString)].length
      } else {
        return "このブラウザではIntl.Segmenterがサポートされていません。Google Chrome最新版をご利用ください。"
      }
    },
    utf8ByteNum(): number {
      const utf8Encoder = new TextEncoder()
      return utf8Encoder.encode(this.inputString).byteLength
    },
    twitterNumString(): string {
      // firefoxが現時点の最新版でもSegmenter.Intlが使えないので分岐
      if ("Segmenter" in Intl) {
        const urlRegex = /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
        const urlReplacedInputValue = this.inputString.replace(urlRegex,"12345678901234567890123") //URLは半角23文字相当となる
        const segmenter = new Intl.Segmenter("ja", {granularity: "grapheme"});
        const utf8Encoder = new TextEncoder()
        const twitterNum = [...segmenter.segment(urlReplacedInputValue)]
          .map( s => {
            if ( utf8Encoder.encode(s.segment).byteLength == 1 ) {
              return 0.5 as number;
            } else {
              return 1 as number;
            }
          })
          .reduce((a,b) => {
            return a+b;
          })
        return twitterNum.toString()+"/140"
      } else {
        return "このブラウザではIntl.Segmenterがサポートされていません。Google Chrome最新版をご利用ください。"
      }
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
  }
})
</script>

<style scoped>

</style>
