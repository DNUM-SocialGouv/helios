import { ReactElement } from "react";

import { DomaineÉtablissementTerritorial } from "../../../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Paths } from "../../../configuration/Paths";
import { Wording } from "../../../configuration/wording/Wording";

export class EtablissementTerritorialRattacheViewModel {
  public doitAvoirLeFocus: boolean = false; constructor(private readonly etablissementTerritorialRattache: ÉtablissementTerritorialRattaché, private readonly wording: Wording) { }

  public get numéroFiness(): string {
    return this.etablissementTerritorialRattache.numéroFiness;
  }

  public get raisonSocialeCourte(): string {
    return this.etablissementTerritorialRattache.raisonSocialeCourte;
  }

  public get libelléCatégorieÉtablissement(): string {
    return this.etablissementTerritorialRattache.libelléCatégorieÉtablissement;
  }

  public get identifiant(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        {" - "}
        {this.numéroFiness}
        {" - "}
        {this.etablissementTerritorialRattache.raisonSocialeCourte}
      </>
    );
  }

  public lienVersLÉtablissement(paths: Paths): string {
    const préfixe =
      this.etablissementTerritorialRattache.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL
        ? paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL
        : paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE;
    return `${préfixe}/${this.numéroFiness}`;
  }

  public get domaine(): DomaineÉtablissementTerritorial {
    return this.etablissementTerritorialRattache.domaine;
  }
}
