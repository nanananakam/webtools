<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col xs="12" sm="12" md="12" lg="9" xl="6">
      <h1>IP情報確認ツール</h1>
      <div>入力されたIPに関する情報をRDAP(whois)、IP2Location LITE(<a href="https://lite.ip2location.com">https://lite.ip2location.com</a>)、ipapi(<a href="https://ipapi.co/">https://ipapi.co/</a>)から一括取得し表示します。</div>
      <v-form @submit.prevent="onSubmit" ref="form" v-model="valid">
        <v-text-field label="IPアドレス" v-model="inputValue" :rules="ipRules"></v-text-field>
        <div>
          <recaptcha />
        </div>
        <br>
        <div>
          <v-btn type="submit" :disabled="!valid">確認</v-btn>
        </div>
      </v-form>
      <div v-for="error in errors">
        <v-alert type="error">{{error}}</v-alert>
      </div>
      <br>
      <h2 v-if="rdapDataTableItems.length>0 || loading">RDAP(whois) 取得結果</h2>
      <v-data-table v-if="rdapDataTableItems.length>0 || loading" :headers="commonDataTableHeaders" :items="rdapDataTableItems" :loading="loading" :items-per-page="minusOne" hide-default-footer></v-data-table>
      <v-switch v-if="rdapDataTableItems.length>0 || loading" :headers="commonDataTableHeaders" v-model="showRawResponse" label="未整形レスポンスを表示"></v-switch>
      <div v-if="showRawResponse && rdapResponseRaw">
        <h3>未整形レスポンス</h3>
        <v-textarea disabled v-model="rdapResponseRaw"></v-textarea>
      </div>
      <br>
      <h2 v-if="ip2LocationDataTableItems.length>0 || loading">IP2Location LITE 取得結果</h2>
      <v-data-table v-if="ip2LocationDataTableItems.length>0 || loading" :headers="commonDataTableHeaders" :items="ip2LocationDataTableItems" :loading="loading" :items-per-page="minusOne" hide-default-footer></v-data-table>
      <br>
      <h2 v-if="ipApiDataTableItems.length>0 || ipApiLoading">ipapi 取得結果</h2>
      <v-data-table v-if="ipApiDataTableItems.length>0 || ipApiLoading" :headers="commonDataTableHeaders" :items="ipApiDataTableItems" :loading="ipApiLoading" :items-per-page="minusOne" hide-default-footer></v-data-table>
      <br>
      <div>This site or product includes IP2Location LITE data available from <a href="https://lite.ip2location.com">https://lite.ip2location.com</a>.</div>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import "@nuxtjs/recaptcha";
import {DataTableHeader} from "vuetify";
import {AxiosError} from 'axios'

const myStatusCode = {
  statusOk    : "OK",
  statusError : "ERROR"
} as const
type myStatusCode = typeof myStatusCode[keyof typeof myStatusCode]

const myErrorCode = {
  errorInvalidInput : "ERROR_INVALID_INPUT",
  errorRdapError    : "ERROR_RDAP_ERROR",
  errorIp2LocationError : "ERROR_IP2LOCATION_ERROR",
  errorOther            : "ERROR_OTHER",
} as const
type myErrorCode = typeof myErrorCode[keyof typeof myErrorCode];

// 必要な項目のみ定義
interface rdapResponse {
  name:    string
  country: string
  startAddress: string
  endAddress: string
  handle: string
  parentHandle: string
  port43: string
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
  statusCode: myStatusCode,
  errorCode: myErrorCode,
  rdapResponseWithGuess: rdapResponseWithGuess,
  ip2LocationRecord: ip2LocationRecord,
}

interface ipApiResponse {
  [index: string]: string | boolean | number | null
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
  ipApiDataTableItems: commonDataTableItem[],
  commonDataTableHeaders: DataTableHeader[],
  showRawResponse: boolean,
  loading: boolean,
  ipApiLoading: boolean,
  minusOne: number,
  errors: string[],
  ipRules: ((value:string)=>string|boolean)[],
  valid: boolean,
}

export default Vue.extend({
  name: "whois",
  data(): PageData{
    return {
      errors: [],
      valid: false,
      showRawResponse: false,
      loading: false,
      ipApiLoading: false,
      minusOne: -1,
      rdapResponseRaw: "",
      inputValue:"",
      rdapDataTableItems: [],
      ip2LocationDataTableItems: [],
      ipApiDataTableItems: [],
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
      ],
      ipRules:[
        v => /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(v) || /((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(v) || 'IPアドレスの形式ではありません'
      ]
    }
  },
  methods: {
    async onSubmit():Promise<void> {
      this.errors = []
      this.loading = true
      this.rdapResponseRaw = ""
      this.rdapDataTableItems = []
      this.ip2LocationDataTableItems = []
      let token
      try {
        token = await this.$recaptcha.getResponse()
      }catch(e){
        this.errors.push("reCaptcha処理に失敗しました")
        return
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
              key: "country",
              value: res.data.rdapResponseWithGuess.rdapResponse.country || "（JPではない可能性が濃厚）",
            },
            {
              key: "name",
              value: res.data.rdapResponseWithGuess.rdapResponse.name,
            },
            {
              key: "hanlde",
              value: res.data.rdapResponseWithGuess.rdapResponse.handle
            },
            {
              key: "parentHandle",
              value: res.data.rdapResponseWithGuess.rdapResponse.parentHandle
            },
            {
              key: "startAddress",
              value: res.data.rdapResponseWithGuess.rdapResponse.startAddress
            },
            {
              key: "endAddress",
              value: res.data.rdapResponseWithGuess.rdapResponse.endAddress
            },
            {
              key: "port43",
              value: res.data.rdapResponseWithGuess.rdapResponse.port43
            },
            {
              key: "組織説明（推定）",
              value: res.data.rdapResponseWithGuess.guessedName,
            },
          ]
          this.ip2LocationDataTableItems = [
            {
              key: "Country_short",
              value: res.data.ip2LocationRecord.Country_short,
            },
            {
              key: "Country_long",
              value: res.data.ip2LocationRecord.Country_long,
            }
          ]
          this.loading = false
        })
        .catch((err: AxiosError<myResponse>) => {
          this.errors.push("RDAP, IP2Locationの取得に失敗しました")
          this.loading = false
        })
      this.$axios.get<ipApiResponse>("https://ipapi.co/"+this.inputValue+"/json")
        .then(res =>{
          this.ipApiDataTableItems = Object.keys(res.data).map(key => {
            if (res.data[key] == null){
              return {
                key: key,
                value: ""
              }
            } else {
              return {
                key: key,
                value: res.data[key]!.toString()
              }
            }
          })
        })
        .catch((err: AxiosError<ipApiResponse>) => {
          this.errors.push("ipapiの取得に失敗しました")
        })
      this.$recaptcha.reset()
    }
  }
})
</script>

<style scoped>

</style>
