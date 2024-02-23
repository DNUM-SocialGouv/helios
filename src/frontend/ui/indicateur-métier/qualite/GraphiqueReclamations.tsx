import { memo, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuReclamations } from "./ContenuReclamations";
import ReclamationsParAnnee from "./ReclamationsParAnnee/ReclamationsParAnnee";

type GraphiqueReclamationsProps = Readonly<{
  data: any;
}>;

const GraphiqueReclamations = ({ data }: GraphiqueReclamationsProps) => {
  const { wording } = useDependencies();
  const annees = Object.keys(data).sort().reverse().map(Number);
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(annees[0]);

  return (
    <IndicateurGraphique
      années={{ liste: annees, setAnnéeEnCours }}
      contenuInfoBulle={
        <ContenuReclamations dateDeMiseÀJour={data[annéeEnCours].dateMiseAJourSource} source={wording.SIREC} />
      }
      dateDeMiseÀJour={data[annéeEnCours].dateMiseAJourSource}
      identifiant={wording.RECLAMATIONS}
      nomDeLIndicateur={wording.RECLAMATIONS}
      source={wording.SIREC}
    >
      <ReclamationsParAnnee
        details={data[annéeEnCours].details}
        total_clotures={data[annéeEnCours].total_clotures}
        total_encours={data[annéeEnCours].total_encours}
      />
    </IndicateurGraphique>
  );
};

export default memo(GraphiqueReclamations);
