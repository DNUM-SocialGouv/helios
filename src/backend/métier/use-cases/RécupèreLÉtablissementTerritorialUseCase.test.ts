import { ÉtablissementTerritorialTestFactory } from '../../test/ÉtablissementTerritorialTestFactory'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from '../entities/ÉtablissementTerritorialMédicoSocial/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialMédicoSocialIdentité } from '../entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'
import { RécupèreLÉtablissementTerritorialUseCase } from './RécupèreLÉtablissementTerritorialUseCase'

describe('La récupération d’un établissement territorial', () => {
  it('récupère la fiche identité de l’établissement territorial', async () => {
    // GIVEN
    const numéroFinessET = '123456789'
    const ficheIdentitéÉtablissementTerritorial: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial(
      { numéroFinessÉtablissementTerritorial: numéroFinessET }
    )
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return ficheIdentitéÉtablissementTerritorial
    })
    const mockedCompteLesÉtablissementsDUneMêmeEntité = jest.fn(async () => {
      return 1
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness, estUnMonoÉtablissement: mockedCompteLesÉtablissementsDUneMêmeEntité }
    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialUseCase(établissementTerritorialLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessET)

    // THEN
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      statutJuridique : '',
      raisonSociale : 'Centre Hospitalier',
    }
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocialIdentité = {
      ...ficheIdentitéÉtablissementTerritorial,
      entitéJuridiqueDeRattachement,
      estMonoÉtablissement: true,
    }

    expect(ficheIdentitéRécupérée).toStrictEqual(ficheIdentitéÉtablissementTerritorialMédicoSocial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessET)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
  })

  it('lève une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const numéroFiness = '123456789'
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return new ÉtablissementTerritorialNonTrouvée('123456789')
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness, estUnMonoÉtablissement: jest.fn() }
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
