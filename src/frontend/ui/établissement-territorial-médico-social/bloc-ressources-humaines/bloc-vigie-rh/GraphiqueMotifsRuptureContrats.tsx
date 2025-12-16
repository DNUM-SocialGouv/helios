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
}>;

const GraphiqueMotifsRuptureContrats = ({ etabFiness, etabTitle, nomGraph, blocVigieRHViewModel }: GraphiqueMotifsRuptureContratsProps) => {

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

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={couleursDeLHistogramme}
      enteteLibelle={wording.MOTIF}
      epaisseur="FIN"
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      identifiants={[wording.MOTIFS_RUPTURE_CONTRAT, wording.MOTIFS_RUPTURE_CONTRAT_REF]}
      libelles={blocVigieRHViewModel.lesLibellesMotifsRupture}
      nomGraph={nomGraph}
      refsManquants={lesMotifsQuiManquentDeRef}
      refsManquantsTitre={wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE}
      valeursDesHistogrammes={donneesEffectifs}
      valeursDesHistogrammesRef={donneesEffectifsRef}
    />
  );
};

export default GraphiqueMotifsRuptureContrats;
