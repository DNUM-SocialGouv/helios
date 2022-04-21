import type { AppProps } from 'next/app'
import '@gouvfr/dsfr/dist/core/core.min.css'

import { frontDependencies } from '../frontend/configuration/frontDependencies'
import { DependenciesProvider } from '../frontend/ui/commun/contexts/useDependencies'
import { Footer } from '../frontend/ui/commun/Footer/Footer'
import { Header } from '../frontend/ui/commun/Header/Header'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DependenciesProvider dependencies={frontDependencies()}>
      <Header />
      <main className="fr-container">
        <Component {...pageProps} />
      </main>
      <Footer />
    </DependenciesProvider>
  )
}
