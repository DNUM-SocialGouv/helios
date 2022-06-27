import { ÉtablissementTerritorialMédicoSocialActivitéTestFactory } from '../../test-factories/ÉtablissementTerritorialMédicoSocialActivitéTestFactory'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivitéNonTrouvé'
import { ÉtablissementTerritorialMédicoSocialActivitéLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialActivitéLoader'
import { RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase } from './RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase'

describe('Récupération de l’activité d’un établissement territorial médico-social', () => {
  it('récupère les activités de l’établissement territorial médico-social', async () => {
    // GIVEN
    const numéroFinessÉtablissementTerritorial = '123456789'
    const activités = [
      ÉtablissementTerritorialMédicoSocialActivitéTestFactory.créeÉtablissementTerritorialMédicoSocialActivité(
        { année: 2019, numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial }
      ),
      ÉtablissementTerritorialMédicoSocialActivitéTestFactory.créeÉtablissementTerritorialMédicoSocialActivité(
        { année: 2020, numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial }
      ),
      ÉtablissementTerritorialMédicoSocialActivitéTestFactory.créeÉtablissementTerritorialMédicoSocialActivité(
        { année: 2021, numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial }
      ),
    ]
    const mockedChargeParNuméroFiness = jest.fn(async (): Promise<ÉtablissementTerritorialMédicoSocialActivité[]> => {
      return activités
    })
    const établissementTerritorialMédicoSocialActivitéLoader: ÉtablissementTerritorialMédicoSocialActivitéLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase(établissementTerritorialMédicoSocialActivitéLoader)

    // WHEN
    const activitésRécupérés = await récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
    expect(activitésRécupérés).toStrictEqual(activités)

  })

  it('signale une alerte si l’activité de l’établissement territorial médico-social n’est pas trouvée', async () => {
    // GIVEN
    const numéroFinessÉtablissementTerritorial = '123456789'
    const mockedChargeParNuméroFiness =
      jest.fn().mockReturnValueOnce(new ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée(numéroFinessÉtablissementTerritorial))

    const établissementTerritorialMédicoSocialActivitéLoader: ÉtablissementTerritorialMédicoSocialActivitéLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase(établissementTerritorialMédicoSocialActivitéLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase.exécute(numéroFinessÉtablissementTerritorial)
      throw new Error('Une alerte d’établissement territorial médico-social activité non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’activité de l’établissement territorial médico-social 123456789 n’a pas été trouvée')
    }
  })
})
