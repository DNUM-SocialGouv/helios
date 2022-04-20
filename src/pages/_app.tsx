import type { AppProps } from 'next/app'
import '@gouvfr/dsfr/dist/core/core.min.css'
import Head from 'next/head'

import '../frontend/ui/styles/global.css'
import { Contenu } from '../frontend/ui/commun/Contenu'
import { Footer } from '../frontend/ui/commun/Footer'
import { Header } from '../frontend/ui/commun/Header'
import { DependenciesProvider } from '../frontend/ui/contexts/useDependencies'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1"
          name="viewport"
        />
      </Head>
      <DependenciesProvider>
        <Header />
        <Contenu>
          <Component {...pageProps} />
        </Contenu>
        <Footer />
      </DependenciesProvider>
    </>
  )
}
