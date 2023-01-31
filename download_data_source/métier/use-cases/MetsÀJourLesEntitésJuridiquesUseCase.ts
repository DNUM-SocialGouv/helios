import { HeliosError } from "../../infrastructure/HeliosError";
import { EntitéJuridique } from "../entities/EntitéJuridique";
import { EntitéJuridiqueHeliosLoader } from "../gateways/EntitéJuridiqueHeliosLoader";
import { EntitéJuridiqueHeliosRepository } from "../gateways/EntitéJuridiqueHeliosRepository";
import { EntitéJuridiqueSourceExterneLoader } from "../gateways/EntitéJuridiqueSourceExterneLoader";
import { détecteLesObjetsÀSupprimer } from "./détecteLesObjetsÀSupprimer";

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly catégorisationSourceExterneLoader: any
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

    const entitésJuridiqueCatégorisées = entitésJuridiquesOuvertes.map((entitéJuridique) => {
      const niveauStatutJuridique = catégories.find((catégorie) => catégorie.statutJuridique === entitéJuridique.statutJuridique);
      const catégorisation = niveauStatutJuridique.statutJuridiqueNiv1 === "1000" ? "public" : "";
      return {
        ...entitéJuridique,
        catégorisation,
      };
    });
    return entitésJuridiqueCatégorisées;
  }

  private extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[], entitéJuridiquesSauvegardées: string[]): string[] {
    const numérosFinessDesEntitésJuridiquesOuvertes = new Set(entitésJuridiquesOuvertes.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique));
    const numérosFinessDesEntitésJuridiquesSauvegardées = new Set(entitéJuridiquesSauvegardées);

    return détecteLesObjetsÀSupprimer(numérosFinessDesEntitésJuridiquesOuvertes, numérosFinessDesEntitésJuridiquesSauvegardées);
  }
}
