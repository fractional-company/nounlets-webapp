import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body className="bg-gray-1 font-ptRootUI">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
