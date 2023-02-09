import { ReactElement } from "react";

import { CatégorisationEnum, EntitéJuridique } from "../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../../../backend/métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { Wording } from "../../configuration/wording/Wording";
import { GraphiqueViewModel } from "../commun/Graphique/GraphiqueViewModel";
import { StringFormater } from "../commun/StringFormater";
import { NombrePassageAuxUrgencesViewModel } from "./bloc-activité/nombre-passage-urgence/NombrePassageAuxUrgencesViewModel";

export class CatégorisationViewModel {
  constructor(private readonly catégorisation: CatégorisationEnum | null, private readonly wording: Wording) {}

  public get catégorisationWording(): string | null {
    switch (this.catégorisation) {
      case CatégorisationEnum.PRIVE_LUCRATIF:
        return this.wording.PRIVÉ_LUCRATIF;
      case CatégorisationEnum.PRIVE_NON_LUCRATIF:
        return this.wording.PRIVÉ_NON_LUCRATIF;
      case CatégorisationEnum.PUBLIC:
        return this.wording.PUBLIC;
      case CatégorisationEnum.PERSONNE_MORALE_DROIT_ETRANGER:
        return this.wording.PERSONNE_MORALE_DROIT_ÉTRANGER;
      default:
        return null;
    }
  }

  public get catégorisationColour(): string | undefined {
    switch (this.catégorisation) {
      case CatégorisationEnum.PRIVE_LUCRATIF:
        return "green-archipel";
      case CatégorisationEnum.PRIVE_NON_LUCRATIF:
        return "blue-ecume";
      case CatégorisationEnum.PUBLIC:
        return "purple-glycine";
      case CatégorisationEnum.PERSONNE_MORALE_DROIT_ETRANGER:
        return "yellow-moutarde";
      default:
        return undefined;
    }
  }
}

export class EntitéJuridiqueViewModel {
  public catégorisationViewModel: CatégorisationViewModel;
  public entitéJuridiqueViewModel: EntitéJuridiqueActivitésViewModel;

  constructor(private readonly entitéJuridique: EntitéJuridique, private readonly wording: Wording) {
    this.catégorisationViewModel = new CatégorisationViewModel(entitéJuridique.catégorisation, wording);
    this.entitéJuridiqueViewModel = new EntitéJuridiqueActivitésViewModel(entitéJuridique.activités, wording);
  }

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

export class EntitéJuridiqueActivitésViewModel extends GraphiqueViewModel {
  public nombreDePassageAuxUrgencesViewModel: NombrePassageAuxUrgencesViewModel;
  constructor(private readonly entitéJuridiqueActivités: EntitéJuridiqueActivités[], wording: Wording) {
    super(wording);
    this.nombreDePassageAuxUrgencesViewModel = new NombrePassageAuxUrgencesViewModel(entitéJuridiqueActivités, wording);
  }

  public get lesDonnéesActivitéNeSontPasRenseignées(): boolean {
    return !this.activitéEstElleRenseignée;
  }

  public get activitéEstElleRenseignée(): boolean {
    return this.entitéJuridiqueActivités.length > 0;
  }
}
