import { useState, ChangeEvent, useCallback } from "react";


import { TauxRotation, TauxRotationTrimestriel } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { FrequencyFilter } from "../FrequencyFilter";
import GraphiqueTauxRotationAnnuel from "./GraphiqueTauxRotationAnnuel";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import GraphiqueTauxRotationTrimestriel from "./GraphiqueTauxRotationTrimestriel";

type GraphiqueTauxRotationProps = Readonly<{
  donneesTauxRotation: TauxRotation[],
  donneesTauxRotationTrimestriels: TauxRotationTrimestriel[],
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueTauxRotation = ({ donneesTauxRotation, donneesTauxRotationTrimestriels, blocVigieRHViewModel }: GraphiqueTauxRotationProps) => {

  const { wording } = useDependencies();

  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

  const handleFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }, []);

  return (
    <div >
      <FrequencyFilter
        ListeFrquences={[wording.ANNUEL, wording.TRIMESTRIEL]}
        handleFrequency={handleFrequency}
        identifiant='frequency-filter-taux-rotation'
        selectedFrequency={selectedFrequency}
      />
      {selectedFrequency === wording.ANNUEL ?
        <GraphiqueTauxRotationAnnuel blocVigieRHViewModel={blocVigieRHViewModel} donneesTauxRotation={donneesTauxRotation} />
        :
        <GraphiqueTauxRotationTrimestriel donneesTauxRotationTrimestriels={donneesTauxRotationTrimestriels} />
      }
    </div>
  );
};

export default GraphiqueTauxRotation;
