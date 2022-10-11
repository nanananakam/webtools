<template>
  <div ref="ads" class="ad"></div>
</template>

<script>
export default {
  async mounted() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute("width",180);
    iframe.setAttribute("height",650);
    iframe.setAttribute("frameborder","no");
    iframe.setAttribute("scrolling","no");
    const head = document.getElementsByTagName('head')[0];
    this.$refs.ads.appendChild(iframe);
    const html = '<script src="https://adm.shinobi.jp/s/69708dc786bb2437d5d72df646216846"><\/script>';
    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(html);
    iframeDocument.close();
  }
}
</script>
