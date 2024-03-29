import { HeliosError } from "../../infrastructure/HeliosError";
import { ÉtablissementTerritorialIdentité } from "../entities/ÉtablissementTerritorialIdentité";
import { EntitéJuridiqueHeliosLoader } from "../gateways/EntitéJuridiqueHeliosLoader";
import { ÉtablissementTerritorialHeliosLoader } from "../gateways/ÉtablissementTerritorialHeliosLoader";
import { ÉtablissementTerritorialRepository } from "../gateways/ÉtablissementTerritorialRepository";
import { ÉtablissementTerritorialSourceExterneLoader } from "../gateways/ÉtablissementTerritorialSourceExterneLoader";
import { détecteLesObjetsÀSupprimer } from "./détecteLesObjetsÀSupprimer";

export class MetsÀJourLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialSourceExterneLoader: ÉtablissementTerritorialSourceExterneLoader,
    private readonly établissementTerritorialHeliosRepository: ÉtablissementTerritorialRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly établissementTerritorialHeliosLoader: ÉtablissementTerritorialHeliosLoader
  ) { }

  async exécute(): Promise<void> {
    try {
      const dateDeMiseAJourDuFichierSource = this.établissementTerritorialSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource();
      const numéroFinessDesEntitésJuridiques = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques();

      const établissementsTerritoriauxOuverts =
        await this.établissementTerritorialSourceExterneLoader.récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques);

      const établissementsTerritoriauxSauvegardés = await this.établissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux();

      const établissementsTerritoriauxÀSupprimer = this.extraisLesÉtablissementsTerritoriauxRécemmentFermés(
        établissementsTerritoriauxOuverts,
        établissementsTerritoriauxSauvegardés
      );

      await this.établissementTerritorialHeliosRepository.supprime(établissementsTerritoriauxÀSupprimer);

      await this.établissementTerritorialHeliosRepository.sauvegarde(établissementsTerritoriauxOuverts, dateDeMiseAJourDuFichierSource);
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }

  private extraisLesÉtablissementsTerritoriauxRécemmentFermés(
    établissementsTerritoriauxOuverts: ÉtablissementTerritorialIdentité[],
    établissementsTerritoriauxSauvegardés: string[]
  ) {
    const numérosFinessDesÉtablissementsTerritoriauxOuverts = new Set(
      établissementsTerritoriauxOuverts.map((établissementTerritorial) => établissementTerritorial.numéroFinessÉtablissementTerritorial)
    );
    const numérosFinessDesÉtablissementsTerritoriauxSauvegardés = new Set(établissementsTerritoriauxSauvegardés);

    return détecteLesObjetsÀSupprimer(numérosFinessDesÉtablissementsTerritoriauxOuverts, numérosFinessDesÉtablissementsTerritoriauxSauvegardés);
  }
}
