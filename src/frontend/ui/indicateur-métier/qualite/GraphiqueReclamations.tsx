import { memo, useState } from "react";

import { annéesManquantesQualite } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { Transcription } from "../../commun/Transcription/Transcription";
import { ContenuReclamations } from "./ContenuReclamations";
import ReclamationsParAnnee from "./ReclamationsParAnnee/ReclamationsParAnnee";

type GraphiqueReclamationsProps = Readonly<{
  data: any;
  dateMiseAJour: string;
  annéesTotales: number;
}>;

const GraphiqueReclamations = ({ data, dateMiseAJour, annéesTotales }: GraphiqueReclamationsProps) => {
  const { wording } = useDependencies();
  const annees = Object.keys(data).sort((a, b) => a.localeCompare(b)).map(Number);
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(annees[annees.length - 1]);

  const listeAnnéesManquantes = annéesManquantesQualite(annees, annéesTotales);
  const identifiants = ["Nombre total de réclamations concernées", "Nombre de réclamations en cours concernées", "Nombre de réclamations clôturées concernées"];
  const libelles = [
    wording.MOTIF_10,
    wording.MOTIF_11,
    wording.MOTIF_12,
    wording.MOTIF_13,
    wording.MOTIF_14,
    wording.MOTIF_15,
    wording.MOTIF_16,
    wording.MOTIF_17,
    wording.MOTIF_18,
    wording.MOTIF_19,
    wording.MOTIF_155,
    wording.MOTIF_156,
  ]
  const getvalues = () => {
    const totals: any[] = [];
    const encours: any[] = [];
    const clotures: any[] = [];

    for (let index = 0; index < data[annéeEnCours]?.details.length; index++) {
      const motifDetails = data[annéeEnCours]?.details[index];
      encours.push(motifDetails.encours);
      clotures.push(motifDetails.clot);
      totals.push(motifDetails.encours + motifDetails.clot);
    }

    return [totals, encours, clotures];
  }

  return (
    <>
      <IndicateurGraphique
        années={{ liste: annees, setAnnéeEnCours }}
        contenuInfoBulle={
          <ContenuReclamations dateDeMiseÀJour={dateMiseAJour} source={wording.SIREC} />
        }
        dateDeMiseÀJour={dateMiseAJour}
        identifiant={wording.RECLAMATIONS}
        nomDeLIndicateur={wording.RECLAMATIONS}
        source={wording.SIREC}
      >
        <ReclamationsParAnnee
          details={data[annéeEnCours]?.details}
          total_clotures={data[annéeEnCours]?.total_clotures}
          total_encours={data[annéeEnCours]?.total_encours}
        />
      </IndicateurGraphique>
      {listeAnnéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${listeAnnéesManquantes.join(", ")}`}</MiseEnExergue>}
      <Transcription entêteLibellé={wording.RECLAMATIONS} identifiants={identifiants} libellés={libelles} valeurs={getvalues()} />
    </>
  );
};

export default memo(GraphiqueReclamations);
