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

    private readonly catégorisationSourceExterneLoader: any,
  ) {}

  async exécute(): Promise<void> {
    try {
      const dateDeMiseAJourDuFichierSource = this.entitéJuridiqueSourceExterneLoader.récupèreLaDateDeMiseÀJourDuFichierSource();
      const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes();
      const entitéJuridiquesSauvegardées = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques();

      const entitésJuridiquesÀSupprimer = this.extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes, entitéJuridiquesSauvegardées);

      await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer);

      await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiquesOuvertes, dateDeMiseAJourDuFichierSource);
    } catch (error) {
      throw new HeliosError(error.message);
    }
  }

  private extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[], entitéJuridiquesSauvegardées: string[]): string[] {
    const numérosFinessDesEntitésJuridiquesOuvertes = new Set(entitésJuridiquesOuvertes.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique));
    const numérosFinessDesEntitésJuridiquesSauvegardées = new Set(entitéJuridiquesSauvegardées);

    return détecteLesObjetsÀSupprimer(numérosFinessDesEntitésJuridiquesOuvertes, numérosFinessDesEntitésJuridiquesSauvegardées);
  }
}
