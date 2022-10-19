<template>
  <div>
      <ul>
        <li><a href="/unixtime/">UnixTime便利ツール</a></li>
        <li><a href="/whois/">IP情報確認ツール</a></li>
        <li><a href="/length/">文字数カウントツール</a></li>
        <li><a href="/hash/">文字列ハッシュ化ツール</a></li>
        <li><a href="/about/">このサイトについて・プライバシーポリシー・免責事項</a></li>
      </ul>
  </div>
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
