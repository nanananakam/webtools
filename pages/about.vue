<template>
  <div>
    <h1>このサイトについて</h1>
    <h2>作者について</h2>
    <div>Github: nanananakam(<a href="https://github.com/nanananakam">https://github.com/nanananakam</a>)</div>
    <div>本業はサーバーサイドエンジニアをやってます。</div>
    <h2>プライバシーポリシー</h2>
    <h3>個人情報の利用について</h3>
    <div>
      当サイトでは、アクセス元IPアドレス、ブラウザから送信されたヘッダー情報、フォームに入力された情報を含むアクセスログを記録している場合がございます。これらの情報は法に定める場合を除き、サイトの改善の目的のみに利用いたします。
    </div>
    <h3>広告について</h3>
    <div>
      当サイトでは、第三者配信の広告サービス（Googleアドセンス）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。
    </div>
    <div>クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。</div>
    <div>Cookieを無効にする方法やオプトアウトなどGoogleアドセンスに関する詳細は「<a href="https://policies.google.com/technologies/ads?gl=jp">広告
      – ポリシーと規約 – Google</a>」をご確認ください。
    </div>
    <h3>アクセス解析ツールについて</h3>
    <div>
      当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
    </div>
    <div>また当サイトではCloudflareによるアクセス解析ツール「Cloudflare Web Analytics」を合わせて利用していますが、Cloudflare Web
      Analyticsはプライバシーを重視した解析ツールとなっておりCookie等の収集は行っておりません。詳細は「<a
        href="https://www.cloudflare.com/ja-jp/web-analytics/">Cloudflare Web Analytics</a>」をご確認ください。
    </div>
    <h2>免責事項</h2>
    <div>当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。</div>
    <div>また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。</div>
    <div>当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</div>
  </div>
</template>

<script>
export default {
  name: "about",
  head: {
    title: "このサイトについて",
    meta: [
      {name: 'description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。'},
      {property: 'og:site_name', content: 'nanananakam webtools'},
      {property: 'og:type', content: 'website'},
      {property: 'og:title', content: 'nanananakam webtools'},
      {property: 'og:description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。'},
      {property: 'og:url', content: 'https://www.nanananakam.com/'}, //このページに直接飛んでくるのはあまり望まないのでトップに飛ばす
      //{ property: 'og:image', content: '{アイキャッチ画像の絶対URL}' },
      {name: 'twitter:card', content: 'summary'},
      //{ name: 'twitter:site', content: '@{Twitterユーザー名}' }
      //{ name: 'twitter:creator', content: '@{Twitterユーザー名}' }
    ]
  }
}
</script>

<style scoped>

</style>
