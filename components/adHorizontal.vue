<template>
  <div class="text-center py-16">
    <!-- 横幅md以上(960px～)のみ表示 -->
    <div class="d-none d-md-inline">
      <a :href="horizontalAd.href_728x90" rel="nofollow">
        <img border="0" width="728" height="90" alt="" :src="horizontalAd.image1_728x90"></a>
      <img border="0" width="1" height="1" :src="horizontalAd.image2_728x90" alt="">
    </div>
    <!-- 横幅sm(600px～960px)のみ表示 -->
    <div class="d-none d-sm-inline d-md-none">
      <a :href="horizontalAd.href_468x60" rel="nofollow">
        <img border="0" width="468" height="60" alt="" :src="horizontalAd.image1_468x60"></a>
      <img border="0" width="1" height="1" :src="horizontalAd.image2_468x60" alt="">
    </div>
    <!-- 横幅xs(～600px)のみ表示 -->
    <div class="d-inline d-sm-none">
      <a :href="horizontalAd.href_234x60" rel="nofollow">
        <img border="0" width="234" height="60" alt="" :src="horizontalAd.image1_234x60"></a>
      <img border="0" width="1" height="1" :src="horizontalAd.image2_234x60" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface HorizontalAd {
  href_728x90: string
  image1_728x90: string
  image2_728x90: string
  href_468x60: string
  image1_468x60: string
  image2_468x60: string
  href_234x60: string
  image1_234x60: string
  image2_234x60: string
}

