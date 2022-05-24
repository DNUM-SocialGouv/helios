import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'
import { RécupèreLÉtablissementTerritorialUseCase } from './RécupèreLÉtablissementTerritorialUseCase'

describe('La récupération d’un établissement territorial', () => {
  it('récupère la fiche identité de l’établissement territorial', async () => {
    // GIVEN
    const numéroFinessET = '123456789'
    const ficheIdentitéÉtablissementTerritorial: ÉtablissementTerritorialIdentité = {
      adresseAcheminement: '01130 NANTUA',
      adresseNuméroVoie: '50',
      adresseTypeVoie: 'R',
      adresseVoie: 'PAUL PAINLEVE',
      catégorieÉtablissement: '355',
      courriel: 'a@example.com',
      dateMiseAJourSource: '20220203',
      numéroFinessEntitéJuridique: '010018407',
      numéroFinessÉtablissementPrincipal: '010000057',
      numéroFinessÉtablissementTerritorial: numéroFinessET,
      raisonSociale: 'CH NANTUA',
      typeÉtablissement: 'S',
      téléphone: '0102030405',
    }
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return ficheIdentitéÉtablissementTerritorial
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialLoader = { chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialUseCase(établissementTerritorialLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessET)

    // THEN
    expect(ficheIdentitéRécupérée).toStrictEqual(ficheIdentitéÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessET)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
  })

  it('lève une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const numéroFiness = '123456789'
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return new ÉtablissementTerritorialNonTrouvée('123456789')
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialLoader = { chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialUseCase(établissementTerritorialLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFiness)
      throw new Error('Une alerte d’établissement territorial non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’établissement territorial 123456789 n’a pas été trouvé')
    }
  })
})
