import { EntitéJuridiqueActivités } from "./EntitéJuridiqueActivités";
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
  catégorisation: CatégorisationEnum;
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
};

export type EntitéJuridique = EntitéJuridiqueIdentité &
  Readonly<{
    activités: EntitéJuridiqueActivités[];
    budgetFinance: EntitéJuridiqueBudgetFinance[];
  }>;

export enum CatégorisationEnum {
  PUBLIC = "public",
  PRIVE_NON_LUCRATIF = "prive_non_lucratif",
  PRIVE_LUCRATIF = "prive_lucratif",
  PERSONNE_MORALE_DROIT_ETRANGER = "personne_morale_droit_etranger",
}
