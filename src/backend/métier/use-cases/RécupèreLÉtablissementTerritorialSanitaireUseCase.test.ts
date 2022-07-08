import { ÉtablissementTerritorialTestBuilder } from '../../test-builder/ÉtablissementTerritorialTestBuilder'
import { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial } from '../../testHelper'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialSanitaireIdentité } from '../entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialSanitaireLoader } from '../gateways/ÉtablissementTerritorialSanitaireLoader'
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from './RécupèreLÉtablissementTerritorialSanitaireUseCase'

describe('La récupération d’un établissement territorial sanitaire', () => {
  it('récupère la fiche identité de l’établissement territorial sanitaire', async () => {
    // GIVEN
    const ficheIdentitéÉtablissementTerritorial = ÉtablissementTerritorialTestBuilder.créeUneIdentitéMédicoSocial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(ficheIdentitéÉtablissementTerritorial)
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn().mockResolvedValueOnce({
      raisonSocialeDeLEntitéDeRattachement: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
      statutJuridique: 'Société Anonyme (S.A.)',
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader = { chargeIdentité: mockedChargeParNuméroFiness }
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

  it('signale une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial))
    const établissementTerritorialLoader: ÉtablissementTerritorialSanitaireLoader = { chargeIdentité: mockedChargeParNuméroFiness }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }
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
})
