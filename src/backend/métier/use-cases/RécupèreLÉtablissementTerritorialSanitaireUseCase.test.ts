import { ÉtablissementTerritorialTestFactory } from '../../test-factories/ÉtablissementTerritorialTestFactory'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialSanitaireIdentité } from '../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialSanitaireLoader } from '../gateways/ÉtablissementTerritorialSanitaireLoader'
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from './RécupèreLÉtablissementTerritorialSanitaireUseCase'

describe('La récupération d’un établissement territorial sanitaire', () => {
  it('récupère la fiche identité de l’établissement territorial sanitaire', async () => {
    // GIVEN
    const numéroFinessÉtablissementTerritorial = '123456789'
    const numéroFinessEntitéJuridique = '987654321'
    const ficheIdentitéÉtablissementTerritorial: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return ficheIdentitéÉtablissementTerritorial
    })
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn(async (): Promise<EntitéJuridiqueDeRattachement> => {
      return {
        raisonSocialeDeLEntitéDeRattachement: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        statutJuridique: 'Société Anonyme (S.A.)',
      }
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: mockedChargeLEntitéJuridiqueDeRattachement, chargeParNuméroFiness: jest.fn() }
    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialSanitaireUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFinessÉtablissementTerritorial)

    // THEN
    const entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement = {
      raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique : 'Société Anonyme (S.A.)',
    }
    const ficheIdentitéÉtablissementTerritorialMédicoSocial: ÉtablissementTerritorialSanitaireIdentité = {
      ...ficheIdentitéÉtablissementTerritorial,
      ...entitéJuridiqueDeRattachement,
    }

    expect(ficheIdentitéRécupérée).toStrictEqual(ficheIdentitéÉtablissementTerritorialMédicoSocial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessÉtablissementTerritorial)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFinessEntitéJuridique)
    expect(mockedChargeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1)
  })

  it('lève une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const numéroFiness = '123456789'
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return new ÉtablissementTerritorialSanitaireNonTrouvée('123456789')
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialUseCase =
      new RécupèreLÉtablissementTerritorialSanitaireUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLÉtablissementTerritorialUseCase.exécute(numéroFiness)
      throw new Error('Une alerte d’établissement territorial non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’établissement territorial sanitaire 123456789 n’a pas été trouvé')
    }
  })
})
