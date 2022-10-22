<template>
    <div>
      <h1>QRコード生成ツール</h1>
      <div>入力された文字列からQRコードを作成します。ダウンロードもできます。</div>
      <br>
      <v-text-field v-model="inputString" @change="createQr"></v-text-field>
      <v-radio-group
        label="誤り訂正レベル"
        v-model="errorCorrectionLevel"
        row
      >
        <v-radio label="L(~7%)" value="L"></v-radio>
        <v-radio label="M(~15%)" value="M"></v-radio>
        <v-radio label="Q(~25%)" value="Q"></v-radio>
        <v-radio label="H(=35%)" value="H"></v-radio>
      </v-radio-group>
      <v-btn type="submit" v-on:click="createQr">生成</v-btn>
      <br>
      <img v-if="resultDataUrl" :src="resultDataUrl">
      <br>
      <a v-if="resultDataUrl" :href="resultDataUrl" download>ダウンロード</a>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import QRCode from "qrcode";

interface PageData {
  inputString: string,
  resultDataUrl: string | null
  errorCorrectionLevel: QRCode.QRCodeErrorCorrectionLevel
}

export default Vue.extend({
  name: "qrcode",
  head: {
    title: "QRコード生成ツール",
    meta: [
      { name: 'description', content: '入力された文字列からQRコードを生成します。ダウンロードもできます。' },
      { property: 'og:site_name', content: 'nanananakam-webtools' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: 'QRコード生成ツール' },
      { property: 'og:description', content: '入力された文字列からQRコードを生成します。ダウンロードもできます。' },
      { property: 'og:url', content: 'https://www.nanananakam.com/qrcode/' },
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      { name: 'twitter:card', content: 'summary' },
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data():PageData {
    return {
      inputString:"",
      resultDataUrl:null,
      errorCorrectionLevel:"M",
    }
  },
  methods: {
    createQr():void {
      const self = this
      QRCode.toDataURL(this.inputString, { errorCorrectionLevel:this.errorCorrectionLevel },function (error, url) {
        if (error) {
          console.log(error)
        } else {
          self.resultDataUrl = url
        }
      })
    }
  }
})
</script>

<style scoped>

</style>
