import { useState, ChangeEvent, useCallback } from "react";


import { TauxRotation, TauxRotationTrimestriel } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { FrequencyFilter } from "../FrequencyFilter";
import GraphiqueTauxRotationAnnuel from "./GraphiqueTauxRotationAnnuel";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import GraphiqueTauxRotationTrimestriel from "./GraphiqueTauxRotationTrimestriel";

type GraphiqueTauxRotationProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nomGraph: string;
  donneesTauxRotation: TauxRotation[],
  donneesTauxRotationTrimestriels: TauxRotationTrimestriel[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
  showRefValues: boolean;
}>;

const GraphiqueTauxRotation = ({ etabFiness, etabTitle, nomGraph, donneesTauxRotation, donneesTauxRotationTrimestriels, blocVigieRHViewModel, showRefValues }: GraphiqueTauxRotationProps) => {

  const { wording } = useDependencies();

  const [selectedFrequency, setSelectedFrequency] = useState(wording.TRIMESTRIEL);

  const handleFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }, []);

  return (
    <div >
      <FrequencyFilter
        ListeFrquences={[wording.TRIMESTRIEL, wording.ANNUEL]}
        handleFrequency={handleFrequency}
        identifiant='frequency-filter-taux-rotation'
        selectedFrequency={selectedFrequency}
      />
      {selectedFrequency === wording.ANNUEL ?
        <GraphiqueTauxRotationAnnuel blocVigieRHViewModel={blocVigieRHViewModel} donneesTauxRotation={donneesTauxRotation} etabFiness={etabFiness} etabTitle={etabTitle} nomGraph={nomGraph} showRefValues={showRefValues} />
        :
        <GraphiqueTauxRotationTrimestriel blocVigieRHViewModel={blocVigieRHViewModel} donneesTauxRotationTrimestriels={donneesTauxRotationTrimestriels} etabFiness={etabFiness} etabTitle={etabTitle} nomGraph={nomGraph} showRefValues={showRefValues} />
      }
    </div>
  );
};

export default GraphiqueTauxRotation;
