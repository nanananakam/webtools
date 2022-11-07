<template>
  <div>
    <h1>IP情報確認ツール</h1>
    <div>入力されたIPに関する国や推定座標などの情報を<a href="https://dev.maxmind.com/geoip/geolite2-free-geolocation-data">GeoLite2</a>、RDAP(whois)、<a
      href="https://lite.ip2location.com">IP2Location LITE</a>、<a href="https://ipapi.co/">ipapi</a>から一括取得し地図と合わせて表示します。IPv4とIPv6の両方に対応します。
    </div>
    <v-form @submit.prevent="onSubmit" ref="form" v-model="valid">
      <v-text-field label="IPアドレス" v-model="inputValue" :rules="ipRules"></v-text-field>
      <div>
        <recaptcha/>
      </div>
      <br>
      <div>
        <v-btn type="submit" :disabled="!valid">確認</v-btn>
      </div>
    </v-form>
    <div v-for="error in errors">
      <v-alert type="error">{{ error }}</v-alert>
    </div>
    <br>
    <h2 v-if="geoIp2DataTableItems.length>0 || loading">GeoLite2取得結果</h2>
    <v-data-table v-if="geoIp2DataTableItems.length>0 || loading" :headers="commonDataTableHeaders"
                  :items="geoIp2DataTableItems" :loading="loading" :items-per-page="minusOne"
                  hide-default-footer></v-data-table>
    <client-only v-if="geoIp2MapIframeUrl.length>0">
      <h3>推定位置</h3>
      <iframe :src="geoIp2MapIframeUrl" width="80%" height="450" style="border:0;display: block; margin: 0 auto;"
              allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </client-only>
    <v-switch v-if="geoIp2DataTableItems.length>0 || loading" :headers="commonDataTableHeaders"
              v-model="showRawResponse" label="生レスポンスを表示"></v-switch>
    <div v-if="showRawResponse && geoIp2Raw">
      <h3>生レスポンス</h3>
      <v-textarea disabled v-model="geoIp2Raw"></v-textarea>
    </div>
    <h2 v-if="rdapDataTableItems.length>0 || loading">RDAP(whois) 取得結果</h2>
    <v-data-table v-if="rdapDataTableItems.length>0 || loading" :headers="commonDataTableHeaders"
                  :items="rdapDataTableItems" :loading="loading" :items-per-page="minusOne"
                  hide-default-footer></v-data-table>
    <v-switch v-if="rdapDataTableItems.length>0 || loading" :headers="commonDataTableHeaders" v-model="showRawResponse"
              label="生レスポンスを表示"></v-switch>
    <div v-if="showRawResponse && rdapResponseRaw">
      <h3>生レスポンス</h3>
      <v-textarea disabled v-model="rdapResponseRaw"></v-textarea>
    </div>
    <br>
    <h2 v-if="ip2LocationDataTableItems.length>0 || loading">IP2Location LITE 取得結果</h2>
    <v-data-table v-if="ip2LocationDataTableItems.length>0 || loading" :headers="commonDataTableHeaders"
                  :items="ip2LocationDataTableItems" :loading="loading" :items-per-page="minusOne"
                  hide-default-footer></v-data-table>
    <client-only v-if="ip2LocationMapIframeUrl.length>0">
      <h3>推定位置</h3>
      <iframe :src="ip2LocationMapIframeUrl" width="80%" height="450" style="border:0;display: block; margin: 0 auto;"
              allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </client-only>
    <br>
    <h2 v-if="ipApiDataTableItems.length>0 || ipApiLoading">ipapi 取得結果</h2>
    <v-data-table v-if="ipApiDataTableItems.length>0 || ipApiLoading" :headers="commonDataTableHeaders"
                  :items="ipApiDataTableItems" :loading="ipApiLoading" :items-per-page="minusOne"
                  hide-default-footer></v-data-table>
    <client-only v-if="ipApiMapIframeUrl.length>0">
      <h3>推定位置</h3>
      <iframe :src="ipApiMapIframeUrl" width="80%" height="450" style="border:0;display: block; margin: 0 auto;"
              allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </client-only>
    <br>
    <div>This product includes GeoLite2 data created by MaxMind, available from<a href="https://www.maxmind.com">https://www.maxmind.com</a>.
    </div>
    <div>This site or product includes IP2Location LITE data available from <a href="https://lite.ip2location.com">https://lite.ip2location.com</a>.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import "@nuxtjs/recaptcha";
