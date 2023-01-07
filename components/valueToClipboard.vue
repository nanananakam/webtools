<template>
  <div>
    <span v-if="showText">{{ text }}</span>
    <v-btn v-if="copied" icon disabled><v-icon small>{{ mdiCheck }}</v-icon></v-btn>
    <v-btn v-else v-on:click="copyText" icon><v-icon small>{{ mdiContentCopy }}</v-icon></v-btn>
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
    },
    showText: {
      type: Boolean,
      default: true
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
