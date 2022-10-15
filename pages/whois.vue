<template>
  <div>
  <v-form @submit.prevent="onSubmit">
    <v-text-field label="IPアドレス" v-model="inputValue"></v-text-field>
    <recaptcha />
    <v-btn type="submit">Check</v-btn>
  </v-form>
  <div>{{rdapResponseRaw}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import "@nuxtjs/recaptcha";

interface rdapRemark {
  title:       string
  description: string[]
}

// 必要な項目のみ定義
interface rdapResponse {
  name:    string
  country: string
  candle:  string
  remarks: rdapRemark[]
}

interface myResponse {
  statusCode: string,
  errorCode: string,
  rdapResponse: rdapResponse,
  rdapResponseRaw: string,
}

interface PageData {
  inputValue: string,
  rdapResponse: rdapResponse,
  rdapResponseRaw: string,
}

export default Vue.extend({
  name: "whois",
  data(): PageData{
    return {
      inputValue:"",
      rdapResponse: {
        name: "",
        country: "",
        candle:"",
        remarks:[],
      },
      rdapResponseRaw:""
    }
  },
  methods: {
    async onSubmit():Promise<void> {
      const token = await this.$recaptcha.getResponse()
      const params = {
        input:"8.8.8.8",
        recaptchaToken: token,
      }
      //直接取得はCORSエラーとなるので、自前の中継サーバーを経由する
      this.$axios.post<myResponse>("https://aznqwjifqlgiqpq2qhdlrhsffq0wwegf.lambda-url.ap-northeast-1.on.aws/",params)
        .then(res => {
          this.rdapResponse = res.data.rdapResponse
          this.rdapResponseRaw = res.data.rdapResponseRaw
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
</script>

<style scoped>

</style>
