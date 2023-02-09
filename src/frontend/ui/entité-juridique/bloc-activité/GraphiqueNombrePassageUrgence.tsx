import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuNombreDePassagesAuxUrgences } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDePassagesAuxUrgences";

type GraphiqueNombrePassageUrgenceProps = Readonly<{
  dateMiseAJour: string;
  nombreDePassagesAuxUrgences: ReactElement;
}>;
export const GraphiqueNombrePassageUrgence = ({ dateMiseAJour, nombreDePassagesAuxUrgences }: GraphiqueNombrePassageUrgenceProps) => {
  const { wording } = useDependencies();

  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuNombreDePassagesAuxUrgences dateDeMiseÀJour={dateMiseAJour} source={wording.RPU} />}
      dateDeMiseÀJour={dateMiseAJour}
      identifiant="activite-2"
      nomDeLIndicateur={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
      source={wording.RPU}
    >
      {nombreDePassagesAuxUrgences}
    </IndicateurGraphique>
  );
};
