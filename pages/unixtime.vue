<template>
  <v-row>
    <v-col class="text-center">
      <v-row>
        <v-spacer></v-spacer>
        <v-col xs="12" sm="12" md="6" lg="4" xl="3">
          <v-form>
            <v-text-field v-model="inputValue"></v-text-field>
          </v-form>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col xs="12" sm="12" md="6" lg="4" xl="3">
        <v-form>
          <v-select v-model="parseMode" :items="parseModeList" item-value="mode" item-text="modeString" return-object>
          </v-select>
        </v-form>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col xs="12" sm="12" md="12" lg="9" xl="6">
      <v-simple-table>
        <thead>
          <tr>
            <th></th>
            <th class="text-center">{{timeZoneString}}</th>
            <th class="text-center">UTC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>入力形式</td>
            <td colspan="2">
              <div v-if="resultParseMode == null">解析できませんでした</div>
              <div v-if="resultParseMode === 'unix'">UnixTime</div>
              <div v-if="resultParseMode === 'sql'">SQL形式</div>
              <div v-if="resultParseMode === 'iso'">ISO8601形式</div>
              <div v-if="resultParseMode === 'rfc'">RFC2822形式</div>
            </td>
          </tr>

          <tr>
            <td>日時表記(環境依存)</td>
            <td>{{dateString}}</td>
            <td>{{utcDateString}}</td>
          </tr>
          <tr>
            <td>SQL形式</td>
            <td>{{sqlString}}</td>
            <td>{{utcSqlString}}</td>
          </tr>
          <tr>
            <td>ISO 8601</td>
            <td>{{isoString}}</td>
            <td>{{utcIsoString}}</td>
          </tr>
          <tr>
            <td>RFC 2822</td>
            <td>{{rfcString}}</td>
            <td>{{utcRfcString}}</td>
          </tr>
        <tr>
          <td>現在時刻との差</td>
          <td colspan="2">{{diffString}}</td>
        </tr>
        </tbody>
      </v-simple-table>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {DateTime} from 'luxon';
import Vue from "vue";

const PARSE_MODE = {
  auto: 'auto',
  unix: 'unix',
  sql: 'sql',
  iso: 'iso',
  rfc: 'rfc',
} as const;
type PARSE_MODE = typeof PARSE_MODE[keyof typeof PARSE_MODE];

interface ParseModeSelectorElement {
  mode: PARSE_MODE,
  modeString: string,
}

interface PageData {
  inputValue: string,
  timeZoneString: string,
  parseMode: ParseModeSelectorElement,
  parseModeList: ParseModeSelectorElement[],
}

