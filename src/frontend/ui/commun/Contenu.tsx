import { ReactNode } from 'react'

import { FilDArianne } from './FilDArianne'

export const Contenu = ({ children }: { children: ReactNode }) => {
  return (
    <main className="fr-container">
      <section
        className="fr-grid-row"
        data-module="fil-ariane"
      >
        <div className="fr-col">
          <FilDArianne />
        </div>
      </section>
      {children}
    </main>
  )
}
