import { useState, ChangeEvent } from "react";


import { DepartEmbauche } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { FrequencyFilter } from "../FrequencyFilter";
import GraphiqueDepartEmbauchesTrimestriel from "./GraphiqueDepartEmbauchesTrimestriel";
import GraphiqueDepartEmbauchesAnnuel from "./GraphiqueDepartsEmbauchesAnnuel";
import { DepartEmbaucheTrimestrielViewModel } from "../BlocVigieRHViewModel";

type GraphiqueDepartEmbauchesProps = Readonly<{
  donneesDepartsEmbauches: DepartEmbauche[],
  donneesDepartsEmbauchesTrimestriels: DepartEmbaucheTrimestrielViewModel[]
}>;

const GraphiqueDepartEmbauches = ({ donneesDepartsEmbauches, donneesDepartsEmbauchesTrimestriels }: GraphiqueDepartEmbauchesProps) => {

  const { wording } = useDependencies();

  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

  const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }

  return (
    <div >
      <FrequencyFilter
        ListeFrquences={[wording.ANNUEL, wording.TRIMESTRIEL]}
        handleFrequency={handleFrequency}
        identifiant='frequency-filter-departs-embauches'
        selectedFrequency={selectedFrequency}
      />
      {selectedFrequency === wording.ANNUEL ?
        <GraphiqueDepartEmbauchesAnnuel
          donneesDepartsEmbauches={donneesDepartsEmbauches}
        />
        :
        <GraphiqueDepartEmbauchesTrimestriel donneesDepartsEmbauches={donneesDepartsEmbauchesTrimestriels} />
      }
    </div>
  );
};

export default GraphiqueDepartEmbauches;
