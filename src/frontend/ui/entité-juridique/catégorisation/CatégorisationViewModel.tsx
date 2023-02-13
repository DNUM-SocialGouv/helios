import { CatégorisationEnum } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { Wording } from "../../../configuration/wording/Wording";

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
