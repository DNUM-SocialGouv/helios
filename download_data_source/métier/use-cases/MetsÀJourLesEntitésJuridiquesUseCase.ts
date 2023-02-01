import { HeliosError } from "../../infrastructure/HeliosError";
import { Catégorisation, EntitéJuridique } from "../entities/EntitéJuridique";
import { NiveauxStatutsJuridiques } from "../entities/NiveauxStatutsJuridiques";
import { EntitéJuridiqueHeliosLoader } from "../gateways/EntitéJuridiqueHeliosLoader";
import { EntitéJuridiqueHeliosRepository } from "../gateways/EntitéJuridiqueHeliosRepository";
import { EntitéJuridiqueSourceExterneLoader } from "../gateways/EntitéJuridiqueSourceExterneLoader";
import { StatutsJuridiquesSourceExterneLoader } from "../gateways/StatutsJuridiquesSourceExterneLoader";
import { détecteLesObjetsÀSupprimer } from "./détecteLesObjetsÀSupprimer";

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly catégorisationSourceExterneLoader: StatutsJuridiquesSourceExterneLoader
  ) {}

  async exécute(): Promise<void> {
    try {
      const dateDeMiseAJourDuFichierSource = this.entitéJuridiqueSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource();
      const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes();
      const entitéJuridiquesSauvegardées = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques();

      const entitésJuridiquesÀSupprimer = this.extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes, entitéJuridiquesSauvegardées);
      const entitésJuridiqueCatégorisées = this.associeLaCatégorisation(entitésJuridiquesOuvertes);

      await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer);

      await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiqueCatégorisées, dateDeMiseAJourDuFichierSource);
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }

  private associeLaCatégorisation(entitésJuridiquesOuvertes: EntitéJuridique[]) {
    const catégories = this.catégorisationSourceExterneLoader.récupèreLesNiveauxDesStatutsJuridiques();

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
    const ORGANISME_PRIVE_CARACTERE_COMMERCIAL = "2200";
    const PERSONNE_MORALE_DE_DROIT_ETRANGER = "3000";
    if (niveauStatutJuridique?.statutJuridiqueNiv1 === ORGANISMES_ETABLISSEMENTS_PUBLICS) {
      return Catégorisation.PUBLIC;
    }
    if (niveauStatutJuridique?.statutJuridiqueNiv1 === PERSONNE_MORALE_DE_DROIT_ETRANGER) {
      return Catégorisation.PERSONNE_MORALE_DROIT_ETRANGER;
    }
    if (niveauStatutJuridique?.statutJuridiqueNiv2 === ORGANISME_PRIVE_NON_LUCRATIF) {
      return Catégorisation.PRIVE_NON_LUCRATIF;
    }
    if (niveauStatutJuridique?.statutJuridiqueNiv2 === ORGANISME_PRIVE_CARACTERE_COMMERCIAL) {
      return Catégorisation.PRIVE_LUCRATIF;
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
