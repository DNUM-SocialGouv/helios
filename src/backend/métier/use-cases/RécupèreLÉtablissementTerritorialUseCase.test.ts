import { ÉtablissementTerritorialTestFactory } from '../../test/ÉtablissementTerritorialTestFactory'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from '../entities/ÉtablissementTerritorialMédicoSocial/EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from '../entities/ÉtablissementTerritorialMédicoSocial/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialIdentité } from '../entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../entities/ÉtablissementTerritorialNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'
import { RécupèreLÉtablissementTerritorialUseCase } from './RécupèreLÉtablissementTerritorialUseCase'

describe('La récupération d’un établissement territorial', () => {
  it('récupère la fiche identité de l’établissement territorial', async () => {
    // GIVEN
    const numéroFinessÉtablissementTerritorial = '123456789'
    const numéroFinessEntitéJuridique = '987654321'
    const ficheIdentitéÉtablissementTerritorial: ÉtablissementTerritorialIdentité = ÉtablissementTerritorialTestFactory.créeÉtablissementTerritorial(
      { numéroFinessEntitéJuridique, numéroFinessÉtablissementTerritorial }
    )
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return ficheIdentitéÉtablissementTerritorial
    })
    const mockedEstUnMonoÉtablissement = jest.fn(async (): Promise<MonoÉtablissement> => {
      return { estMonoÉtablissement: false }
    })
    const mockedChargeLEntitéJuridiqueDeRattachement = jest.fn(async (): Promise<EntitéJuridiqueDeRattachement> => {
      return {
        raisonSocialeDeLEntitéDeRattachement: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
        statutJuridique: 'Société Anonyme (S.A.)',
      }
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness, estUnMonoÉtablissement: mockedEstUnMonoÉtablissement }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: mockedChargeLEntitéJuridiqueDeRattachement, chargeParNuméroFiness: jest.fn() }
    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

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

  it('lève une alerte si l’établissement territorial liée au numéro FINESS n’est pas trouvé', async () => {
    // GIVEN
    const numéroFiness = '123456789'
    const mockedChargeParNuméroFiness = jest.fn(async () => {
      return new ÉtablissementTerritorialNonTrouvée('123456789')
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialLoader =
      { chargeParNuméroFiness: mockedChargeParNuméroFiness, estUnMonoÉtablissement: jest.fn() }
    const entitéJuridiqueLoader: EntitéJuridiqueLoader =
      { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: jest.fn() }

    const récupèreLÉtablissementTerritorialUseCase = new RécupèreLÉtablissementTerritorialUseCase(établissementTerritorialLoader, entitéJuridiqueLoader)

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
