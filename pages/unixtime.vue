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
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "unixtime",
  mounted() {
    // バリデーションをリセット
    this.$refs.form.resetValidation()
  },
  data () {
    return {
      form: {
        input:this.$moment().unix(),
      },
      valid: true,
      rules: {
        required: value => !!value || '入力してください',
      },
    }
  },
}
</script>

<style scoped>

</style>
