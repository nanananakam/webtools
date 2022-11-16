<template>
  <div>
    <h1>UnixTime便利ツール</h1>
    <div>UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。</div>
    <!-- input time begin-->
    <v-form>
      <v-text-field label="時刻" v-model="inputValue"></v-text-field>
    </v-form>
    <!-- input time end -->
    <!-- select parse mode begin-->
    <v-form>
      <v-select label="入力形式" v-model="parseMode" :items="parseModeList" item-value="mode" item-text="modeString"
                return-object>
      </v-select>
    </v-form>
    <!-- select parse mode end-->
    <!-- select time zone begin-->
    <v-form>
      <v-autocomplete label="TimeZone" v-model="timeZoneString" :items="timeZoneList" item-value="timeZoneString"
                      item-text="timeZoneDetailString">
      </v-autocomplete>
    </v-form>
    <!-- select time zone end-->
    <!-- show parse result begin-->
    <h2>変換結果</h2>
    <v-data-table :headers="resultDateTimeDataTableHeaders" :items="resultDateTimeDataTableItems" hide-default-footer>
      <template v-slot:item.resultInTargetTimeZone="{ item }">
        <value-to-clipboard :text="item.resultInTargetTimeZone"></value-to-clipboard>
      </template>
      <template v-slot:item.resultInUtc="{ item }">
        <value-to-clipboard :text="item.resultInUtc"></value-to-clipboard>
      </template>
    </v-data-table>
    <h2>追加情報</h2>
    <v-data-table :headers="resultOtherDataTableHeaders" :items="resultOtherDataTableItems" hide-default-header
                  hide-default-footer></v-data-table>
    <!-- time math button begin-->
    <h2>日時操作</h2>
    <div class="text-center">
      <v-btn v-on:click="firstDayOfLastMonth" v-bind:disabled="luxonDateTime == null" xs="12"
             class="d-inline-flex ma-2">前月1日
      </v-btn>
      <v-btn v-on:click="firstDayOfThisMonth" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">
        今月1日
      </v-btn>
      <v-btn v-on:click="setZeroZero" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">00:00:00
      </v-btn>
      <v-btn v-on:click="firstDayOfNextMonth" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">
        翌月1日
      </v-btn>
      <br>
      <v-btn v-on:click="minusOneMonths" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">-1ヶ月
      </v-btn>
      <v-btn v-on:click="minusOneDay" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">-1日</v-btn>
      <v-btn v-on:click="minusOneHour" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">-1時間</v-btn>
      <v-btn v-on:click="setNow" class="d-inline-flex ma-2">現在時刻</v-btn>
      <v-btn v-on:click="plusOneHour" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">+1時間</v-btn>
      <v-btn v-on:click="plusOneDay" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">+1日</v-btn>
      <v-btn v-on:click="plusOneMonths" v-bind:disabled="luxonDateTime == null" class="d-inline-flex ma-2">+1ヶ月</v-btn>
    </div>
    <!-- time math button end-->
    <h2>入力可能な形式</h2>
    <v-data-table :headers="inputFormatDataTableHeaders" :items="inputFormatDatatableItems" hide-default-header
                  hide-default-footer>
      <template v-slot:item.example="{ item }">
        <pre>{{ item.example }}</pre>
      </template>
    </v-data-table>
    <h2>解説</h2>
    <h3>UnixTime</h3>
    <div>UnixTime(Unix時間)は、別名POSIX時間、エポック秒などとも呼ばれますが、協定世界時(UTC)1970年1月1日午前0時0分0秒からのうるう秒を除いた経過秒数で示した時刻です。</div>
    <h3>SQL形式</h3>
    <div>SQL形式は、リレーショナルデータベース問い合わせ言語のSQLで用いられる時刻の形式です。ISO8601と似ています。</div>
    <h3>ISO 8601形式</h3>
    <div>ISO8601は、日付と時刻の表記に関するISOの国際規格です。大→小の順序（ビッグエンディアン big- endian）を貫徹して、時間の表記は24時間表記のみとし、日付・時刻の記述順序をただ一種類に標準化していることが特徴です。</div>
    <h3>HTTP形式</h3>
    <div>RFC 850/RFC 1123などで規定された歴史的にHTTP関係でよく使われていた形式です。</div>
    <h3>RFC 2822形式</h3>
    <div>RFC2822で規定された歴史的に電子メール関係でよく使われていた形式です。</div>
    <!-- show parse result end-->
  </div>