const horizontalAds: HorizontalAd[] = [
  {
    // フリーランスエンジニア向け案件紹介サービス【IT求人ナビ フリーランス】(20-1012)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+E1H1DE+4LXM+61JSH",
    image1_728x90: "https://www21.a8.net/svt/bgt?aid=221025152849&wid=001&eno=01&mid=s00000021505001015000&mc=1",
    image2_728x90: "https://www14.a8.net/0.gif?a8mat=3NLC3K+E1H1DE+4LXM+61JSH",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+E1H1DE+4LXM+614CX",
    image1_468x60: "https://www23.a8.net/svt/bgt?aid=221025152849&wid=001&eno=01&mid=s00000021505001013000&mc=1",
    image2_468x60: "https://www19.a8.net/0.gif?a8mat=3NLC3K+E1H1DE+4LXM+614CX",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+E1H1DE+4LXM+669JL",
    image1_234x60: "https://www25.a8.net/svt/bgt?aid=221025152849&wid=001&eno=01&mid=s00000021505001037000&mc=1",
    image2_234x60: "https://www17.a8.net/0.gif?a8mat=3NLC3K+E1H1DE+4LXM+669JL",
  },
  {
    // 自宅で現役エンジニアから学べる TechAcademy [テックアカデミー](16-0224)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+CM9RCI+3GWO+6DRLT",
    image1_728x90: "https://www28.a8.net/svt/bgt?aid=221025152763&wid=001&eno=01&mid=s00000016188001072000&mc=1",
    image2_728x90: "https://www18.a8.net/0.gif?a8mat=3NLC3K+CM9RCI+3GWO+6DRLT",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+CM9RCI+3GWO+6SCAP",
    image1_468x60: "https://www23.a8.net/svt/bgt?aid=221025152763&wid=001&eno=01&mid=s00000016188001140000&mc=1",
    image2_468x60: "https://www14.a8.net/0.gif?a8mat=3NLC3K+CM9RCI+3GWO+6SCAP",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+CM9RCI+3GWO+6F9M9",
    image1_234x60: "https://www25.a8.net/svt/bgt?aid=221025152763&wid=001&eno=01&mid=s00000016188001079000&mc=1",
    image2_234x60: "https://www16.a8.net/0.gif?a8mat=3NLC3K+CM9RCI+3GWO+6F9M9"
  },
  {
    // エンジニアのための転職エージェントサービス「Tech Stars Agent」(19-0219)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+CFPZOY+3TVC+TUVZL",
    image1_728x90: "https://www26.a8.net/svt/bgt?aid=221025152752&wid=001&eno=01&mid=s00000017868005015000&mc=1",
    image2_728x90: "https://www17.a8.net/0.gif?a8mat=3NLC3K+CFPZOY+3TVC+TUVZL",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+CFPZOY+3TVC+TUO9T",
    image1_468x60: "https://www26.a8.net/svt/bgt?aid=221025152752&wid=001&eno=01&mid=s00000017868005014000&mc=1",
    image2_468x60: "https://www16.a8.net/0.gif?a8mat=3NLC3K+CFPZOY+3TVC+TUO9T",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+CFPZOY+3TVC+TSYJL",
    image1_234x60: "https://www25.a8.net/svt/bgt?aid=221025152752&wid=001&eno=01&mid=s00000017868005006000&mc=1",
    image2_234x60: "https://www10.a8.net/0.gif?a8mat=3NLC3K+CFPZOY+3TVC+TSYJL"
  },
  {
    // WordPress専用の超高速クラウド型レンタルサーバー【wpX Speed】（13-0312）
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+A4YQLU+CO4+103AOX",
    image1_728x90: "https://www28.a8.net/svt/bgt?aid=221025152613&wid=001&eno=01&mid=s00000001642006062000&mc=1",
    image2_728x90: "https://www17.a8.net/0.gif?a8mat=3NLC3K+A4YQLU+CO4+103AOX",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+A4YQLU+CO4+1032Z5",
    image1_468x60: "https://www26.a8.net/svt/bgt?aid=221025152613&wid=001&eno=01&mid=s00000001642006061000&mc=1",
    image2_468x60: "https://www13.a8.net/0.gif?a8mat=3NLC3K+A4YQLU+CO4+1032Z5",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+A4YQLU+CO4+ZTV6P",
    image1_234x60: "https://www27.a8.net/svt/bgt?aid=221025152613&wid=001&eno=01&mid=s00000001642006018000&mc=1",
    image2_234x60: "https://www14.a8.net/0.gif?a8mat=3NLC3K+A4YQLU+CO4+ZTV6P"
  },
  {
    // 「ムームードメイン」独自ドメイン(06-0922)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+9FD3LE+348+1C71F5",
    image1_728x90: "https://www29.a8.net/svt/bgt?aid=221025152570&wid=001&eno=01&mid=s00000000404008095000&mc=1",
    image2_728x90: "https://www15.a8.net/0.gif?a8mat=3NLC3K+9FD3LE+348+1C71F5",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+9FD3LE+348+1BUE69",
    image1_468x60: "https://www21.a8.net/svt/bgt?aid=221025152570&wid=001&eno=01&mid=s00000000404008036000&mc=1",
    image2_468x60: "https://www18.a8.net/0.gif?a8mat=3NLC3K+9FD3LE+348+1BUE69",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+9FD3LE+348+1C6LZL",
    image1_234x60: "https://www23.a8.net/svt/bgt?aid=221025152570&wid=001&eno=01&mid=s00000000404008093000&mc=1",
    image2_234x60: "https://www12.a8.net/0.gif?a8mat=3NLC3K+9FD3LE+348+1C6LZL"
  },
  {
    // 「ロリポップ！」レンタルサーバー(02-0531)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+84BUSY+348+6OHEP",
    image1_728x90: "https://www22.a8.net/svt/bgt?aid=221025152491&wid=001&eno=01&mid=s00000000404001122000&mc=1",
    image2_728x90: "https://www10.a8.net/0.gif?a8mat=3NLC3K+84BUSY+348+6OHEP",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+84BUSY+348+6AC5D",
    image1_468x60: "https://www26.a8.net/svt/bgt?aid=221025152491&wid=001&eno=01&mid=s00000000404001056000&mc=1",
    image2_468x60: "https://www12.a8.net/0.gif?a8mat=3NLC3K+84BUSY+348+6AC5D",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+84BUSY+348+6ARKX",
    image1_234x60: "https://www27.a8.net/svt/bgt?aid=221025152491&wid=001&eno=01&mid=s00000000404001058000&mc=1",
    image2_234x60: "https://www11.a8.net/0.gif?a8mat=3NLC3K+84BUSY+348+6ARKX"
  },
  {
    // 国内最安値！取得も更新も！ドメイン名取得サービス【Xserverドメイン】（13-0910）
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+7IATF6+CO4+15TP8X",
    image1_728x90: "https://www23.a8.net/svt/bgt?aid=221025152454&wid=001&eno=01&mid=s00000001642007025000&mc=1",
    image2_728x90: "https://www17.a8.net/0.gif?a8mat=3NLC3K+7IATF6+CO4+15TP8X",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+7IATF6+CO4+15THJ5",
    image1_468x60: "https://www21.a8.net/svt/bgt?aid=221025152454&wid=001&eno=01&mid=s00000001642007024000&mc=1",
    image2_468x60: "https://www16.a8.net/0.gif?a8mat=3NLC3K+7IATF6+CO4+15THJ5",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+7IATF6+CO4+15RRSX",
    image1_234x60: "https://www22.a8.net/svt/bgt?aid=221025152454&wid=001&eno=01&mid=s00000001642007016000&mc=1",
    image2_234x60: "https://www14.a8.net/0.gif?a8mat=3NLC3K+7IATF6+CO4+15RRSX"
  },
  {
    // 国内シェアNo.1レンタルサーバー『エックスサーバー』(04-1228)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+6AU69E+CO4+6BU5T",
    image1_728x90: "https://www26.a8.net/svt/bgt?aid=221025152381&wid=001&eno=01&mid=s00000001642001063000&mc=1",
    image2_728x90: "https://www10.a8.net/0.gif?a8mat=3NLC3K+6AU69E+CO4+6BU5T",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+6AU69E+CO4+63H8H",
    image1_468x60: "https://www28.a8.net/svt/bgt?aid=221025152381&wid=001&eno=01&mid=s00000001642001024000&mc=1",
    image2_468x60: "https://www11.a8.net/0.gif?a8mat=3NLC3K+6AU69E+CO4+63H8H",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NLC3K+6AU69E+CO4+691UP",
    image1_234x60: "https://www29.a8.net/svt/bgt?aid=221025152381&wid=001&eno=01&mid=s00000001642001050000&mc=1",
    image2_234x60: "https://www17.a8.net/0.gif?a8mat=3NLC3K+6AU69E+CO4+691UP"
  },
  {
    // mixhost（ミックスホスト）月額990円から使える国内No1レンタルサーバー(16-0616)
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NL1XD+CKHGJ6+3JTE+62U35",
    image1_728x90: "https://www26.a8.net/svt/bgt?aid=221011969760&wid=001&eno=01&mid=s00000016565001021000&mc=1",
    image2_728x90: "https://www14.a8.net/0.gif?a8mat=3NL1XD+CKHGJ6+3JTE+62U35",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NL1XD+CKHGJ6+3JTE+60H7L",
    image1_468x60: "https://www21.a8.net/svt/bgt?aid=221011969760&wid=001&eno=01&mid=s00000016565001010000&mc=1",
    image2_468x60: "https://www11.a8.net/0.gif?a8mat=3NL1XD+CKHGJ6+3JTE+60H7L",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NL1XD+CKHGJ6+3JTE+5ZMCH",
    image1_234x60: "https://www27.a8.net/svt/bgt?aid=221011969760&wid=001&eno=01&mid=s00000016565001006000&mc=1",
    image2_234x60: "https://www18.a8.net/0.gif?a8mat=3NL1XD+CKHGJ6+3JTE+5ZMCH"
  },
  {
    //  独自ドメインの取得なら１円〜の【お名前.com】（07-0829）
    href_728x90: "https://px.a8.net/svt/ejp?a8mat=3NL1XD+CM9RCI+50+2HN8K1",
    image1_728x90: "https://www29.a8.net/svt/bgt?aid=221011969763&wid=001&eno=01&mid=s00000000018015057000&mc=1",
    image2_728x90: "https://www17.a8.net/0.gif?a8mat=3NL1XD+CM9RCI+50+2HN8K1",
    href_468x60: "https://px.a8.net/svt/ejp?a8mat=3NL1XD+CM9RCI+50+2HQGAP",
    image1_468x60: "https://www21.a8.net/svt/bgt?aid=221011969763&wid=001&eno=01&mid=s00000000018015072000&mc=1",
    image2_468x60: "https://www14.a8.net/0.gif?a8mat=3NL1XD+CM9RCI+50+2HQGAP",
    href_234x60: "https://px.a8.net/svt/ejp?a8mat=3NL1XD+CM9RCI+50+2HBVLT",
    image1_234x60: "https://www23.a8.net/svt/bgt?aid=221011969763&wid=001&eno=01&mid=s00000000018015004000&mc=1",
    image2_234x60: "https://www15.a8.net/0.gif?a8mat=3NL1XD+CM9RCI+50+2HBVLT"
  }
]

interface ComponentData {
  horizontalAd: HorizontalAd
}

export default Vue.extend({
  name: "adHorizontal",
  data(): ComponentData {
    return {
      horizontalAd: horizontalAds[Math.floor(Math.random() * horizontalAds.length)]
    }
  },
  watch: {
    $route() {
      this.horizontalAd = horizontalAds[Math.floor(Math.random() * horizontalAds.length)]
    },
  },
})
</script>

<style scoped>

</style>
