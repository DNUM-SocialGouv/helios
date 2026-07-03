import Document, { Head, Html, Main, NextScript } from "next/document";
import { ReactElement } from "react";


export default class MyDocument extends Document {
  override render(): ReactElement {
    return (
      <Html data-fr-scheme="system" lang="fr">
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
