<template>
  <v-row>
    <v-col class="text-center">
      <v-form ref="form">
        <v-text-field
          v-model="form.input"
          :rules="[rules.required]"
        >
        </v-text-field>
      </v-form>
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
            <td>日時表記(環境依存)</td>
            <td>{{dateString}}</td>
            <td>{{utcDateString}}</td>
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
            <td>ハイフン区切り</td>
            <td>{{hyphenSeparated}}</td>
            <td>{{utcHyphenSeparated}}</td>
          </tr>
        <tr>
          <td>現在時刻との差</td>
          <td colspan="2">{{diffString}}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import {DateTime} from 'luxon';

export default {
  name: "unixtime",
  mounted() {
    // バリデーションをリセット
    this.$refs.form.resetValidation()
  },
  data () {
    return {
      form: {
        input:DateTime.now().toFormat("X"),
      },
      valid: true,
      rules: {
        required: value => !!value || '入力してください',
      },
    }
  },
  computed: {
    luxonDateTime() {
      return DateTime.fromSeconds(Number(this.form.input));
    },
    utcLuxonDateTime() {
      return this.luxonDateTime.setZone('UTC')
    },
    timeZoneString() {
      return this.luxonDateTime.zoneName;
    },
    dateString() {
      return this.luxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    utcDateString() {
      return this.utcLuxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    isoString() {
      return this.luxonDateTime.toISO();
    },
    utcIsoString() {
      return this.utcLuxonDateTime.toISO();
    },
    rfcString() {
      return this.luxonDateTime.toRFC2822();
    },
    utcRfcString() {
      return this.utcLuxonDateTime.toRFC2822();
    },
    hyphenSeparated() {
      return this.luxonDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    },
    utcHyphenSeparated() {
      return this.utcLuxonDateTime.toFormat('yyyy-MM-dd HH:mm:ss')
    },
    diffString() {
      let isBeforeNow;
     //1秒未満を切り捨てるためにちょっと回りくどいことをしている
      const now = DateTime.fromSeconds(Number(DateTime.now().toFormat("X")));
      console.log(now);
      console.log(this.luxonDateTime);
      if ( this.luxonDateTime.equals(now)) {
        return "0秒";
      }
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
}
</script>

<style scoped>

</style>
