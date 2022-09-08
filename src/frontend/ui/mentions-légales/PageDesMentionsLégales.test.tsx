import { screen } from '@testing-library/react'

import { fakeFrontDependencies, renderFakeComponent } from '../../testHelper'
import { PageDesMentionsLégales } from './PageDesMentionsLégales'

const { wording } = fakeFrontDependencies

describe('La page des mentions légales', () => {
  it('affiche les informations liées aux mentions légales', () => {
    // WHEN
    renderFakeComponent(<PageDesMentionsLégales />)

    // THEN
    expect(screen.getAllByRole('region', { name: wording.ÉDITEUR_DU_SITE })).toBeInTheDocument()
    expect(screen.getAllByRole('region', { name: wording.PROPRIÉTÉ_INTELLECTUELLE })).toBeInTheDocument()
    expect(screen.getAllByRole('region', { name: wording.LIMITES_DE_RESPONSABILITÉ })).toBeInTheDocument()
  })
})
