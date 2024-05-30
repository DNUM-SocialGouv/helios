import { HeliosError } from "../../infrastructure/HeliosError";
import { Catégorisation, EntitéJuridique } from "../entities/EntitéJuridique";
import { NiveauStatutJuridique } from "../entities/NiveauStatutJuridique";
import { EntitéJuridiqueHeliosLoader } from "../gateways/EntitéJuridiqueHeliosLoader";
import { EntitéJuridiqueHeliosRepository } from "../gateways/EntitéJuridiqueHeliosRepository";
import { EntitéJuridiqueSourceExterneLoader } from "../gateways/EntitéJuridiqueSourceExterneLoader";
import { Logger } from "../gateways/Logger";
import { StatutsJuridiquesSourceExterneLoader } from "../gateways/StatutsJuridiquesSourceExterneLoader";
import { détecteLesObjetsÀSupprimer } from "./détecteLesObjetsÀSupprimer";

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly catégorisationSourceExterneLoader: StatutsJuridiquesSourceExterneLoader,
    private readonly logger: Logger
  ) { }

  async exécute(): Promise<void> {
    try {
      const dateDeMiseAJourDuFichierSource = this.entitéJuridiqueSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource();
      const entitésJuridiquesOuvertes = await this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes();
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
      const niveauStatutJuridique = this.récupèreNiveauStatutJuridique(catégories, entitéJuridique);
      const catégorisation = this.trouverLaBonneCatégorisation(niveauStatutJuridique);
      if (catégorisation)
        return {
          ...entitéJuridique,
          catégorisation,
        };
      this.logger.warn(
        `Aucune catégorisation n'a été trouvée pour le statutJuridique ${entitéJuridique.statutJuridique} sur l'entité juridique ${entitéJuridique.numéroFinessEntitéJuridique}`
      );
      return entitéJuridique;
    });
  }

  private trouverLaBonneCatégorisation(niveauStatutJuridique: NiveauStatutJuridique) {
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

  private récupèreNiveauStatutJuridique(catégories: NiveauStatutJuridique[], entitéJuridique: EntitéJuridique): NiveauStatutJuridique {
    return catégories.find((catégorie) => catégorie.statutJuridique === entitéJuridique.statutJuridique) as NiveauStatutJuridique;
  }

  private extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[], entitéJuridiquesSauvegardées: string[]): string[] {
    const numérosFinessDesEntitésJuridiquesOuvertes = new Set(entitésJuridiquesOuvertes.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique));
    const numérosFinessDesEntitésJuridiquesSauvegardées = new Set(entitéJuridiquesSauvegardées);

    return détecteLesObjetsÀSupprimer(numérosFinessDesEntitésJuridiquesOuvertes, numérosFinessDesEntitésJuridiquesSauvegardées);
  }
}
