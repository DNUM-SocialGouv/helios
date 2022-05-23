import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { RécupèreLEntitéJuridiqueUseCase } from './RécupèreLEntitéJuridiqueUseCase'

describe('La récupération d’une entité juridique', () => {
  it('récupère la fiche identité de l’entité juridique', async () => {
    // GIVEN
    const numéroFINESS = '123456789'
    const entitéJuridique: EntitéJuridique = {
      adresseAcheminement: '75000 Paris',
      adresseNuméroVoie: '6',
      adresseTypeVoie: 'AV',
      adresseVoie: 'rue de la Paix',
      dateMiseAJourSource: '20220514',
      libelléStatutJuridique: 'statut',
      numéroFinessEntitéJuridique: numéroFINESS,
      raisonSociale: 'Nom de l’entité juridique',
      téléphone: '0123456789',
    }
    const mockedChargeParNuméroFINESS = jest.fn(async () => {
      return entitéJuridique
    })
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeParNuméroFiness: mockedChargeParNuméroFINESS }
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)

    // THEN
    expect(ficheIdentitéRécupérée).toStrictEqual(entitéJuridique)
    expect(mockedChargeParNuméroFINESS).toHaveBeenCalledWith(numéroFINESS)
    expect(mockedChargeParNuméroFINESS).toHaveBeenCalledTimes(1)
  })

  it('lève une alerte si l’entité juridique liée au numéro FINESS n’est pas trouvée', async () => {
    // GIVEN
    const numéroFINESS = '123456789'
    const mockedChargeParNuméroFINESS = jest.fn(async () => {
      return new EntitéJuridiqueNonTrouvée('123456789')
    })
    const entitéJuridiqueLoader: EntitéJuridiqueLoader = { chargeParNuméroFiness: mockedChargeParNuméroFINESS }
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(entitéJuridiqueLoader)

    // WHEN
    try {
      await récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)
      throw new Error('Une alerte d’entité juridique non trouvée aurait dû être levée')
    } catch (error) {
      // THEN
      expect(error.message).toBe('[Helios] L’entité juridique 123456789 n’a pas été trouvée')
    }
  })
})
