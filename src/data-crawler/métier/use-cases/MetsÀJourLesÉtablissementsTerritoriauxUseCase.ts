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
      const t0 = performance.now()

      const numéroFinessDesEntitésJuridiques = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
      const t1 = performance.now()
      console.log(`Temps de récupération des numéros finess des entités juridiques en ${t1 - t0}ms`)

      const établissementsTerritoriauxOuverts =
        await this.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques)
      const t2 = performance.now()
      console.log(`Temps de récupération des établissements territoriaux ouverts en ${t2 - t1}ms`)

      const établissementsTerritoriauxSauvegardés = await this.établissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux()
      const t3 = performance.now()
      console.log(`Temps de récupération des numéros finess des établissements territoriaux sauvegardés en ${t3 - t2}ms`)

      const établissementsTerritoriauxÀSupprimer = this.extraisLesÉtablissementsTerritoriauxRécemmentFermés(
        établissementsTerritoriauxOuverts,
        établissementsTerritoriauxSauvegardés
      )
      const t4 = performance.now()
      console.log(`Temps de extraction des établissements territoriaux à supprimer en ${t4 - t3}ms`)

      await this.établissementTerritorialHeliosRepository.supprime(établissementsTerritoriauxÀSupprimer)
      const t5 = performance.now()
      console.log(`Temps de suppression des établissements territoriaux à supprimer en ${t5 - t4}ms`)

      await this.établissementTerritorialHeliosRepository.sauvegarde(établissementsTerritoriauxOuverts)
      const t6 = performance.now()
      console.log(`Temps de sauvegarde des établissements territoriaux ouverts en ${t6 - t5}ms`)

    } catch (error) {
      throw new HeliosError(error.message)
    }
  }

  private extraisLesÉtablissementsTerritoriauxRécemmentFermés(
    établissementsTerritoriauxOuverts: ÉtablissementTerritorialIdentité[],
    établissementsTerritoriauxSauvegardés: string[]
  ) {
    return établissementsTerritoriauxSauvegardés.filter(
      (établissementTerritorialSauvegardé) => !établissementsTerritoriauxOuverts.find(
        (établissementTerritorialOuverte) => établissementTerritorialOuverte.numéroFinessÉtablissementTerritorial === établissementTerritorialSauvegardé
      )
    )
  }
}
