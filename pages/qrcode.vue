<template>
    <div>
      <h1>QRコード生成ツール</h1>
      <div>入力された画像からQRコードを生成します。</div>
      <br>
      <v-text-field v-model="inputString" @change="createQr"></v-text-field>
      <v-btn type="submit" v-on:click="createQr">生成</v-btn>
      <br>
      <canvas id="qrcode-result-canvas"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import QRCode from "qrcode";

interface PageData {
  inputString: string
}

export default Vue.extend({
  name: "qrcode",
  head: {
    title: "QRコード生成ツール"
  },
  data():PageData {
    return {
      inputString:""
    }
  },
  methods: {
    createQr():void {
      const canvas = document.getElementById("qrcode-result-canvas")
      QRCode.toCanvas(canvas, this.inputString, function (error) {
        console.log(error)
      })
    }
  }
})
</script>

<style scoped>

</style>
