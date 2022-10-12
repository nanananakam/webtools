<template>
  <div ref="ads" class="ad"></div>
</template>

<script>
export default {
  async mounted() {
    const iframePc = document.createElement('iframe');
    iframePc.setAttribute("width",800);
    iframePc.setAttribute("height",100);
    iframePc.setAttribute("class","d-none d-md-inline");
    iframePc.setAttribute("frameborder","no");
    iframePc.setAttribute("scrolling","no");
    this.$refs.ads.appendChild(iframePc);
    const iframePcDocument = iframePc.contentWindow.document;
    iframePcDocument.open();
    iframePcDocument.write('<script src="https://adm.shinobi.jp/s/8e3a80fb201e787e93fd822010d54864"><\/script>');
    iframePcDocument.close();
    const iframeSp = document.createElement('iframe');
    iframeSp.setAttribute("width",350);
    iframeSp.setAttribute("height",150);
    iframeSp.setAttribute("class","d-inline d-sm-none");
    iframeSp.setAttribute("frameborder","no");
    iframeSp.setAttribute("scrolling","no");
    this.$refs.ads.appendChild(iframeSp);
    const iframeSpDocument = iframeSp.contentWindow.document;
    iframeSpDocument.open();
    iframeSpDocument.write('<script src="https://adm.shinobi.jp/s/46f1626a9e53827a5bfec9f6b40b5337"><\/script>');
    iframeSpDocument.close();
  }
}
</script>
