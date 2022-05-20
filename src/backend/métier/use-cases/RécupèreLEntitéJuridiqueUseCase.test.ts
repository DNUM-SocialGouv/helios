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
    const établissementJuridiqueLoader: EntitéJuridiqueLoader = { chargeParNuméroFINESS: mockedChargeParNuméroFINESS }
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(établissementJuridiqueLoader)

    // WHEN
    const ficheIdentitéRécupérée = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)

    // THEN
    expect(ficheIdentitéRécupérée).toStrictEqual(entitéJuridique)
    expect(mockedChargeParNuméroFINESS).toHaveBeenCalledWith(numéroFINESS)
    expect(mockedChargeParNuméroFINESS).toHaveBeenCalledTimes(1)
    await expect(récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)).resolves.not.toThrow()
  })

  it('récupère la fiche identité de l’entité juridique', async () => {
    // GIVEN
    const numéroFINESS = '123456789'
    const mockedChargeParNuméroFINESS = jest.fn(async () => {
      return new EntitéJuridiqueNonTrouvée('123456789')
    })
    const établissementJuridiqueLoader: EntitéJuridiqueLoader = { chargeParNuméroFINESS: mockedChargeParNuméroFINESS }
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(établissementJuridiqueLoader)

    // WHEN
    // THEN
    await expect(récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)).resolves.toThrow(EntitéJuridiqueNonTrouvée)
    await expect(récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)).resolves.toThrow('L’entité juridique 123456789 n’a pas été trouvée')
  })
})
