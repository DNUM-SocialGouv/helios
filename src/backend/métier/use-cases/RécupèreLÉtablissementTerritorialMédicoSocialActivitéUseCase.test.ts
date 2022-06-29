import { ÉtablissementTerritorialTestFactory } from '../../test-factories/ÉtablissementTerritorialTestFactory'
import { fakeÉtablissementTerritorialMédicoSocialLoader, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase } from './RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase'

describe('Récupération de l’activité d’un établissement territorial médico-social', () => {
  it('récupère les activités de l’établissement territorial médico-social', async () => {
    // GIVEN
    const activités = [
      ÉtablissementTerritorialTestFactory.créeUneActivitéMédicoSocial(
        { année: 2019, numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial }
      ),
      ÉtablissementTerritorialTestFactory.créeUneActivitéMédicoSocial(
        { année: 2020, numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial }
      ),
      ÉtablissementTerritorialTestFactory.créeUneActivitéMédicoSocial(
        { année: 2021, numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial }
      ),
    ]
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(activités)
    const mockedÉtablissementTerritorialMédicoSocialLoader = fakeÉtablissementTerritorialMédicoSocialLoader
    mockedÉtablissementTerritorialMédicoSocialLoader.chargeActivité = mockedChargeParNuméroFiness

    const récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase(fakeÉtablissementTerritorialMédicoSocialLoader)

    // WHEN
    const activitésRécupérés = await récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
    expect(activitésRécupérés).toStrictEqual(activités)

  })

  it('signale une alerte si l’activité de l’établissement territorial médico-social n’est pas trouvée', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness =
      jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial))
    const mockedÉtablissementTerritorialMédicoSocialLoader = fakeÉtablissementTerritorialMédicoSocialLoader
    mockedÉtablissementTerritorialMédicoSocialLoader.chargeActivité = mockedChargeParNuméroFiness
    const récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase(fakeÉtablissementTerritorialMédicoSocialLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialMédicoSocialActivitéUseCase.exécute(numéroFinessÉtablissementTerritorial)
      throw new Error('Une alerte d’établissement territorial médico-social activité non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’établissement territorial médico-social 123456789 n’a pas été trouvé')
    }
  })
})
