import { ÉtablissementTerritorialTestFactory } from '../../../test/ÉtablissementTerritorialTestFactory'
import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocial } from './ÉtablissementTerritorialMédicoSocial'

describe('L’Établissement territorial médico-social', () => {
  const établissementTerritorial: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial({ typeÉtablissement: 'S' })

  it('contient l’indicateur de mono-établissement à false si l’entité juridique a plusieurs établissements affiliés', () => {
    // GIVEN
    const nombreDÉtablissementsTerritoriauxDansEntitéJuridique = 3

    const établissementTerritorialMédicoSocial =
      new ÉtablissementTerritorialMédicoSocial(établissementTerritorial, nombreDÉtablissementsTerritoriauxDansEntitéJuridique)

    // WHEN
    const établissementTerritorialMédicoSocialSérialisé = établissementTerritorialMédicoSocial.serialize()

    // THEN
    expect(établissementTerritorialMédicoSocialSérialisé).toStrictEqual({
      ...établissementTerritorial,
      estMonoÉtablissement: false,
    })
  })

  it('contient l’indicateur de mono-établissement à true si l’entité juridique a un seul établissement affilié', () => {
    // GIVEN
    const nombreDÉtablissementsTerritoriauxDansEntitéJuridique = 1

    const établissementTerritorialMédicoSocial =
    new ÉtablissementTerritorialMédicoSocial(établissementTerritorial, nombreDÉtablissementsTerritoriauxDansEntitéJuridique)

    // WHEN
    const établissementTerritorialMédicoSocialSérialisé = établissementTerritorialMédicoSocial.serialize()

    // THEN
    expect(établissementTerritorialMédicoSocialSérialisé).toStrictEqual({
      ...établissementTerritorial,
      estMonoÉtablissement: true,
    })
  })
})
