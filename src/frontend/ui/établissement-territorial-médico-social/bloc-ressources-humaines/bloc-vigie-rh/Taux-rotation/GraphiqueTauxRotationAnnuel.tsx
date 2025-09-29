import { useMemo } from "react";

import { TauxRotation } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import HistogrammeVerticalAvecRef from "../../../../commun/Graphique/HistogrammeVerticalAvecRef";
import { StringFormater } from "../../../../commun/StringFormater";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  donneesTauxRotation: TauxRotation[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueTauxRotationAnnuel = ({ donneesTauxRotation, blocVigieRHViewModel }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();

  const {
    libelles, valeurs, valeursRef
  } = useMemo(() => {
    const libelles = donneesTauxRotation.map(d => d.annee);
    const valeurs = donneesTauxRotation.map((donnee) => StringFormater.transformInRoundedRate(donnee.rotation));
    const valeursRef = donneesTauxRotation.map((donnee) => StringFormater.transformInRoundedRate(donnee.rotationRef))

    return { libelles, valeurs, valeursRef };
  }, [donneesTauxRotation]);

  return (
    <HistogrammeVerticalAvecRef
      couleursDeLHistogramme={blocVigieRHViewModel.couleursDeLHistogramme(donneesTauxRotation)}
      libelles={libelles}
      tickFormatter={blocVigieRHViewModel.tickFormatter}
      tickX2Formatter={blocVigieRHViewModel.tickX2Formatter}
      type={wording.ANNUEL}
      valeurs={valeurs}
      valeursRef={valeursRef}
    />
  )
}

export default GraphiqueTauxRotationAnnuel;
