import { useMemo } from "react";

import { TauxRotationTrimestriel } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import HistogrammeVerticalAvecRef from "../../../../commun/Graphique/HistogrammeVerticalAvecRef";
import { StringFormater } from "../../../../commun/StringFormater";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";

type GraphiqueTauxRotationAnnuelProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  donneesTauxRotationTrimestriels: TauxRotationTrimestriel[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueTauxRotationTrimestriel = ({ etabFiness, etabTitle, nomGraph, donneesTauxRotationTrimestriels, blocVigieRHViewModel }: GraphiqueTauxRotationAnnuelProps) => {
  const { wording } = useDependencies();

  const { libelles, valeurs, valeursRef, valeursManquantes, valeursRefManquantes } = useMemo(() => {
    const libelles = donneesTauxRotationTrimestriels.map((donnee) => `${donnee.annee}-T${donnee.trimestre}`);
    const valeursManquantes: string[] = [];
    const valeursRefManquantes: string[] = [];
    const valeurs = donneesTauxRotationTrimestriels.map((donnee) => {
      const valeur = donnee.rotation;
      if (!Number.isFinite(valeur)) {
        valeursManquantes.push(`${donnee.annee}-T${donnee.trimestre}`);
        return null;
      }
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
      identifiants={[wording.TAUX_ROTATION, wording.TAUX_ROTATION_REFERENCE]}
      libelles={libelles}
      libellesDeValeursDeReferenceManquantes={valeursRefManquantes}
      libellesDeValeursManquantes={valeursManquantes}
      nomGraph={nomGraph}
      tickFormatter={blocVigieRHViewModel.tickFormatter}
      tickX2Formatter={blocVigieRHViewModel.tickX2Formatter}
      type={wording.TRIMESTRIEL}
      valeurs={valeurs}
      valeursRef={valeursRef}
    />
  )
}


export default GraphiqueTauxRotationTrimestriel;
