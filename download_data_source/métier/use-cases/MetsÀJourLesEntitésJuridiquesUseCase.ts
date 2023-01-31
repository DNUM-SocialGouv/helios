import { HeliosError } from "../../infrastructure/HeliosError";
import { Catégorisation, EntitéJuridique } from "../entities/EntitéJuridique";
import { NiveauxStatutsJuridiques } from "../entities/NiveauxStatutsJuridiques";
import { CatégorisationSourceExterneLoader } from "../gateways/CatégorisationSourceExterneLoader";
import { EntitéJuridiqueHeliosLoader } from "../gateways/EntitéJuridiqueHeliosLoader";
import { EntitéJuridiqueHeliosRepository } from "../gateways/EntitéJuridiqueHeliosRepository";
import { EntitéJuridiqueSourceExterneLoader } from "../gateways/EntitéJuridiqueSourceExterneLoader";
import { détecteLesObjetsÀSupprimer } from "./détecteLesObjetsÀSupprimer";

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly catégorisationSourceExterneLoader: CatégorisationSourceExterneLoader
  ) {}

  async exécute(): Promise<void> {
    try {
      const dateDeMiseAJourDuFichierSource = this.entitéJuridiqueSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource();
      const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes();
      const entitéJuridiquesSauvegardées = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques();

      const entitésJuridiquesÀSupprimer = this.extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes, entitéJuridiquesSauvegardées);
      const entitésJuridiqueCatégorisées = await this.associeLaCatégorisation(entitésJuridiquesOuvertes);

      await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer);

      await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiqueCatégorisées, dateDeMiseAJourDuFichierSource);
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }

  private async associeLaCatégorisation(entitésJuridiquesOuvertes: EntitéJuridique[]) {
    const catégories = await this.catégorisationSourceExterneLoader.récupèreLesNiveauxDesStatutsJuridiques();

    return entitésJuridiquesOuvertes.map((entitéJuridique) => {
      const niveauStatutJuridique = this.récupèreNiveauxStatutJuridique(catégories, entitéJuridique);
      const catégorisation = this.trouverLaBonneCatégorisation(niveauStatutJuridique);
      if (catégorisation)
        return {
          ...entitéJuridique,
          catégorisation,
        };
      return entitéJuridique;
    });
  }

  private trouverLaBonneCatégorisation(niveauStatutJuridique: NiveauxStatutsJuridiques) {
    const ORGANISMES_ETABLISSEMENTS_PUBLICS = "1000";
    const ORGANISME_PRIVE_NON_LUCRATIF = "2100";
    if (niveauStatutJuridique.statutJuridiqueNiv1 === ORGANISMES_ETABLISSEMENTS_PUBLICS) {
      return Catégorisation.PUBLIC;
    }
    if (niveauStatutJuridique.statutJuridiqueNiv2 === ORGANISME_PRIVE_NON_LUCRATIF) {
      return Catégorisation.PRIVE_NON_LUCRATIF;
    }
    return "";
  }

  private récupèreNiveauxStatutJuridique(catégories: NiveauxStatutsJuridiques[], entitéJuridique: EntitéJuridique): NiveauxStatutsJuridiques {
    return catégories.find((catégorie) => catégorie.statutJuridique === entitéJuridique.statutJuridique) as NiveauxStatutsJuridiques;
  }

  private extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[], entitéJuridiquesSauvegardées: string[]): string[] {
    const numérosFinessDesEntitésJuridiquesOuvertes = new Set(entitésJuridiquesOuvertes.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique));
    const numérosFinessDesEntitésJuridiquesSauvegardées = new Set(entitéJuridiquesSauvegardées);

    return détecteLesObjetsÀSupprimer(numérosFinessDesEntitésJuridiquesOuvertes, numérosFinessDesEntitésJuridiquesSauvegardées);
  }
}
