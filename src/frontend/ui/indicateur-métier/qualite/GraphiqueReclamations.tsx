import { memo, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Transcription } from "../../commun/Transcription/Transcription";
import { ContenuReclamations } from "./ContenuReclamations";
import ReclamationsParAnnee from "./ReclamationsParAnnee/ReclamationsParAnnee";

type GraphiqueReclamationsProps = Readonly<{
  data: any;
  dateMiseAJour: string;
}>;

const GraphiqueReclamations = ({ data, dateMiseAJour }: GraphiqueReclamationsProps) => {
  const { wording } = useDependencies();
  const annees = Object.keys(data).sort().reverse().map(Number);
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(annees[0]);
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

    for (let index = 0; index < data[annéeEnCours].details.length; index++) {
      const motifDetails = data[annéeEnCours].details[index];
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
          details={data[annéeEnCours].details}
          total_clotures={data[annéeEnCours].total_clotures}
          total_encours={data[annéeEnCours].total_encours}
        />
      </IndicateurGraphique>
      <Transcription entêteLibellé={wording.RECLAMATIONS} identifiants={identifiants} libellés={libelles} valeurs={getvalues()} />
    </>
  );
};

export default memo(GraphiqueReclamations);
