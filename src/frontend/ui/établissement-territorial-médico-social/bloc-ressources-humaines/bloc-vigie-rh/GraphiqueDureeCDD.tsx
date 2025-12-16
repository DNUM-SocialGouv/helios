import { useMemo } from "react";

import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune } from "../../../commun/Graphique/couleursGraphique";
import HistogrammeHorizontalAvecRef from "../../../commun/Graphique/HistogrammeHorizontalAvecRef";

type GraphiqueDureeCDDProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  blocVigieRHViewModel: BlocVigieRHViewModel;
  showRefValues: boolean;
}>;

const GraphiqueDureeCDD = ({ etabFiness, etabTitle, nomGraph, blocVigieRHViewModel, showRefValues }: GraphiqueDureeCDDProps) => {

  const { wording } = useDependencies();

  const {
    donneesEffectifs, donneesEffectifsRef, lesDureesQuiManquentDeRef, couleursDeLHistogramme
  } = useMemo(() => {
    const donneesEffectifs = blocVigieRHViewModel.lesDureesCdd.map(d => d.effectif);
    const donneesEffectifsRef = blocVigieRHViewModel.lesDureesCdd.map(d => d.effectifRef);
    const lesDureesQuiManquentDeRef = blocVigieRHViewModel.lesDureesCdd.filter((duree) => duree.effectifRef === null)
      .map((dureeRefManquantes) => dureeRefManquantes.dureeLibelle);
    const couleursDeLHistogramme = blocVigieRHViewModel.lesDureesCdd.map(() => {
      return {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      };
    })
    return { donneesEffectifs, donneesEffectifsRef, lesDureesQuiManquentDeRef, couleursDeLHistogramme };
  }, [blocVigieRHViewModel.lesDureesCdd]);

  const transcriptionIdentifiants = showRefValues ? [wording.DUREE_CDD, wording.DUREE_CDD_REF] : [wording.DUREE_CDD];

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={couleursDeLHistogramme}
      enteteLibelle={wording.DUREE}
      epaisseur="EPAIS"
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      identifiants={transcriptionIdentifiants}
      libelles={blocVigieRHViewModel.lesLibellesDureeCdd}
      nomGraph={nomGraph}
      refsManquants={lesDureesQuiManquentDeRef}
      refsManquantsTitre={wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE}
      showRefValues={showRefValues}
      valeursDesHistogrammes={donneesEffectifs}
      valeursDesHistogrammesRef={donneesEffectifsRef}
    />
  );
};

export default GraphiqueDureeCDD;
