import { ÉtablissementTerritorialTestBuilder } from '../../test-builder/ÉtablissementTerritorialTestBuilder'
import { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from '../entities/établissement-territorial-médico-social/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocial } from '../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../gateways/ÉtablissementTerritorialMédicoSocialLoader'
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from './RécupèreLÉtablissementTerritorialMédicoSocialUseCase'

describe('La récupération d’un établissement territorial médico-social', () => {
  it('récupère la fiche identité de l’établissement territorial médico-social', async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial(
      {
        numéroFinessEntitéJuridique: {
          dateMiseAJourSource: '2021-07-07',
          value: numéroFinessEntitéJuridique,
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseAJourSource: '2021-07-07',
          value: numéroFinessÉtablissementTerritorial,
        },
      }
    )
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseAJourSource: '2021-07-07',
        value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      },
      statutJuridique: {
        dateMiseAJourSource: '2021-07-07',
        value: 'Société Anonyme (S.A.)',
      },
    }
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseAJourSource: '2021-07-07',
        value: false,
      },
    }
    const mockedChargeIdentité = jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial)
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement)
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce(entitéJuridiqueDeRattachement)

    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: jest.fn(),
      chargeIdentité: mockedChargeIdentité,
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    }

    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeIdentité: jest.fn(), chargeRattachement: mockedChargeLEntitéJuridiqueDeRattachement }

    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(mockedÉtablissementTerritorialMédicoSocialLoader, mockedEntitéJuridiqueLoader)

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocial['identité'] = {
      ...fakeIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
      estMonoÉtablissement: {
        dateMiseAJourSource: '2021-07-07',
        value: false,
      },
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
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeIdentité: jest.fn(), chargeRattachement: jest.fn() }

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
    const fakeEstUnMonoÉtablissement: MonoÉtablissement = {
      estMonoÉtablissement: {
        dateMiseAJourSource: '2021-07-07',
        value: false,
      },
    }
    const mockedEstUnMonoÉtablissement = jest.fn().mockResolvedValueOnce(fakeEstUnMonoÉtablissement)

    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial(
      {
        numéroFinessEntitéJuridique: {
          dateMiseAJourSource: '2021-07-07',
          value: numéroFinessEntitéJuridique,
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseAJourSource: '2021-07-07',
          value: numéroFinessÉtablissementTerritorial,
        },
      }
    )

    const activités: ÉtablissementTerritorialMédicoSocial['activités'] = [
      ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({ année: 2019, numéroFinessÉtablissementTerritorial }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({ année: 2020, numéroFinessÉtablissementTerritorial }),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéMédicoSocial({ année: 2021, numéroFinessÉtablissementTerritorial }),
    ]
    const mockedChargeActivité = jest.fn().mockResolvedValueOnce(activités)
    const mockedÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader = {
      chargeActivité: mockedChargeActivité,
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
      estUnMonoÉtablissement: mockedEstUnMonoÉtablissement,
    }

    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeIdentité: jest.fn(), chargeRattachement: jest.fn() }

    const récupèreLÉtablissementTerritorialMédicoSocialUseCase =
      new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(mockedÉtablissementTerritorialMédicoSocialLoader, mockedEntitéJuridiqueLoader)

    // WHEN
    const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(mockedChargeActivité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeActivité).toHaveBeenCalledTimes(1)
    expect(établissementTerritorialMédicoSocial.activités).toStrictEqual(activités)
  })
})