export default Vue.extend({
  name: "unixtime",
  data ():PageData {
    return {
      inputValue:DateTime.now().toFormat("X"),
      timeZoneString:DateTime.now().zoneName,
      parseMode:{
          mode:"auto",
          modeString:"自動"
      },
      parseModeList:[
          {
            mode:"auto",
            modeString:"自動判別"
          },
          {
            mode:"unix",
            modeString:"UnixTime"
          },
          {
            mode:"sql",
            modeString:"SQL"
          },
          {
            mode:"iso",
            modeString:"ISO8601"
          },
          {
            mode:"rfc",
            modeString:"RFC2822"
          }
        ]
    }
  },
  computed: {
    parseResult(): {dateTime:DateTime, resultParseMode: PARSE_MODE} | null {
      switch(this.parseMode.mode){
        case "auto":
          if (/^[0-9]+$/.exec(this.inputValue)){
            const parsedAsUnix = DateTime.fromSeconds(Number(this.inputValue))
            if (parsedAsUnix.isValid){
              return {dateTime: DateTime.fromSeconds(Number(this.inputValue)).setZone(this.timeZoneString), resultParseMode:"unix"};
            }
          } else {
            const parsedAsSQL = DateTime.fromSQL(this.inputValue);
            if (parsedAsSQL.isValid) {
              return {dateTime:parsedAsSQL.setZone(this.timeZoneString), resultParseMode:"sql"}
            }
            const parsedAsISO = DateTime.fromISO(this.inputValue);
            if (parsedAsISO.isValid) {
              return {dateTime:parsedAsISO.setZone(this.timeZoneString), resultParseMode:"iso"};
            }
            const parsedAsRfc = DateTime.fromRFC2822(this.inputValue);
            if (parsedAsRfc.isValid) {
              return {dateTime:parsedAsRfc.setZone(this.timeZoneString), resultParseMode:"rfc"};
            }
          }
          return null;
          //必ずreturnするのでbreak不要
        case "unix":
          const parsedAsUnix = DateTime.fromSeconds(Number(this.inputValue))
          if (parsedAsUnix.isValid){
            return {dateTime:DateTime.fromSeconds(Number(this.inputValue)).setZone(this.timeZoneString), resultParseMode:"unix"};
          }
          return null;
          //必ずreturnするのでbreak不要
        case "sql":
          const parsedAsSQL = DateTime.fromSQL(this.inputValue);
          if (parsedAsSQL.isValid) {
            return {dateTime:parsedAsSQL.setZone(this.timeZoneString), resultParseMode:"sql"}
          }
          return null;
        //必ずreturnするのでbreak不要
        case "iso":
          const parsedAsISO = DateTime.fromISO(this.inputValue);
          if (parsedAsISO.isValid){
            return {dateTime:parsedAsISO.setZone(this.timeZoneString),resultParseMode:"iso"};
          }
          return null;
          //必ずreturnするのでbreak不要
        case "rfc":
          const parsedAsRfc = DateTime.fromRFC2822(this.inputValue);
          if (parsedAsRfc.isValid) {
            return {dateTime:parsedAsRfc.setZone(this.timeZoneString), resultParseMode:"rfc"};
          }
          return null;
          //必ずreturnするのでbreak不要
      }
    },
    resultParseMode(): PARSE_MODE | null {
      if (this.parseResult == null) {
        return null
      } else {
        return this.parseResult.resultParseMode
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
    dateString(): string {
      if (this.luxonDateTime == null){
        return "";
      }
      return this.luxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    utcDateString(): string {
      if (this.utcLuxonDateTime == null){
        return "";
      }
      return this.utcLuxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    isoString():string {
      if (this.luxonDateTime == null){
        return "";
      }
      return this.luxonDateTime.toISO();
    },
    utcIsoString():string {
      if (this.utcLuxonDateTime == null){
        return "";
      }
      return this.utcLuxonDateTime.toISO();
    },
    rfcString():string {
      if (this.luxonDateTime == null){
        return "";
      }
      return this.luxonDateTime.toRFC2822();
    },
    utcRfcString():string {
      if (this.utcLuxonDateTime == null){
        return "";
      }
      return this.utcLuxonDateTime.toRFC2822();
    },
    sqlString():string {
      if (this.luxonDateTime == null){
        return "";
      }
      return this.luxonDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    },
    utcSqlString():string {
      if (this.utcLuxonDateTime == null){
        return "";
      }
      return this.utcLuxonDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    },
    diffString():string {
      if (this.luxonDateTime == null){
        return "";
      }
      let isBeforeNow;
     //1秒未満を切り捨てるためにちょっと回りくどいことをしている
      const nowUnixTime = DateTime.now().toFormat("X");
      if ( this.luxonDateTime.toFormat(("X")) === nowUnixTime) {
        return "0秒";
      }
      const now = DateTime.fromSeconds(Number(nowUnixTime))
      if ( now > this.luxonDateTime ) {
        isBeforeNow = true;
      } else {
        isBeforeNow = false;
      }

      let diff;
      // secondの小数点以下が出ないようにmillisecondsも指定する
      if (isBeforeNow){
        diff = now.diff(this.luxonDateTime,['years','months','days','hours','minutes','seconds','milliseconds']).toObject();
      } else {
        diff = this.luxonDateTime.diff(now,['years','months','days','hours','minutes','seconds','milliseconds']).toObject();
      }

      let result = "";
      if (diff.years){
        result = result + String(diff.years) + '年'
      }
      if (diff.months){
        result = result + String(diff.months) + 'ヶ月'
      }
      if (diff.days){
        result = result + String(diff.days) + '日'
      }
      if (diff.hours){
        result = result + String(diff.hours) + '時間'
      }
      if (diff.minutes){
        result = result + String(diff.minutes) + '分'
      }
      if (diff.seconds){
        result = result + String(diff.seconds) + '秒'
      }

      if (isBeforeNow){
        result += "前"
      } else {
        result += "後"
      }

      return result
    }
  }
})
</script>

<style scoped>

</style>
