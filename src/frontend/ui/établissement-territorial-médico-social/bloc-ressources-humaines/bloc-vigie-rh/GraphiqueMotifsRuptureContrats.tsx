import { useMemo } from "react";

import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune } from "../../../commun/Graphique/couleursGraphique";
import HistogrammeHorizontalAvecRef from "../../../commun/Graphique/HistogrammeHorizontalAvecRef";

type GraphiqueMotifsRuptureContratsProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  blocVigieRHViewModel: BlocVigieRHViewModel;
  showRefValues: boolean;
}>;

const GraphiqueMotifsRuptureContrats = ({ etabFiness, etabTitle, nomGraph, blocVigieRHViewModel, showRefValues }: GraphiqueMotifsRuptureContratsProps) => {

  const { wording } = useDependencies();

  const {
    donneesEffectifs, donneesEffectifsRef, lesMotifsQuiManquentDeRef, couleursDeLHistogramme
  } = useMemo(() => {
    const donneesEffectifs = blocVigieRHViewModel.lesMotifsRuptureContrat.map(d => d.effectif);
    const donneesEffectifsRef = blocVigieRHViewModel.lesMotifsRuptureContrat.map(d => d.effectifRef);
    const lesMotifsQuiManquentDeRef = blocVigieRHViewModel.lesMotifsRuptureContrat.filter((motif) => motif.effectifRef === null)
      .map((motifRefManquant) => motifRefManquant.motifLibelle);
    const couleursDeLHistogramme = blocVigieRHViewModel.lesMotifsRuptureContrat.map(() => {
      return {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      };
    })
    return { donneesEffectifs, donneesEffectifsRef, lesMotifsQuiManquentDeRef, couleursDeLHistogramme };
  }, [blocVigieRHViewModel.lesDureesCdd]);

  const transcriptionIdentifiants = showRefValues ? [wording.MOTIFS_RUPTURE_CONTRAT, wording.MOTIFS_RUPTURE_CONTRAT_REF] : [wording.MOTIFS_RUPTURE_CONTRAT];

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={couleursDeLHistogramme}
      enteteLibelle={wording.MOTIF}
      epaisseur="FIN"
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      identifiants={transcriptionIdentifiants}
      libelles={blocVigieRHViewModel.lesLibellesMotifsRupture}
      nomGraph={nomGraph}
      refsManquants={lesMotifsQuiManquentDeRef}
      refsManquantsTitre={wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE}
      showRefValues={showRefValues}
      valeursDesHistogrammes={donneesEffectifs}
      valeursDesHistogrammesRef={donneesEffectifsRef}
    />
  );
};

export default GraphiqueMotifsRuptureContrats;
