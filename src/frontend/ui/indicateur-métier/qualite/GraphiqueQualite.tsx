import { memo, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCapacitéParActivités } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuCapacitéParActivités";

import  QualiteParAnnee  from "./QualiteParAnnee/QualiteParAnnee";
 
type GraphiqueQualiteProps = Readonly<{
  data: any;
  estEntitéJuridique?: boolean;
  estSanitaire: boolean;
}>;

const GraphiqueQualite = ({ data, estEntitéJuridique = false }: GraphiqueQualiteProps) => {
  const { wording } = useDependencies();
  const annees = Object.keys(data).sort().reverse().map(Number);
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(annees[0]);

  return (
    <IndicateurGraphique
      années={{ liste: annees, setAnnéeEnCours }}
      contenuInfoBulle={
        <ContenuCapacitéParActivités
          dateDeMiseÀJour={data[annéeEnCours].date_miseAJourSource}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.SIREC}
        />
      }
      dateDeMiseÀJour={data[annéeEnCours].date_miseAJourSource}
      identifiant="capacite-sanitaire"
      nomDeLIndicateur={wording.RECLAMATIONS}
      source={wording.SIREC}
    >

   <QualiteParAnnee
      details={data[annéeEnCours].details}
      total_clotures={data[annéeEnCours].total_clotures}
      total_encours={data[annéeEnCours].total_encours}
   />
  
    </IndicateurGraphique>
  );
};

export default memo(GraphiqueQualite)