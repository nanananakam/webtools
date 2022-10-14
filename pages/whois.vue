<template>
  <v-form @submit.prevent="onSubmit">
    <recaptcha />
    <v-btn type="submit">Check</v-btn>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import "@nuxtjs/recaptcha";

export default Vue.extend({
  name: "whois",
  methods: {
    async onSubmit():Promise<void> {
      const token = await this.$recaptcha.getResponse()
      const params = {
        input:"8.8.8.8",
        recaptchaCode: token,
      }
      const res = this.$axios.post("https://aznqwjifqlgiqpq2qhdlrhsffq0wwegf.lambda-url.ap-northeast-1.on.aws/",params).catch(err => {
        //TODO: エラー処理
      })
      console.log(res)
    }
  }
})
</script>

<style scoped>

</style>
