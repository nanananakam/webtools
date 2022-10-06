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
        <tbody>
          <tr>
            <td>日付表記(環境依存)</td>
            <td>{{dateString}}</td>
          </tr>
          <tr>
            <td>ISO 8601</td>
            <td>{{isoString}}</td>
          </tr>
          <tr>
            <td>RFC 2822</td>
            <td>{{rfcString}}</td>
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
      return DateTime.fromSeconds(Number(this.form.input))
    },
    dateString() {
      return this.luxonDateTime.toLocaleString(DateTime.DATETIME_FULL);
    },
    isoString() {
      return this.luxonDateTime.toISO();
    },
    rfcString() {
      return this.luxonDateTime.toRFC2822();
    }
  }
}
</script>

<style scoped>

</style>
