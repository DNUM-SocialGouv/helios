import { useMemo } from "react";

import { TauxRotation } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { anneesManquantesVigieRhAnnuel } from "../../../../../utils/dateUtils";
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

  const donneesTauxRotationFiltrees = useMemo(() => {
    const anneeEnCours = new Date().getFullYear();
    const anneesAttendues = new Set([anneeEnCours - 2, anneeEnCours - 1]);
    return donneesTauxRotation.filter((donnee) => anneesAttendues.has(Number(donnee.annee)));
  }, [donneesTauxRotation]);

  const { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes } = useMemo(() => {
    const libelles = donneesTauxRotationFiltrees.map((donnee) => donnee.annee);
    const valeursManquantes = anneesManquantesVigieRhAnnuel(libelles);
    const valeursRefManquantes: (number | string)[] = [];
    const valeurs = donneesTauxRotationFiltrees.map((donnee) => {
      const valeur = donnee.rotation;
      return StringFormater.transformInRoundedRate(valeur);
    });
    const valeursRef = donneesTauxRotationFiltrees.map((donnee) => {
      const valeurRef = donnee.rotationRef;
      if (!Number.isFinite(valeurRef)) {
        valeursRefManquantes.push(donnee.annee);
        return null;
      }
      return StringFormater.transformInRoundedRate(valeurRef);
    });

    return { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes };
  }, [donneesTauxRotationFiltrees]);

  return (
    <HistogrammeVerticalAvecRef
      couleursDeLHistogramme={blocVigieRHViewModel.couleursDeLHistogramme(donneesTauxRotationFiltrees)}
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
