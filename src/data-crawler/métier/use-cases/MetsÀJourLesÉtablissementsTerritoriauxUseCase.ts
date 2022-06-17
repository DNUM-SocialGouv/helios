import { HeliosError } from '../../infrastructure/HeliosError'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { ÉtablissementTerritorialHeliosLoader } from '../gateways/ÉtablissementTerritorialHeliosLoader'
import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'
import { ÉtablissementTerritorialSourceExterneLoader } from '../gateways/ÉtablissementTerritorialSourceExterneLoader'

export class MetsÀJourLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialSourceExterneLoader: ÉtablissementTerritorialSourceExterneLoader,
    private readonly établissementTerritorialHeliosRepository: ÉtablissementTerritorialRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly établissementTerritorialHeliosLoader: ÉtablissementTerritorialHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    try {
      const numéroFinessDesEntitésJuridiques = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
      const établissementsTerritoriauxOuverts =
        await this.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques)

      const établissementsTerritoriauxSauvegardés = await this.établissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux()

      const établissementsTerritoriauxÀSupprimer = this.extraisLesÉtablissementsTerritoriauxRécemmentFermés(
        établissementsTerritoriauxOuverts,
        établissementsTerritoriauxSauvegardés
      )

      await this.établissementTerritorialHeliosRepository.supprime(établissementsTerritoriauxÀSupprimer)

      await this.établissementTerritorialHeliosRepository.sauvegarde(établissementsTerritoriauxOuverts)
    } catch (error) {
      throw new HeliosError(error.message)
    }
  }

  private extraisLesÉtablissementsTerritoriauxRécemmentFermés(
    établissementsTerritoriauxOuverts: ÉtablissementTerritorialIdentité[],
    établissementsTerritoriauxSauvegardés: string[]
  ) {
    const établissementsTerritoriauxOuvertsSet = new Set(
      établissementsTerritoriauxOuverts.map((établissementTerritorial) => établissementTerritorial.numéroFinessÉtablissementTerritorial)
    )
    const établissementsTerritoriauxSauvegardésSet = new Set(établissementsTerritoriauxSauvegardés)

    const entitésJuridiquesRécemmentFermées = []

    for (const numéroFinessEntitéJuridique of établissementsTerritoriauxSauvegardésSet) {
      if (!établissementsTerritoriauxOuvertsSet.has(numéroFinessEntitéJuridique)) {
        entitésJuridiquesRécemmentFermées.push(numéroFinessEntitéJuridique)
      }
    }

    return entitésJuridiquesRécemmentFermées
  }
}
