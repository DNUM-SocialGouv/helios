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

  const { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes } = useMemo(() => {
    const libelles = donneesTauxRotation.map((donnee) => donnee.annee);
    const valeursManquantes: (number | string)[] = [];
    const valeursRefManquantes: (number | string)[] = [];
    const valeurs = donneesTauxRotation.map((donnee) => {
      const valeur = donnee.rotation;
      if (!Number.isFinite(valeur)) {
        valeursManquantes.push(donnee.annee);
        return null;
      }
      return StringFormater.transformInRoundedRate(valeur);
    });
    const valeursRef = donneesTauxRotation.map((donnee) => {
      const valeurRef = donnee.rotationRef;
      if (!Number.isFinite(valeurRef)) {
        valeursRefManquantes.push(donnee.annee);
        return null;
      }
      return StringFormater.transformInRoundedRate(valeurRef);
    });

    return { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes };
  }, [donneesTauxRotation]);

  return (
    <HistogrammeVerticalAvecRef
      couleursDeLHistogramme={blocVigieRHViewModel.couleursDeLHistogramme(donneesTauxRotation)}
      identifiants={[wording.TAUX_ROTATION, wording.TAUX_ROTATION_REFERENCE]}
      libelles={libelles}
      libellesDeValeursDeReferenceManquantes={valeursRefManquantes}
      libellesDeValeursManquantes={valeursManquantes}
      tickFormatter={blocVigieRHViewModel.tickFormatter}
      tickX2Formatter={blocVigieRHViewModel.tickX2Formatter}
      type={wording.ANNUEL}
      valeurs={valeurs}
      valeursRef={valeursRef}
    />
  )
}

export default GraphiqueTauxRotationAnnuel;
