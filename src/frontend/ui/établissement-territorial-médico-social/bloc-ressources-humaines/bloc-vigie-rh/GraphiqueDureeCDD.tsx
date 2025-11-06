import { useMemo } from "react";

import { BlocVigieRHViewModel } from "./BlocVigieRHViewModel";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { couleurDuFondHistogrammeJaune, couleurExtensionHistogrammeJaune } from "../../../commun/Graphique/couleursGraphique";
import HistogrammeHorizontalAvecRef from "../../../commun/Graphique/HistogrammeHorizontalAvecRef";

type GraphiqueDureeCDDProps = Readonly<{
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueDureeCDD = ({ blocVigieRHViewModel }: GraphiqueDureeCDDProps) => {

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

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={couleursDeLHistogramme}
      enteteLibelle={wording.DUREE}
      identifiants={[wording.DUREE_CDD, wording.DUREE_CDD_REF]}
      libelles={blocVigieRHViewModel.lesLibellesDureeCdd}
      refsManquants={lesDureesQuiManquentDeRef}
      refsManquantsTitre={wording.AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE}
      valeursDesHistogrammes={donneesEffectifs}
      valeursDesHistogrammesRef={donneesEffectifsRef}
    />
  );
};

export default GraphiqueDureeCDD;
