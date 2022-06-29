import { ÉtablissementTerritorialTestFactory } from '../../test-factories/ÉtablissementTerritorialTestFactory'
import { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialMédicoSocial } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialLoader'
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from './RécupèreLÉtablissementTerritorialMédicoSocialUseCase'

describe('La récupération d’un établissement territorial médico-social', () => {
  it('récupère la fiche identité de l’établissement territorial médico-social', async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestFactory.créeUneIdentitéMédicoSocial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    const mockedChargeIdentité = jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial)
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce({ estMonoÉtablissement: false })
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce({
      raisonSocialeDeLEntitéDeRattachement: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique: 'Société Anonyme (S.A.)',
    })

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeIdentité: mockedChargeIdentité,
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    }

    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: mockedChargeLEntitéJuridiqueDeRattachement, chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(mockedÉtablissementTerritorialMédicoSocialLoader, mockedEntitéJuridiqueLoader)

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique : 'Société Anonyme (S.A.)',
    }
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocial['identité'] = {
      ...fakeIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement: false,
    }

    expect(établissementTerritorialMédicoSocial.identité).toStrictEqual(ficheIdentitéÉtablissementTerritorialMédicoSocial)
    expect(mockedChargeIdentité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeIdentité).toHaveBeenCalledTimes(1)
    expect(mockedEstUnMonoÉtablissement).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedEstUnMonoÉtablissement).toHaveBeenCalledTimes(1)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1)
  })

  it('signale une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness =
      jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial))
    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeIdentité: mockedChargeParNuméroFiness,
      estUnMonoÉtablissement: jest.fn(),
    }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(mockedÉtablissementTerritorialMédicoSocialLoader, entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessEntitéJuridique)
      throw new Error('Une alerte d’établissement territorial non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’établissement territorial médico-social 123456789 n’a pas été trouvé')
    }
  })

  it('récupère les activités de l’établissement territorial médico-social', async () => {
    // GIVEN
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce({ estMonoÉtablissement: false })

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestFactory.créeUneIdentitéMédicoSocial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )

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
    const mockedChargeActivité = jest.fn().mockResolvedValueOnce(activités)
    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: mockedChargeActivité,
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    }

    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(mockedÉtablissementTerritorialMédicoSocialLoader, mockedEntitéJuridiqueLoader)

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(mockedChargeActivité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeActivité).toHaveBeenCalledTimes(1)
    expect(établissementTerritorialMédicoSocial.activité).toStrictEqual(activités)
  })
})
