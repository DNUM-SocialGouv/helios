import { HeliosError } from "../../infrastructure/HeliosError";
import { ÉtablissementTerritorialIdentité, Classification, ListeDesCategoriesPourLaClassificationPublicsEnSituationHandicap, ListeDesCategoriesPourLaClassificationPersonnesAgees } from "../entities/ÉtablissementTerritorialIdentité";
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

      const établissementsTerritoriauxClassifies = this.associeLaClassification(établissementsTerritoriauxOuverts);

      await this.établissementTerritorialHeliosRepository.supprime(établissementsTerritoriauxÀSupprimer);

      await this.établissementTerritorialHeliosRepository.sauvegarde(établissementsTerritoriauxClassifies, dateDeMiseAJourDuFichierSource);
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

  private associeLaClassification(établissementsTerritoriauxOuverts: ÉtablissementTerritorialIdentité[]) {
    return établissementsTerritoriauxOuverts.map((etablissementTerritorialOuvert) => {
      const classification = this.trouverLaBonneClassification(etablissementTerritorialOuvert.libelléCatégorieÉtablissement,
      );
      return {
        ...etablissementTerritorialOuvert,
        classificationEtablissement: classification
      }
    });
  }

  private trouverLaBonneClassification(libelléCatégorieÉtablissement: string) {

    if (ListeDesCategoriesPourLaClassificationPublicsEnSituationHandicap.includes(libelléCatégorieÉtablissement)) {
      return Classification.PUBLICS_SITUATION_HANDICAP;
    }
    if (ListeDesCategoriesPourLaClassificationPersonnesAgees.includes(libelléCatégorieÉtablissement)) {
      return Classification.PERSONNES_AGEES;
    }
    return Classification.NON_CALSSIFIE;
  }
}
