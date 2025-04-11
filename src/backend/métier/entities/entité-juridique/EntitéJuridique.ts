import { ActivitesSanitaireMensuel } from "../ActivitesSanitaireMensuel";
import { AllocationRessource } from "../AllocationRessource";
import { EntitéJuridiqueActivités } from "./EntitéJuridiqueActivités";
import { EntitéJuridiqueAutorisationEtCapacité } from "./EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "./EntitéJuridiqueBudgetFinance";

export type EntitéJuridiqueIdentité = {
  adresseAcheminement: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  adresseNuméroVoie: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  adresseTypeVoie: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  adresseVoie: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  catégorisation: CatégorisationEnum | string;
  libelléStatutJuridique: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  numéroFinessEntitéJuridique: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  raisonSociale: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  raisonSocialeCourte: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  siren: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  téléphone: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  dateOuverture: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  codeRegion: string;
};

export type EntitéJuridique = EntitéJuridiqueIdentité &
  Readonly<{
    activités: EntitéJuridiqueActivités[];
    activitésMensuels: ActivitesSanitaireMensuel;
    budgetFinance: EntitéJuridiqueBudgetFinance[];
    autorisationsEtCapacites: EntitéJuridiqueAutorisationEtCapacité;
    allocationRessource: AllocationRessource;
  }>;

export enum CatégorisationEnum {
  PUBLIC = "public",
  PRIVE_NON_LUCRATIF = "prive_non_lucratif",
  PRIVE_LUCRATIF = "prive_lucratif",
  PERSONNE_MORALE_DROIT_ETRANGER = "personne_morale_droit_etranger",
}

export function catégorisationEnumToString(value: CatégorisationEnum): string {
  switch (value) {
    case CatégorisationEnum.PERSONNE_MORALE_DROIT_ETRANGER:
      return "Personne morale de droit étranger";
    case CatégorisationEnum.PRIVE_LUCRATIF:
      return "Privé à but lucratif";
    case CatégorisationEnum.PRIVE_NON_LUCRATIF:
      return "Privé à but non lucratif";
    case CatégorisationEnum.PUBLIC:
      return "Public";
    default:
      return "Catégorie inconnue";
  }
}
