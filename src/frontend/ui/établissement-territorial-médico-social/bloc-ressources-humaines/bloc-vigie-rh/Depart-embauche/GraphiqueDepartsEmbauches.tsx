import { useState, ChangeEvent } from "react";


import { DepartEmbauche } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { FrequencyFilter } from "../FrequencyFilter";
import GraphiqueDepartEmbauchesAnnuel from "./GraphiqueDepartsEmbauchesAnnuel";

type GraphiqueDepartEmbauchesProps = Readonly<{
  donneesDepartsEmbauches: DepartEmbauche[]
}>;

const GraphiqueDepartEmbauches = ({ donneesDepartsEmbauches }: GraphiqueDepartEmbauchesProps) => {

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
        <div> graphique Trimestriel</div>
      }
    </div>
  );
};

export default GraphiqueDepartEmbauches;
