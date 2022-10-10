<template>
<div>
  {{text}}
  <span v-if="copied"><v-icon small>mdi-check</v-icon></span>
  <span v-else v-on:click="copyText"><v-icon small>mdi-content-copy</v-icon></span>
</div>
</template>

<script lang="ts">
import Vue from "vue";
interface ComponentData {
  copied: boolean
}

export default Vue.extend({
  name: "valueToClipboard",
  data(): ComponentData {
    return {
      copied: false
    }
  },
  props: {
    text:{
      type:String
    }
  },
  methods: {
    copyText: function() {
      navigator.clipboard.writeText(this.text);
      this.copied = true;
      const self = this;
      setTimeout(function(){
        self.copied = false;
      },2000);
    }
  }
})
</script>

<style scoped>

</style>
