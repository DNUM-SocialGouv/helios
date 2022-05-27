import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocial } from './ÉtablissementTerritorialMédicoSocial'

describe('L’Établissement territorial médico-social', () => {
  it('contient l’indicateur de mono-établissement à false si l’entité juridique a plusieurs établissements affiliés', () => {
    // GIVEN
    const établissementTerritorial: ÉtablissementTerritorialIdentité = {
      adresseAcheminement: '01130 NANTUA',
      adresseNuméroVoie: '50',
      adresseTypeVoie: 'R',
      adresseVoie: 'PAUL PAINLEVE',
      catégorieÉtablissement: '355',
      courriel: 'a@example.com',
      dateMiseAJourSource: '2022-05-14',
      libelléCatégorieÉtablissement: 'Centre hospitalier (C.H.)',
      numéroFinessEntitéJuridique: '012345678',
      numéroFinessÉtablissementPrincipal: '010018407',
      numéroFinessÉtablissementTerritorial: '123456789',
      raisonSociale: 'CH NANTUA',
      typeÉtablissement: 'S',
      téléphone: '0102030405',
    }
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
    const établissementTerritorial: ÉtablissementTerritorialIdentité = {
      adresseAcheminement: '01130 NANTUA',
      adresseNuméroVoie: '50',
      adresseTypeVoie: 'R',
      adresseVoie: 'PAUL PAINLEVE',
      catégorieÉtablissement: '355',
      courriel: 'a@example.com',
      dateMiseAJourSource: '2022-05-14',
      libelléCatégorieÉtablissement: 'Centre hospitalier (C.H.)',
      numéroFinessEntitéJuridique: '012345678',
      numéroFinessÉtablissementPrincipal: '010018407',
      numéroFinessÉtablissementTerritorial: '123456789',
      raisonSociale: 'CH NANTUA',
      typeÉtablissement: 'S',
      téléphone: '0102030405',
    }
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
