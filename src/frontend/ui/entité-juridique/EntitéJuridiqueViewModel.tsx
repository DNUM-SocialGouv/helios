import { ReactElement } from "react";

import { EntitéJuridique } from "../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { Wording } from "../../configuration/wording/Wording";
import { StringFormater } from "../commun/StringFormater";

export class EntitéJuridiqueViewModel {
  constructor(private readonly entitéJuridique: EntitéJuridique, private readonly wording: Wording) {}

  public get titreAccessible(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {" - "}
        {this.numéroFiness}
        {" - "}
        {this.nomCourtDeLEntitéJuridique}
      </>
    );
  }

  public get titre(): string {
    return `EJ - ${this.numéroFiness} - ${this.nomCourtDeLEntitéJuridique}`;
  }

  public get nomDeLEntitéJuridique(): string {
    return this.entitéJuridique.raisonSociale.value;
  }

  public get nomCourtDeLEntitéJuridique(): string {
    return this.entitéJuridique.raisonSocialeCourte.value;
  }

  public get dateDeMiseÀJourDuNomDeLEntitéJuridique(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.raisonSociale.dateMiseÀJourSource);
  }

  public get numéroFiness(): string {
    return this.entitéJuridique.numéroFinessEntitéJuridique.value;
  }

  public get dateDeMiseÀJourDusiren(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.siren.dateMiseÀJourSource);
  }

  public get siren(): string {
    return this.entitéJuridique.siren.value;
  }

  public get dateDeMiseÀJourDuNuméroFiness(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.numéroFinessEntitéJuridique.dateMiseÀJourSource);
  }

  public get adresse(): string {
    return `${this.entitéJuridique.adresseNuméroVoie.value} ${this.entitéJuridique.adresseTypeVoie.value} ${this.entitéJuridique.adresseVoie.value} ${this.entitéJuridique.adresseAcheminement.value}`;
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.adresseNuméroVoie.dateMiseÀJourSource);
  }

  public get téléphone(): string {
    return this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.entitéJuridique.téléphone.value));
  }

  public get dateDeMiseÀJourDuTéléphone(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.téléphone.dateMiseÀJourSource);
  }

  public get statutDeLEntitéJuridique(): string {
    return this.entitéJuridique.libelléStatutJuridique.value;
  }

  public get dateDeMiseÀJourDuStatutDeLEntitéJuridique(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.libelléStatutJuridique.dateMiseÀJourSource);
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === "" ? this.wording.NON_RENSEIGNÉ : valeur;
  }
}
