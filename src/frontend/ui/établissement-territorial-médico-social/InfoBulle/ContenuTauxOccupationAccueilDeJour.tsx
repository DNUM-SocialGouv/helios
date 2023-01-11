import { ReactElement } from "react";

import { ContenuDuTauxOccupation } from "./ContenuDuTauxOccupation";

type ContenuDuTauxOccupationEnAccueilDeJourProps = Readonly<{
  dateDeMiseÀJour: string;
  source: ReactElement;
}>;

export const ContenuTauxOccupationAccueilDeJour = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationEnAccueilDeJourProps) => {
  return <ContenuDuTauxOccupation dateDeMiseÀJour={dateDeMiseÀJour} source={source} />;
};