</template>

<script lang="ts">
import {DateTime} from 'luxon';
import Vue from "vue";

import {getTimeZones} from "@vvo/tzdb";
import ValueToClipboard from "../components/valueToClipboard.vue";
import {DataTableHeader} from "vuetify";

const FORMAT_TYPE = {
  unix: 'unix',
  sql: 'sql',
  iso: 'iso',
  rfc: 'rfc',
  http: 'http',
} as const;
type FORMAT_TYPE = typeof FORMAT_TYPE[keyof typeof FORMAT_TYPE];

const PARSE_MODE_PARTS = {
  auto: 'auto',
} as const
type PARSE_MODE_PARTS = typeof PARSE_MODE_PARTS[keyof typeof PARSE_MODE_PARTS];

type PARSE_MODE = FORMAT_TYPE | PARSE_MODE_PARTS

interface ParseModeSelectorElement {
  mode: PARSE_MODE,
  modeString: string,
}

interface TimeZoneElement {
  timeZoneString: string,
  timeZoneDetailString: string,
}

interface InputFormatExampleDataTableItem {
  formatName: string,
  example: string,
}

interface PageData {
  inputValue: string,
  timeZoneString: string,
  timeZoneList: TimeZoneElement[],
  parseMode: ParseModeSelectorElement,
  parseModeList: ParseModeSelectorElement[],
  resultOtherDataTableHeaders: DataTableHeader[],
  inputFormatDataTableHeaders: DataTableHeader[],
  inputFormatDatatableItems: InputFormatExampleDataTableItem[]
}

interface ResultDateTimeDataTableItem {
  formatTypeString: string,
  resultInTargetTimeZone: string,
  resultInUtc: string,
}

interface ResultOtherDataTableItem {
  key: string,
  value: string,
}