import {DataTableHeader} from "vuetify";
import {AxiosError} from 'axios';

const myStatusCode = {
  statusOk: "OK",
  statusError: "ERROR"
} as const
type myStatusCode = typeof myStatusCode[keyof typeof myStatusCode]

const myErrorCode = {
  errorInvalidInput: "ERROR_INVALID_INPUT",
  errorRdapError: "ERROR_RDAP_ERROR",
  errorIp2LocationError: "ERROR_IP2LOCATION_ERROR",
  errorOther: "ERROR_OTHER",
} as const
type myErrorCode = typeof myErrorCode[keyof typeof myErrorCode];

// 必要な項目のみ定義
interface rdapResponse {
  name: string
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
  [index: string]: string | boolean | number | null
}

interface geoIp2Names {
  [lang: string]: string
}

interface geoIp2City {
  GeoNameID: number,
  Names: geoIp2Names,
}

interface geoIp2Continent {
  GeoNameID: number,
  Code: string,
  Names: geoIp2Names
}

interface geoIp2Country {
  GeoNameID: number,
  IsoCode: string,
  IsInEuropeanUnion: boolean,
  Names: geoIp2Names
}

interface geoIp2Location {
  AccuracyRadius: number,
  Latitude: number,
  Longitude: number,
  MetroCode: 0,
  TimeZone: string,
}

interface geoIp2PostalCode {
  Code: string
}

interface geoIp2RegisteredCountry {
  GeoNameID: number,
  IsInEuropeanUnion: boolean,
  IsoCode: string,
  Names: geoIp2Names
}

interface geoIp2RepresentedCountry {
  GeoNameID: number,
  IsInEuropeanUnion: boolean,
  IsoCode: string,
  Names: geoIp2Names,
  Type: string
}

interface geoIp2Subdivisions {
  GeoNameId: number,
  IsoCode: string,
  Names: geoIp2Names,
}

interface geoIp2Traits {
  IsAnonyousProxy: boolean
  IsSatelliteProvider: boolean
}

interface geoIp2LocationCity {
  City: geoIp2City,
  Continent: geoIp2Continent,
  Country: geoIp2Country,
  Location: geoIp2Location,
  Postal: geoIp2PostalCode,
  RegisteredCountry: geoIp2RegisteredCountry,
  RepresentedCountry: geoIp2RepresentedCountry,
  Subdivisions: geoIp2Subdivisions[],
  Traits: geoIp2Traits
}

interface myResponse {
  statusCode: myStatusCode,
  errorCode: myErrorCode,
  rdapResponseWithGuess: rdapResponseWithGuess,
  ip2LocationRecord: ip2LocationRecord,
  geoIp2LocationCity: geoIp2LocationCity
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
  ip2LocationMapIframeUrl: string,
  ipApiDataTableItems: commonDataTableItem[],
  ipApiMapIframeUrl: string,
  commonDataTableHeaders: DataTableHeader[],
  showRawResponse: boolean,
  loading: boolean,
  ipApiLoading: boolean,
  minusOne: number,
  errors: string[],
  ipRules: ((value: string) => string | boolean)[],
  valid: boolean,
  geoIp2Raw: string,
  geoIp2DataTableItems: commonDataTableItem[],
  geoIp2MapIframeUrl: string,
}

