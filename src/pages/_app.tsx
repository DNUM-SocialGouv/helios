import { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '@gouvfr/dsfr/dist/core/core.min.css'

import { frontDependencies } from '../frontend/configuration/frontDependencies'
import { DependenciesProvider } from '../frontend/ui/commun/contexts/useDependencies'
import { Footer } from '../frontend/ui/commun/Footer/Footer'
import { Header } from '../frontend/ui/commun/Header/Header'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DependenciesProvider dependencies={frontDependencies}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
      </Head>
      <Header />
      <main className="fr-container">
        <Component {...pageProps} />
      </main>
      <Footer />

      <Script
        src="/api/design-system-francais/dsfr"
        strategy="lazyOnload"
      />
    </DependenciesProvider>
  )
}
