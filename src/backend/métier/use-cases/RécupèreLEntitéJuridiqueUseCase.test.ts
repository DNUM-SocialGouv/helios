import { EntitéJuridiqueTestFactory } from '../../test-factories/EntitéJuridiqueTestFactory'
import { numéroFinessEntitéJuridique } from '../../testHelper'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { RécupèreLEntitéJuridiqueUseCase } from './RécupèreLEntitéJuridiqueUseCase'

describe('La récupération d’une entité juridique', () => {
  it('récupère la fiche identité de l’entité juridique', async () => {
    // GIVEN
    const entitéJuridique = EntitéJuridiqueTestFactory.créeEntitéJuridique({ numéroFinessEntitéJuridique })
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(entitéJuridique)
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique)

    // THEN
    expect(ficheIdentitéRécupérée).toStrictEqual(entitéJuridique)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledWith(numéroFinessEntitéJuridique)
    expect(mockedChargeParNuméroFiness).toHaveBeenCalledTimes(1)
  })

  it('signale une alerte si l’entité juridique liée au numéro FINESS n’est pas trouvée', async () => {
    // GIVEN
    const mockedChargeParNuméroFiness = jest.fn().mockResolvedValueOnce(new EntitéJuridiqueNonTrouvée(numéroFinessEntitéJuridique))
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeLEntitéJuridiqueDeRattachement: jest.fn(), chargeParNuméroFiness: mockedChargeParNuméroFiness }
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLEntitéJuridiqueUseCase.exécute(numéroFinessEntitéJuridique)
      throw new Error('Une alerte d’entité juridique non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios] L’entité juridique ${numéroFinessEntitéJuridique} n’a pas été trouvée`)
    }
  })
})
