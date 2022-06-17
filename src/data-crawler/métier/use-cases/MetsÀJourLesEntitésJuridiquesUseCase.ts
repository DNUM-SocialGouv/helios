import { HeliosError } from '../../infrastructure/HeliosError'
import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { EntitéJuridiqueHeliosRepository } from '../gateways/EntitéJuridiqueHeliosRepository'
import { EntitéJuridiqueSourceExterneLoader } from '../gateways/EntitéJuridiqueSourceExterneLoader'

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    try {
      const t0 = performance.now()
      const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes()
      const t1 = performance.now()
      console.log(`Temps de récupération des entités juridiques ouvertes: ${t1 - t0}ms`)
      const entitéJuridiquesSauvegardées = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
      const t2 = performance.now()
      console.log(`Temps de récupération des entités juridiques sauvegardées: ${t2 - t1}ms`)

      const entitésJuridiquesÀSupprimer = this.extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes, entitéJuridiquesSauvegardées)
      const t3 = performance.now()
      console.log(`Temps d'extraction des entités juridiques à supprimer: ${t3 - t2}ms`)

      await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer)
      const t4 = performance.now()
      console.log(`Temps de suppression des entités juridiques à supprimer: ${t4 - t3}ms`)

      await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiquesOuvertes)
      const t5 = performance.now()
      console.log(`Temps de sauvegarde des entités juridiques ouvertes: ${t5 - t4}ms`)
    } catch (error) {
      throw new HeliosError(error.message)
    }
  }

  private extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[], entitéJuridiquesSauvegardées: string[]): string[] {
    const entitésJuridiquesOuvertesSet = new Set(entitésJuridiquesOuvertes.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique))
    const entitésJuridiquesSauvegardéesSet = new Set(entitéJuridiquesSauvegardées)

    const entitésJuridiquesRécemmentFermées = []

    for (const numéroFinessEntitéJuridique of entitésJuridiquesSauvegardéesSet) {
      if (!entitésJuridiquesOuvertesSet.has(numéroFinessEntitéJuridique)) {
        entitésJuridiquesRécemmentFermées.push(numéroFinessEntitéJuridique)
      }
    }

    return entitésJuridiquesRécemmentFermées
  }
}
