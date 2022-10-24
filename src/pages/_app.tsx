import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'

import '@gouvfr/dsfr/dist/core/core.min.css'
import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import '../frontend/ui/commun/global.css'

import { DependenciesProvider } from '../frontend/ui/commun/contexts/useDependencies'
import { Footer } from '../frontend/ui/commun/Footer/Footer'
import { Header } from '../frontend/ui/commun/Header/Header'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      // @ts-ignore
      const atPiano = new ATInternet.Tracker.Tag({
        cookieSecure: true,
        sameSiteStrict: true,
        secure: true,
        site: process.env['NEXT_PUBLIC_AT_PIANO_SITE_ID'],
      })

      if (router.pathname.includes('[numéroFiness]')) {
        atPiano.page.send({ name: router.pathname })
      } else {
        atPiano.page.send({ name: router.asPath })
      }
    }
  })

  return (
    <DependenciesProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Script
        src="/dsfr-1.4.1.module.min.js"
        strategy="lazyOnload"
      />
      {process.env.NODE_ENV !== 'development' &&
        <Script
          src="/smarttag.js"
          strategy="beforeInteractive"
        />
      }
    </DependenciesProvider>
  )
}
