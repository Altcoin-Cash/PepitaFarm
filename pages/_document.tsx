import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/assets/fonts/Oswald-Regular.ttf"
            as="font"
            type="font/truetype"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/assets/fonts/tempest/Oswald-Regular-webfont.woff"
            as="font"
            type="font/woff"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/assets/fonts/tempest/Oswald-Regular-webfont.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/assets/fonts/Oswald-Regular.ttf"
            as="font"
            type="font/truetype"
            crossOrigin=""
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
