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
      <div>{{toDateString}}</div>
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
    toDateString() {
      return DateTime.fromSeconds(Number(this.form.input)).toLocaleString(DateTime.DATETIME_FULL);
    }
  }
}
</script>

<style scoped>

</style>
