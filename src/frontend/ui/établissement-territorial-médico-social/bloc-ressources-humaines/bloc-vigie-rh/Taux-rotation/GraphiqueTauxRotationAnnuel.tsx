import { useMemo } from "react";

import { TauxRotation } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { annéesManquantesVigieRh } from "../../../../../utils/dateUtils";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import HistogrammeVerticalAvecRef from "../../../../commun/Graphique/HistogrammeVerticalAvecRef";
import StringFormater from "../../../../commun/StringFormater";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  donneesTauxRotation: TauxRotation[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
  showRefValues: boolean;
}>;

const GraphiqueTauxRotationAnnuel = ({ etabFiness, etabTitle, nomGraph, donneesTauxRotation, blocVigieRHViewModel, showRefValues }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();

  const { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes } = useMemo(() => {
    const libelles = donneesTauxRotation.map((donnee) => donnee.annee);
    const valeursManquantes = annéesManquantesVigieRh(libelles, 3);
    const valeursRefManquantes: (number | string)[] = [];
    const valeurs = donneesTauxRotation.map((donnee) => {
      const valeur = donnee.rotation;
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
      etabFiness={etabFiness}
      etabTitle={etabTitle}
      identifiants={showRefValues ? [wording.TAUX_ROTATION, wording.TAUX_ROTATION_REFERENCE] : [wording.TAUX_ROTATION]}
      libelles={libelles}
      libellesDeValeursDeReferenceManquantes={valeursRefManquantes}
      libellesDeValeursManquantes={valeursManquantes}
      nomGraph={nomGraph}
      showRefValues={showRefValues}
      valeurs={valeurs}
      valeursRef={valeursRef}
    />
  )
}

export default GraphiqueTauxRotationAnnuel;
