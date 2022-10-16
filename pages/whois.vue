<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col xs="12" sm="12" md="12" lg="9" xl="6">
      <v-form @submit.prevent="onSubmit">
        <v-text-field label="IPアドレス" v-model="inputValue"></v-text-field>
        <div>
          <recaptcha />
          <v-btn type="submit">確認</v-btn>
        </div>
      </v-form>
      <v-switch v-model="showRawResponse" label="未整形レスポンスを表示"></v-switch>
      <h2 v-if="rdapDataTableItems.length>0 || loading">RDAP(whois) 取得結果</h2>
      <v-data-table v-if="rdapDataTableItems.length>0 || loading" :headers="commonDataTableHeaders" :items="rdapDataTableItems" :loading="loading" hide-default-footer></v-data-table>
      <div v-if="showRawResponse && rdapResponseRaw">
        <h3>未整形レスポンス</h3>
        <v-textarea disabled v-model="rdapResponseRaw"></v-textarea>
      </div>
      <h2 v-if="ip2LocationDataTableItems.length>0 || loading">IP2Location LITE 取得結果</h2>
      <v-data-table v-if="ip2LocationDataTableItems.length>0 || loading" :headers="commonDataTableHeaders" :items="ip2LocationDataTableItems" :loading="loading" hide-default-footer></v-data-table>
      <div>This site or product includes IP2Location LITE data available from <a href="https://lite.ip2location.com">https://lite.ip2location.com</a>.</div>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import "@nuxtjs/recaptcha";
import {DataTableHeader} from "vuetify";

// 必要な項目のみ定義
interface rdapResponse {
  name:    string
  country: string
  startAddress: string
  endAddress: string
}

interface rdapResponseWithGuess {
  rdapResponse: rdapResponse
  rdapResponseRaw: string
  guessedName: string
}

interface ip2LocationRecord {
  Country_short: string
  Country_long: string
}

interface myResponse {
  statusCode: string,
  errorCode: string,
  rdapResponseWithGuess: rdapResponseWithGuess,
  ip2LocationRecord: ip2LocationRecord,
}

interface commonDataTableItem {
  key: string,
  value: string,
}

interface PageData {
  inputValue: string,
  rdapDataTableItems: commonDataTableItem[],
  rdapResponseRaw: string,
  ip2LocationDataTableItems: commonDataTableItem[],
  commonDataTableHeaders: DataTableHeader[],
  showRawResponse: boolean,
  loading: boolean,
}

export default Vue.extend({
  name: "whois",
  data(): PageData{
    return {
      showRawResponse: false,
      loading: false,
      rdapResponseRaw: "",
      inputValue:"",
      rdapDataTableItems: [],
      ip2LocationDataTableItems: [],
      commonDataTableHeaders: [
        {
          text: "",
          sortable: false,
          value: "key"
        },
        {
          text: "結果",
          sortable: false,
          value: "value"
        }
      ]
    }
  },
  methods: {
    async onSubmit():Promise<void> {
      this.loading = true
      this.rdapResponseRaw = ""
      this.rdapDataTableItems = []
      this.ip2LocationDataTableItems = []
      let token
      try {
        token = await this.$recaptcha.getResponse()
      }catch(e){
        console.log(e)
      }
      const params = {
        input:this.inputValue,
        recaptchaToken: token,
      }
      //直接取得はCORSエラーとなるので、自前の中継サーバーを経由する
      this.$axios.post<myResponse>("https://aznqwjifqlgiqpq2qhdlrhsffq0wwegf.lambda-url.ap-northeast-1.on.aws/",params)
        .then(res => {
          this.rdapResponseRaw = res.data.rdapResponseWithGuess.rdapResponseRaw
          this.rdapDataTableItems = [
            {
              key: "国",
              value: res.data.rdapResponseWithGuess.rdapResponse.country,
            },
            {
              key: "登録名",
              value: res.data.rdapResponseWithGuess.rdapResponse.name,
            },
            {
              key: "組織説明（推定）",
              value: res.data.rdapResponseWithGuess.guessedName,
            },
            {
              key: "IP範囲",
              value: res.data.rdapResponseWithGuess.rdapResponse.startAddress+" - "+res.data.rdapResponseWithGuess.rdapResponse.endAddress,
            },
          ]
          this.ip2LocationDataTableItems = [
            {
              key: "Country_short",
              value: res.data.ip2LocationRecord.Country_short,
            },
            {
              key: "Coutry_long",
              value: res.data.ip2LocationRecord.Country_long,
            }
          ]
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
      this.$recaptcha.reset()
    }
  }
})
</script>

<style scoped>

</style>
