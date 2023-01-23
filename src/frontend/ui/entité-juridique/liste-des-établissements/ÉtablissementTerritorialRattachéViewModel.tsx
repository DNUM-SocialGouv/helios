import { ReactElement } from "react";

import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Paths } from "../../../configuration/Paths";
import { Wording } from "../../../configuration/wording/Wording";

export class ÉtablissementTerritorialRattachéViewModel {
  constructor(private readonly établissementTerritorialRattaché: ÉtablissementTerritorialRattaché, private wording: Wording) {}

  public get numéroFiness(): string {
    return this.établissementTerritorialRattaché.numéroFiness;
  }

  public get identifiant(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        {" - "}
        {this.numéroFiness}
        {" - "}
        {this.établissementTerritorialRattaché.raisonSocialeCourte}
      </>
    );
  }

  public lienVersLÉtablissement(paths: Paths): string {
    const préfixe =
      this.établissementTerritorialRattaché.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL
        ? paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL
        : paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE;
    return `${préfixe}/${this.numéroFiness}`;
  }

  public get domaine(): DomaineÉtablissementTerritorial {
    return this.établissementTerritorialRattaché.domaine;
  }
}