export default Vue.extend({
  name: "unixtime",
  head: {
    title: "UnixTime便利ツール",
    meta: [
      {name: 'description', content: 'UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。'},
      {property: 'og:site_name', content: 'nanananakam-webtools'},
      {property: 'og:type', content: 'article'},
      {property: 'og:title', content: 'UnixTime便利ツール'},
      {property: 'og:description', content: 'UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/unixtime/'},
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://www.nanananakam.com/unixtime/'
      }
    ]
  },
  components: {
    ValueToClipboard
  },
  data(): PageData {
    const timeZoneList = getTimeZones({includeUtc: true}).map(
      timeZone => {
        return {
          timeZoneString: timeZone.name,
          timeZoneDetailString: timeZone.rawFormat + " (" + timeZone.name + ", " + timeZone.abbreviation + ")"
        }
      }
    );
    const parseModeList: ParseModeSelectorElement[] = [
      {
        mode: "auto",
        modeString: "自動判別"
      },
      {
        mode: "unix",
        modeString: "UnixTime(秒)"
      },
      {
        mode: "sql",
        modeString: "SQL形式"
      },
      {
        mode: "iso",
        modeString: "ISO 8601形式"
      },
      {
        mode: "rfc",
        modeString: "RFC 2822形式"
      },
      {
        mode: "http",
        modeString: "HTTP 形式(RFC 850/RFC 1123)"
      }
    ]
    const resultOtherDataTableHeaders: DataTableHeader[] = [
      {
        text: '',
        sortable: false,
        value: 'key'
      },
      {
        text: "",
        sortable: false,
        value: 'value'
      }
    ]
    const inputFormatExampleDataTableHeaders: DataTableHeader[] = [
      {
        text: "形式",
        sortable: false,
        value: "formatName"
      },
      {
        text: "例",
        sortable: false,
        value: "example"
      }
    ];
    const inputFormatExampleDataTableItems: InputFormatExampleDataTableItem[] = [
      {
        formatName: "Unixtime(秒)",
        example: "1542674993"
      },
      {
        formatName: "SQL形式",
        example: `2017-05-15 09:24:15
2017-05-15
09:24:15`
      },
      {
        formatName: "ISO 8601形式",
        example: `2016
2016-05
201605
2016-05-25
20160525
2016-05-25T09
2016-05-25T09:24
2016-05-25T09:24:15
2016-05-25T0924
2016-05-25T092415
2016-W21-3
2016W213
2016-200
2016200
09:24
09:24:15`
      },
      {
        formatName: "RFC 2822形式",
        example: "Tue, 01 Nov 2016 13:23:12 +0630"
      },
      {
        formatName: "HTTP(RFC 850/RFC 1123)形式",
        example: `Sunday, 06-Nov-94 08:49:37 GMT
Sun, 06 Nov 1994 08:49:37 GMT`
      }
    ];
    return {
      inputValue: DateTime.now().toFormat("X"),
      timeZoneString: DateTime.now().zoneName,
      timeZoneList: timeZoneList,
      parseMode: parseModeList[0],
      parseModeList: parseModeList,
      resultOtherDataTableHeaders: resultOtherDataTableHeaders,
      inputFormatDataTableHeaders: inputFormatExampleDataTableHeaders,
      inputFormatDatatableItems: inputFormatExampleDataTableItems
    }
  },
  computed: {
    parseResult(): { dateTime: DateTime, formatType: FORMAT_TYPE } | null {
      switch (this.parseMode.mode) {
        case "auto":
          if (/^[0-9]+$/.exec(this.inputValue)) {
            const parsedAsUnix = DateTime.fromSeconds(Number(this.inputValue))
            if (parsedAsUnix.isValid) {
              return {
                dateTime: DateTime.fromSeconds(Number(this.inputValue)).setZone(this.timeZoneString),
                formatType: "unix"
              };
            }
          } else {
            const parsedAsSQL = DateTime.fromSQL(this.inputValue);
            if (parsedAsSQL.isValid) {
              return {dateTime: parsedAsSQL.setZone(this.timeZoneString), formatType: "sql"}
            }
            const parsedAsISO = DateTime.fromISO(this.inputValue);
            if (parsedAsISO.isValid) {
              return {dateTime: parsedAsISO.setZone(this.timeZoneString), formatType: "iso"};
            }
            const parsedAsRfc = DateTime.fromRFC2822(this.inputValue);
            if (parsedAsRfc.isValid) {
              return {dateTime: parsedAsRfc.setZone(this.timeZoneString), formatType: "rfc"};
            }
            const parsedAsHttp = DateTime.fromHTTP(this.inputValue)
            if (parsedAsHttp.isValid) {
              return {dateTime: parsedAsHttp.setZone(this.timeZoneString), formatType: "http"}
            }
          }
          return null;
        //必ずreturnするのでbreak不要
        case "unix":
          const parsedAsUnix = DateTime.fromSeconds(Number(this.inputValue))
          if (parsedAsUnix.isValid) {
            return {
              dateTime: DateTime.fromSeconds(Number(this.inputValue)).setZone(this.timeZoneString),
              formatType: "unix"
            };
          }
          return null;
        //必ずreturnするのでbreak不要
        case "sql":
          const parsedAsSQL = DateTime.fromSQL(this.inputValue);
          if (parsedAsSQL.isValid) {
            return {dateTime: parsedAsSQL.setZone(this.timeZoneString), formatType: "sql"}
          }
          return null;
        //必ずreturnするのでbreak不要
        case "iso":
          const parsedAsISO = DateTime.fromISO(this.inputValue);
          if (parsedAsISO.isValid) {
            return {dateTime: parsedAsISO.setZone(this.timeZoneString), formatType: "iso"};
          }
          return null;
        //必ずreturnするのでbreak不要
        case "rfc":
          const parsedAsRfc = DateTime.fromRFC2822(this.inputValue);
          if (parsedAsRfc.isValid) {
            return {dateTime: parsedAsRfc.setZone(this.timeZoneString), formatType: "rfc"};
          }
          return null;
        //必ずreturnするのでbreak不要
        case "http":
          const parsedAsHttp = DateTime.fromHTTP(this.inputValue)
          if (parsedAsHttp.isValid) {
            return {dateTime: parsedAsHttp.setZone(this.timeZoneString), formatType: "http"}
          }
          return null;
        //必ずreturnするのでbreak不要
      }
    },
    formatType(): FORMAT_TYPE | null {
      if (this.parseResult == null) {
        return null
      } else {
        return this.parseResult.formatType
      }
    },
    luxonDateTime(): DateTime | null {
      if (this.parseResult == null) {
        return null
      } else {
        return this.parseResult.dateTime;
      }
    },
    utcLuxonDateTime(): DateTime | null {
      if (this.luxonDateTime == null) {
        return null;
      } else {
        return this.luxonDateTime.setZone('UTC');
      }
    },
    unixTimeString(): string {
      if (this.luxonDateTime == null) {
        return "";
      }
      return this.luxonDateTime.toFormat("X");
    },
    dateString(): string {
      if (this.luxonDateTime == null) {
        return "";
      }
      return this.luxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    utcDateString(): string {
      if (this.utcLuxonDateTime == null) {
        return "";
      }
      return this.utcLuxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    isoString(): string {
      if (this.luxonDateTime == null) {
        return "";
      }
      return this.luxonDateTime.toISO();
    },
    utcIsoString(): string {
      if (this.utcLuxonDateTime == null) {
        return "";
      }
      return this.utcLuxonDateTime.toISO();
    },
    rfcString(): string {
      if (this.luxonDateTime == null) {
        return "";
      }
      return this.luxonDateTime.toRFC2822();
    },
    utcRfcString(): string {
      if (this.utcLuxonDateTime == null) {
        return "";
      }
      return this.utcLuxonDateTime.toRFC2822();
    },
    sqlString(): string {
      if (this.luxonDateTime == null) {
        return "";
      }
      return this.luxonDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    },
    utcSqlString(): string {
      if (this.utcLuxonDateTime == null) {
        return "";
      }
      return this.utcLuxonDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    },
    utcHttpString(): string {
      if (this.utcLuxonDateTime == null) {
        return ""
      }
      return this.utcLuxonDateTime.toHTTP()
    },
    diffString(): string {
      if (this.luxonDateTime == null) {
        return "";
      }
      let isBeforeNow;
      //1秒未満を切り捨てるためにちょっと回りくどいことをしている
      const nowUnixTime = DateTime.now().toFormat("X");
      if (this.luxonDateTime.toFormat(("X")) === nowUnixTime) {
        return "0秒";
      }
      const now = DateTime.fromSeconds(Number(nowUnixTime))
      if (now > this.luxonDateTime) {
        isBeforeNow = true;
      } else {
        isBeforeNow = false;
      }

      let diff;
      // secondの小数点以下が出ないようにmillisecondsも指定する
      if (isBeforeNow) {
        diff = now.diff(this.luxonDateTime, ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']).toObject();
      } else {
        diff = this.luxonDateTime.diff(now, ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']).toObject();
      }

      let result = "";
      if (diff.years) {
        result = result + String(diff.years) + '年'
      }
      if (diff.months) {
        result = result + String(diff.months) + 'ヶ月'
      }
      if (diff.days) {
        result = result + String(diff.days) + '日'
      }
      if (diff.hours) {
        result = result + String(diff.hours) + '時間'
      }
      if (diff.minutes) {
        result = result + String(diff.minutes) + '分'
      }
      if (diff.seconds) {
        result = result + String(diff.seconds) + '秒'
      }

      if (isBeforeNow) {
        result += "前"
      } else {
        result += "後"
      }

      return result
    },
    resultDateTimeDataTableHeaders(): DataTableHeader[] {
      return [
        {
          text: "形式",
          sortable: false,
          value: "formatTypeString"
        },
        {
          text: this.timeZoneString,
          sortable: false,
          value: "resultInTargetTimeZone"
        },
        {
          text: "utc",
          sortable: false,
          value: "resultInUtc"
        }
      ];
    },
    resultDateTimeDataTableItems(): ResultDateTimeDataTableItem[] {
      return [
        {
          formatTypeString: "UnixTime形式",
          resultInTargetTimeZone: this.unixTimeString,
          resultInUtc: this.unixTimeString
        },
        {
          formatTypeString: "日時表記(環境依存)",
          resultInTargetTimeZone: this.dateString,
          resultInUtc: this.utcDateString
        },
        {
          formatTypeString: "SQL形式",
          resultInTargetTimeZone: this.sqlString,
          resultInUtc: this.utcSqlString
        },
        {
          formatTypeString: "ISO 8601形式",
          resultInTargetTimeZone: this.isoString,
          resultInUtc: this.utcIsoString,
        },
        {
          formatTypeString: "RFC 2822形式",
          resultInTargetTimeZone: this.rfcString,
          resultInUtc: this.utcRfcString
        },
        {
          formatTypeString: "HTTP(RFC 850/RFC 1123)形式",
          resultInTargetTimeZone: this.utcHttpString,
          resultInUtc: this.utcHttpString,
        }
      ]
    },
    resultOtherDataTableItems(): ResultOtherDataTableItem[] {
      const inputFormatString = this.parseModeList.find((parseMode) => (parseMode.mode === this.formatType))!.modeString
      return [
        {
          "key": "現在時刻との差",
          "value": this.diffString
        },
        {
          "key": "入力形式",
          "value": inputFormatString
        }
      ]
    }
  },
  methods: {
    resetParseMode: function () {
      this.parseMode = {
        mode: "auto",
        modeString: "自動"
      };
    },
    plusOneHour: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.plus({hours: 1}).toFormat("X");
        this.resetParseMode();
      }
    },
    minusOneHour: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.minus({hours: 1}).toFormat("X");
        this.resetParseMode();
      }
    },
    plusOneDay: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.plus({days: 1}).toFormat("X");
        this.resetParseMode();
      }
    },
    minusOneDay: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.minus({days: 1}).toFormat("X");
        this.resetParseMode();
      }
    },
    plusOneMonths: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.plus({months: 1}).toFormat("X");
        this.resetParseMode();
      }
    },
    minusOneMonths: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.minus({months: 1}).toFormat("X");
        this.resetParseMode();
      }
    },
    setZeroZero: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.set({hour: 0, minute: 0, second: 0}).toFormat("X");
        this.resetParseMode();
      }
    },
    firstDayOfThisMonth: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.startOf("month").toFormat("X")
        this.resetParseMode();
      }
    },
    firstDayOfLastMonth: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.startOf("month").minus({days: 1}).startOf("month").toFormat("X");
        this.resetParseMode();
      }
    },
    firstDayOfNextMonth: function () {
      if (this.luxonDateTime != null) {
        this.inputValue = this.luxonDateTime.endOf("month").plus({days: 1}).startOf("month").toFormat("X");
        this.resetParseMode();
      }
    },
    setNow: function () {
      this.resetParseMode();
      this.inputValue = DateTime.now().toFormat("X")
    }
  },
})
</script>

<style scoped>

</style>
