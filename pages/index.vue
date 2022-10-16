<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col xs="12" sm="12" md="12" lg="9" xl="6">
      <ul>
        <li><a href="/unixtime/">UnixTime便利ツール</a></li>
        <li><a href="/whois/">IP情報確認ツール</a></li>
        <li><a href="/about/">このサイトについて・プライバシーポリシー・免責事項</a></li>
      </ul>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: 'IndexPage',
  head: {
    title: "top"
  }
})
</script>
