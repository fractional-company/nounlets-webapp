import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { CHAIN_ID, NEXT_PUBLIC_CACHE_VERSION, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {CHAIN_ID === 1 && (
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-T3PEPVT1PH"
              strategy="afterInteractive"
            />
          )}
          {CHAIN_ID === 1 && (
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-T3PEPVT1PH');
                `}
            </Script>
          )}
        </Head>
        <body className="bg-gray-1 font-ptRootUI">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
