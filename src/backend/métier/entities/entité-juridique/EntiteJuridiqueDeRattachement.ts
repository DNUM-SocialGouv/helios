import { CatégorisationEnum } from "./EntitéJuridique";

export type EntiteJuridiqueDeRattachement = Readonly<{
  statutJuridique: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  raisonSocialeDeLEntitéDeRattachement: Readonly<{
    dateMiseÀJourSource: string;
    value: string;
  }>;
  categorisationDeLEntitéDeRattachement: Readonly<{
    dateMiseÀJourSource: string;
    value: CatégorisationEnum;
  }>;
}>;
