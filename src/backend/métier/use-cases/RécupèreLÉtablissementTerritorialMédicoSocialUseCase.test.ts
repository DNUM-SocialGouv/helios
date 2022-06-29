import { ÉtablissementTerritorialTestFactory } from '../../test-factories/ÉtablissementTerritorialTestFactory'
import { fakeÉtablissementTerritorialMédicoSocialLoader, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialMédicoSocial } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from './RécupèreLÉtablissementTerritorialMédicoSocialUseCase'

describe('La récupération de l’identité d’un établissement territorial médico-social', () => {
  it('récupère la fiche identité de l’établissement territorial médico-social', async () => {
    // GIVEN
    const ficheIdentitéÉtablissementTerritorial: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeUneIdentitéMédicoSocial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(ficheIdentitéÉtablissementTerritorial)
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce({ estMonoÉtablissement: false })
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce({
      raisonSocialeDeLEntitéDeRattachement: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique: 'Société Anonyme (S.A.)',
    })
    const établissementTerritorialLoader = fakeÉtablissementTerritorialMédicoSocialLoader
    établissementTerritorialLoader.chargeIdentité = mockedChargeParNuméroFiness
    établissementTerritorialLoader.estUnMonoÉtablissement = mockedEstUnMonoÉtablissement
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: mockedChargeLEntitéJuridiqueDeRattachement, chargeParNuméroFiness: jest.fn() }
    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique : 'Société Anonyme (S.A.)',
    }
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocial['identité'] = {
      ...ficheIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement: false,
    }

    expect(ficheIdentitéRécupérée.identité).toStrictEqual(ficheIdentitéÉtablissementTerritorialMédicoSocial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
    expect(mockedEstUnMonoÉtablissement).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedEstUnMonoÉtablissement).toHaveBeenCalledTimes(1)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1)
  })

  it('signale une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness =
      jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial))
    const établissementTerritorialLoader = fakeÉtablissementTerritorialMédicoSocialLoader
    établissementTerritorialLoader.chargeIdentité = mockedChargeParNuméroFiness
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessEntitéJuridique)
      throw new Error('Une alerte d’établissement territorial non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’établissement territorial médico-social 123456789 n’a pas été trouvé')
    }
  })
})

describe('La récupération de l’activité d’un établissement territorial médico-social', () => {
  it('récupère les activités de l’établissement territorial médico-social', async () => {
    // GIVEN
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce({ estMonoÉtablissement: false })

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
    const mockedChargeParNuméroFiness1 = jest.fn().mockResolvedValueOnce(activités)
    const mockedChargeParNuméroFiness2 = jest.fn().mockResolvedValueOnce(activités)
    const mockedÉtablissementTerritorialMédicoSocialLoader = fakeÉtablissementTerritorialMédicoSocialLoader
    mockedÉtablissementTerritorialMédicoSocialLoader.chargeIdentité = mockedChargeParNuméroFiness1

    mockedÉtablissementTerritorialMédicoSocialLoader.chargeActivité = mockedChargeParNuméroFiness2
    mockedÉtablissementTerritorialMédicoSocialLoader.estUnMonoÉtablissement = mockedEstUnMonoÉtablissement

    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(fakeÉtablissementTerritorialMédicoSocialLoader, entitéJuridiqueLoader)

    // WHEN
    const activitésRécupérés = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(mockedChargeParNuméroFiness1).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness1).toHaveBeenCalledTimes(1)
    expect(activitésRécupérés.activité).toStrictEqual(activités)

  })

  it('signale une alerte si l’activité de l’établissement territorial médico-social n’est pas trouvée', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness =
      jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial))
    const mockedÉtablissementTerritorialMédicoSocialLoader = fakeÉtablissementTerritorialMédicoSocialLoader
    mockedÉtablissementTerritorialMédicoSocialLoader.chargeIdentité = mockedChargeParNuméroFiness
    mockedÉtablissementTerritorialMédicoSocialLoader.chargeActivité = mockedChargeParNuméroFiness
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(fakeÉtablissementTerritorialMédicoSocialLoader, entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial)
      throw new Error('Une alerte d’établissement territorial médico-social activité non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’établissement territorial médico-social 123456789 n’a pas été trouvé')
    }
  })
})
