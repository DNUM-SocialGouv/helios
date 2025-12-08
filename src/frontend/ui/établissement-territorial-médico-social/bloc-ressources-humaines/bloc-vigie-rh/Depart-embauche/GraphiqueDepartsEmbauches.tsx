import { useState, ChangeEvent, useCallback } from "react";


import { DepartEmbauche } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { FrequencyFilter } from "../FrequencyFilter";
import GraphiqueDepartEmbauchesTrimestriel from "./GraphiqueDepartEmbauchesTrimestriel";
import GraphiqueDepartEmbauchesAnnuel from "./GraphiqueDepartsEmbauchesAnnuel";
import { DepartEmbaucheTrimestrielViewModel } from "../BlocVigieRHViewModel";

type GraphiqueDepartEmbauchesProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  donneesDepartsEmbauches: DepartEmbauche[],
  donneesDepartsEmbauchesTrimestriels: DepartEmbaucheTrimestrielViewModel[]
}>;

const GraphiqueDepartEmbauches = ({ etabFiness, etabTitle, donneesDepartsEmbauches, donneesDepartsEmbauchesTrimestriels }: GraphiqueDepartEmbauchesProps) => {

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
        identifiant='frequency-filter-departs-embauches'
        selectedFrequency={selectedFrequency}
      />
      {selectedFrequency === wording.ANNUEL ?
        <GraphiqueDepartEmbauchesAnnuel
          donneesDepartsEmbauches={donneesDepartsEmbauches}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
        />
        :
        <GraphiqueDepartEmbauchesTrimestriel donneesDepartsEmbauches={donneesDepartsEmbauchesTrimestriels} etabFiness={etabFiness} etabTitle={etabTitle} />
      }
    </div>
  );
};

export default GraphiqueDepartEmbauches;
