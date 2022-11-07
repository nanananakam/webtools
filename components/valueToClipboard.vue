<template>
  <div>
    {{ text }}
    <span v-if="copied"><v-icon small>{{ mdiCheck }}</v-icon></span>
    <span v-else v-on:click="copyText"><v-icon small>{{ mdiContentCopy }}</v-icon></span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {mdiCheck, mdiContentCopy} from "@mdi/js";

interface ComponentData {
  copied: boolean,
  mdiCheck: string,
  mdiContentCopy: string,
}

export default Vue.extend({
  name: "valueToClipboard",
  data(): ComponentData {
    return {
      copied: false,
      mdiCheck: mdiCheck,
      mdiContentCopy: mdiContentCopy,
    }
  },
  props: {
    text: {
      type: String
    }
  },
  methods: {
    copyText: function () {
      navigator.clipboard.writeText(this.text);
      this.copied = true;
      const self = this;
      setTimeout(function () {
        self.copied = false;
      }, 2000);
    }
  }
})
</script>

<style scoped>

</style>
