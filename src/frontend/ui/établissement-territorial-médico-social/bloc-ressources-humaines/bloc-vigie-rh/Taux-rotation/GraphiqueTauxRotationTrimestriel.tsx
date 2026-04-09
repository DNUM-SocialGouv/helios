import { useMemo } from "react";

import { TauxRotationTrimestriel } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { trimestresManquantsVigieRh } from "../../../../../utils/dateUtils";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import HistogrammeVerticalAvecRef from "../../../../commun/Graphique/HistogrammeVerticalAvecRef";
import StringFormater from "../../../../commun/StringFormater";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  donneesTauxRotationTrimestriels: TauxRotationTrimestriel[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
  showRefValues: boolean;
}>;

const GraphiqueTauxRotationTrimestriel = ({ etabFiness, etabTitle, nomGraph, donneesTauxRotationTrimestriels, blocVigieRHViewModel, showRefValues }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();

  const { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes } = useMemo(() => {
    const libelles = donneesTauxRotationTrimestriels.map((donnee) => `${donnee.annee}-T${donnee.trimestre}`);
    const valeursManquantes = trimestresManquantsVigieRh(libelles, 3)
    const valeursRefManquantes: string[] = [];
    const valeurs = donneesTauxRotationTrimestriels.map((donnee) => {
      const valeur = donnee.rotation;
      return StringFormater.transformInRoundedRate(valeur);
    });
    const valeursRef = donneesTauxRotationTrimestriels.map((donnee) => {
      const valeurRef = donnee.rotationRef;
      if (!Number.isFinite(valeurRef)) {
        valeursRefManquantes.push(`${donnee.annee}-T${donnee.trimestre}`);
        return null;
      }
      return StringFormater.transformInRoundedRate(valeurRef);
    });

    return { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes };
  }, [donneesTauxRotationTrimestriels]);

  return (
    <HistogrammeVerticalAvecRef
      couleursDeLHistogramme={blocVigieRHViewModel.couleursDeLHistogramme(donneesTauxRotationTrimestriels)}
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


export default GraphiqueTauxRotationTrimestriel;
