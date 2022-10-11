<template>
  <div ref="ads" class="ad"></div>
</template>

<script>
export default {
  async mounted() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute("width",800);
    iframe.setAttribute("height",100);
    iframe.setAttribute("frameborder","no");
    iframe.setAttribute("scrolling","no");
    const head = document.getElementsByTagName('head')[0];
    this.$refs.ads.appendChild(iframe);
    const html = '<script src="https://adm.shinobi.jp/o/87077c69d778679740763a312bfc3e58"><\/script>';
    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(html);
    iframeDocument.close();
  }
}
</script>
