import { ÉtablissementTerritorialTestBuilder } from '../../test-builder/ÉtablissementTerritorialTestBuilder'
import { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialSanitaire } from '../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialSanitaireLoader } from '../gateways/ÉtablissementTerritorialSanitaireLoader'
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from './RécupèreLÉtablissementTerritorialSanitaireUseCase'

describe('La récupération d’un établissement territorial sanitaire', () => {
  it('récupère la fiche identité de l’établissement territorial sanitaire', async () => {
    // GIVEN
    const fakeFicheIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire(
      {
        numéroFinessEntitéJuridique: {
          dateMiseAJourSource: '2022-05-14',
          value: numéroFinessEntitéJuridique,
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseAJourSource: '2022-05-14',
          value: numéroFinessÉtablissementTerritorial,
        },
      }
    )
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(fakeFicheIdentitéÉtablissementTerritorial)
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseAJourSource: '2022-05-14',
        value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      },
      statutJuridique: {
        dateMiseAJourSource: '2022-05-14',
        value: 'Société Anonyme (S.A.)',
      },
    }
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce(entitéJuridiqueDeRattachement)
    const mockedÉtablissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: jest.fn(),
      chargeIdentité: mockedChargeParNuméroFiness,
    }
    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeIdentité: jest.fn(), chargeRattachement: mockedChargeLEntitéJuridiqueDeRattachement }
    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialSanitaireUseCase(mockedÉtablissementTerritorialLoader, mockedEntitéJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    const ficheIdentitéÉtablissementTerritorialSanitaire: ÉtablissementTerritorialSanitaire['identité'] = {
      ...fakeFicheIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
    }

    expect(ficheIdentitéRécupérée.identité).toStrictEqual(ficheIdentitéÉtablissementTerritorialSanitaire)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1)
  })

  it('signale une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial))
    const établissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader = { chargeActivité: jest.fn(), chargeIdentité: mockedChargeParNuméroFiness }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeIdentité: jest.fn(), chargeRattachement: jest.fn() }
    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialSanitaireUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessEntitéJuridique)
      throw new Error('Une alerte d’établissement territorial non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] L’établissement territorial sanitaire ${numéroFinessÉtablissementTerritorial} n’a pas été trouvé`)
    }
  })

  it('récupère les activités de l’établissement territorial sanitaire', async () => {
    // GIVEN
    const fakeIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéSanitaire(
      {
        numéroFinessEntitéJuridique: {
          dateMiseAJourSource: '2022-05-14',
          value: numéroFinessEntitéJuridique,
        },
        numéroFinessÉtablissementTerritorial: {
          dateMiseAJourSource: '2022-05-14',
          value: numéroFinessÉtablissementTerritorial,
        },
      }
    )

    const fakeActivitésSanitaires: ÉtablissementTerritorialSanitaire['activités'] = [
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire(
        {
          année: 2016,
          numéroFinessÉtablissementTerritorial,
        }
      ),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire(
        {
          année: 2017,
          numéroFinessÉtablissementTerritorial,
        }
      ),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire(
        {
          année: 2018,
          numéroFinessÉtablissementTerritorial,
        }
      ),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire(
        {
          année: 2019,
          numéroFinessÉtablissementTerritorial,
        }
      ),
      ÉtablissementTerritorialTestBuilder.créeUneActivitéSanitaire(
        {
          année: 2020,
          numéroFinessÉtablissementTerritorial,
        }
      ),
    ]
    const mockedChargeActivité = jest.fn().mockResolvedValueOnce(fakeActivitésSanitaires)

    const mockedÉtablissementTerritorialSanitaireLoader: ÉtablissementTerritorialSanitaireLoader = {
      chargeActivité: mockedChargeActivité,
      chargeIdentité: jest.fn().mockResolvedValueOnce(fakeIdentitéÉtablissementTerritorial),
    }

    const mockedEntitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeIdentité: jest.fn(), chargeRattachement: jest.fn() }

    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialSanitaireUseCase(mockedÉtablissementTerritorialSanitaireLoader, mockedEntitéJuridiqueLoader)

    // WHEN
    const établissementTerritorialSanitaire = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    expect(mockedChargeActivité).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeActivité).toHaveBeenCalledTimes(1)
    expect(établissementTerritorialSanitaire.activités).toStrictEqual(fakeActivitésSanitaires)
  })
})