export default Vue.extend({
  name: "whois",
  head: {
    title: "IP情報確認ツール",
    meta: [
      {
        name: 'description',
        content: '入力されたIPに関する国などの情報をGeoLite2、RDAP(whois)、IP2Location LITE、ipapiから一括取得し表示します。IPv4とIPv6の両方に対応します。'
      },
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: 'IP情報確認ツール'},
      {property: 'og:description', content: '入力されたIPに関する情報をRDAP(whois)、IP2Location LITE、ipapiから一括取得し表示します。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/whois/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  },
  data(): PageData {
    return {
      errors: [],
      valid: false,
      showRawResponse: false,
      loading: false,
      ipApiLoading: false,
      minusOne: -1,
      rdapResponseRaw: "",
      inputValue: "",
      rdapDataTableItems: [],
      ip2LocationDataTableItems: [],
      ip2LocationMapIframeUrl: "",
      ipApiDataTableItems: [],
      ipApiMapIframeUrl: "",
      geoIp2Raw: "",
      geoIp2DataTableItems: [],
      geoIp2MapIframeUrl: "",
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
      ipRules: [
        v => /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(v) || /((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(v) || 'IPアドレスの形式ではありません'
      ]
    }
  },
  methods: {
    async onSubmit(): Promise<void> {
      this.errors = []
      this.loading = true
      this.rdapResponseRaw = ""
      this.rdapDataTableItems = []
      this.ip2LocationDataTableItems = []
      let token
      try {
        token = await this.$recaptcha.getResponse()
      } catch (e) {
        this.errors.push("reCaptcha処理に失敗しました")
        return
      }
      const params = {
        input: this.inputValue,
        recaptchaToken: token,
      }
      this.$axios.post<myResponse>("https://www.nanananakam.com/api/whois", params)
        .then(res => {
          this.geoIp2Raw = JSON.stringify(res.data.geoIp2LocationCity, null, 2)
          if (res.data.geoIp2LocationCity.Location.Latitude != 0 || res.data.geoIp2LocationCity.Location.Longitude != 0) {
            this.geoIp2MapIframeUrl = "https://maps.google.co.jp/maps?output=embed&ll=" + res.data.geoIp2LocationCity.Location.Latitude.toString() + "," + res.data.geoIp2LocationCity.Location.Longitude.toString() + "&t=m&hl=ja&z=10"
          } else {
            this.geoIp2MapIframeUrl = ""
          }
          this.geoIp2DataTableItems = [
            {
              key: "Country-IsoCode",
              value: res.data.geoIp2LocationCity.Country.IsoCode
            },
            {
              key: "Country-Names-en",
              value: res.data.geoIp2LocationCity.Country.Names.en
            },
            {
              key: "Country-Names-ja",
              value: res.data.geoIp2LocationCity.Country.Names.ja
            },
            {
              key: "Location-latitude",
              value: res.data.geoIp2LocationCity.Location.Latitude.toString()
            },
            {
              key: "Location-longitude",
              value: res.data.geoIp2LocationCity.Location.Longitude.toString()
            },
            {
              key: "Location-AccuracyRadius",
              value: res.data.geoIp2LocationCity.Location.AccuracyRadius.toString()
            },
            {
              key: "Traits-IsAnonyousProxy",
              value: res.data.geoIp2LocationCity.Traits.IsAnonyousProxy ? "true" : "false"
            },
            {
              key: "Traits-IsSattelliteProvider",
              value: res.data.geoIp2LocationCity.Traits.IsSatelliteProvider ? "true" : "false"
            }
          ]
          this.rdapResponseRaw = JSON.stringify(JSON.parse(res.data.rdapResponseWithGuess.rdapResponseRaw), null, 2)
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
          this.ip2LocationDataTableItems = Object.keys(res.data.ip2LocationRecord).map(key => {
            if (res.data.ip2LocationRecord[key] != null) {
              if (res.data.ip2LocationRecord[key]!.toString().indexOf("unavailable") == -1) {
                return {
                  key: key,
                  value: res.data.ip2LocationRecord[key]!.toString()
                }
              }
            }
            return {key: "", value: ""}
          }).filter(x => x.key.length > 0)
          if (res.data.ip2LocationRecord.Latitude && res.data.ip2LocationRecord.Longitude) {
            this.ip2LocationMapIframeUrl = "https://maps.google.co.jp/maps?output=embed&ll=" + res.data.ip2LocationRecord.Latitude.toString() + "," + res.data.ip2LocationRecord.Longitude.toString() + "&t=m&hl=ja&z=10";
          } else {
            this.ip2LocationMapIframeUrl = ""
          }
          this.loading = false
        })
        .catch((err: AxiosError<myResponse>) => {
          this.errors.push("RDAP, IP2Locationの取得に失敗しました")
          this.loading = false
        })
      this.$axios.get<ipApiResponse>("https://ipapi.co/" + this.inputValue + "/json")
        .then(res => {
          this.ipApiDataTableItems = Object.keys(res.data).map(key => {
            if (res.data[key] == null) {
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
          if (res.data.latitude && res.data.longitude) {
            this.ipApiMapIframeUrl = "https://maps.google.co.jp/maps?output=embed&ll=" + res.data.latitude.toString() + "," + res.data.longitude.toString() + "&t=m&hl=ja&z=10";
          } else {
            this.ipApiMapIframeUrl = ""
          }
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
