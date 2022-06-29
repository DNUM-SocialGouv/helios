import { ÉtablissementTerritorialTestFactory } from '../../test-factories/ÉtablissementTerritorialTestFactory'
import { fakeÉtablissementTerritorialMédicoSocialLoader, numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialMédicoSocialIdentité } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialIdentité'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase } from './RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase'

describe('La récupération d’un établissement territorial médico-social identité', () => {
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
      new RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique : 'Société Anonyme (S.A.)',
    }
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocialIdentité = {
      ...ficheIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement: false,
    }

    expect(ficheIdentitéRécupérée).toStrictEqual(ficheIdentitéÉtablissementTerritorialMédicoSocial)
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
      new RécupèreLÉtablissementTerritorialMédicoSocialIdentitéUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

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
