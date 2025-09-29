import { useMemo } from "react";

import { TauxRotationTrimestriel } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import HistogrammeVerticalAvecRef from "../../../../commun/Graphique/HistogrammeVerticalAvecRef";
import { StringFormater } from "../../../../commun/StringFormater";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  donneesTauxRotationTrimestriels: TauxRotationTrimestriel[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueTauxRotationTrimestriel = ({ donneesTauxRotationTrimestriels, blocVigieRHViewModel }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();

  const {
    libelles, valeurs, valeursRef
  } = useMemo(() => {
    const libelles = donneesTauxRotationTrimestriels.map(d => `${d.annee}-T${d.trimestre}`);
    const valeurs = donneesTauxRotationTrimestriels.map((donnee) => StringFormater.transformInRoundedRate(donnee.rotation));
    const valeursRef = donneesTauxRotationTrimestriels.map((donnee) => StringFormater.transformInRoundedRate(donnee.rotationRef))

    return { libelles, valeurs, valeursRef };
  }, [donneesTauxRotationTrimestriels]);

  return (
    <HistogrammeVerticalAvecRef
      couleursDeLHistogramme={blocVigieRHViewModel.couleursDeLHistogramme(donneesTauxRotationTrimestriels)}
      libelles={libelles}
      tickFormatter={blocVigieRHViewModel.tickFormatter}
      tickX2Formatter={blocVigieRHViewModel.tickX2Formatter}
      type={wording.TRIMESTRIEL}
      valeurs={valeurs}
      valeursRef={valeursRef}
    />
  )
}


export default GraphiqueTauxRotationTrimestriel;
