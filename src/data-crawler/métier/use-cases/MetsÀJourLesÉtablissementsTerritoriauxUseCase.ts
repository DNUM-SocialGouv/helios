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
    const numéroFinessDesEntitésJuridiques = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
    const établissementsTerritoriauxOuverts =
      await this.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques)

    const établissementsTerritoriauxÀSupprimer = await this.extraisLesÉtablissementsTerritoriauxRécemmentFermés(établissementsTerritoriauxOuverts)

    await this.établissementTerritorialHeliosRepository.supprime(établissementsTerritoriauxÀSupprimer)

    await this.établissementTerritorialHeliosRepository.sauvegarde(établissementsTerritoriauxOuverts)
  }

  private async extraisLesÉtablissementsTerritoriauxRécemmentFermés(établissementsTerritoriauxOuverts: Readonly<{ adresseAcheminement: string; adresseNuméroVoie: string; adresseTypeVoie: string; adresseVoie: string; catégorieÉtablissement: string; courriel: string; dateMiseAJourSource: string; domaine: import('/Users/thierry.gonard/repo/helios/helios/src/data-crawler/métier/entities/DomaineÉtablissementTerritorial').DomaineÉtablissementTerritorial; libelléCatégorieÉtablissement: string; numéroFinessEntitéJuridique: string; numéroFinessÉtablissementPrincipal: string; numéroFinessÉtablissementTerritorial: string; raisonSociale: string; téléphone: string; typeÉtablissement: string }>[]) {
    const numéroFinessDesÉtablissementsTerritoriauxEnBase =
      await this.établissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux()

    return numéroFinessDesÉtablissementsTerritoriauxEnBase.filter(
      (établissementTerritorialEnBase) => !établissementsTerritoriauxOuverts.find(
        (établissementTerritorialOuverte) => établissementTerritorialOuverte.numéroFinessÉtablissementTerritorial === établissementTerritorialEnBase
      )
    )
  }
}
