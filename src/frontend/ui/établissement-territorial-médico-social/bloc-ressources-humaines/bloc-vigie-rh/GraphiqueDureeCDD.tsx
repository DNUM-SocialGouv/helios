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
    donneesEffectifs, donneesEffectifsRef, lesDureesQuiManquentDeRef
  } = useMemo(() => {
    const donneesEffectifs = blocVigieRHViewModel.lesDureesCdd.map(d => d.effectif);
    const donneesEffectifsRef = blocVigieRHViewModel.lesDureesCdd.map(d => d.effectifRef);
    const lesDureesQuiManquentDeRef = blocVigieRHViewModel.lesDureesCdd.filter((duree) => duree.effectifRef === null)
      .map((dureeRefManquantes) => dureeRefManquantes.dureeLibelle)
    return { donneesEffectifs, donneesEffectifsRef, lesDureesQuiManquentDeRef };
  }, [blocVigieRHViewModel.lesDureesCdd]);

  return (
    <HistogrammeHorizontalAvecRef
      couleursDeLHistogramme={[{
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },
      {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },
      {
        premierPlan: couleurDuFondHistogrammeJaune,
        secondPlan: couleurExtensionHistogrammeJaune,
      },]}
      enteteLibelle={wording.DUREE}
      identifiants={[wording.DUREE_CDD, wording.DUREE_CDD_REF]}
      libelles={blocVigieRHViewModel.lesLibellesDureeCdd}
      refsManquants={lesDureesQuiManquentDeRef}
      refsManquantsTitre='Aucune donnée de référence pour les durées:'
      valeursDesHistogrammes={donneesEffectifs}
      valeursDesHistogrammesRef={donneesEffectifsRef}
    />
  );
};

export default GraphiqueDureeCDD;
