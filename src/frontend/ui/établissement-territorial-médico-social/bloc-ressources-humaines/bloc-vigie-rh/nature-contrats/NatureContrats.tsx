import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import { FrequencyFilter } from "../FrequencyFilter";

import { ChangeEvent, useCallback, useState } from "react";

import {
  NatureContratsAnnuel,
  NatureContratsTrimestriel,
} from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";


type GraphiqueNatureContratsProps = Readonly<{
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

const GraphiqueNatureContrats = ({blocVigieRhViewModel} : GraphiqueNatureContratsProps) =>{
  const {wording} = useDependencies();
  const [selectedFrequency,setSelectedFrequency] = useState(wording.ANNUEL);
  const handleFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }, []);
  return (
    <div>
      <FrequencyFilter ListeFrquences={[wording.ANNUEL,wording.TRIMESTRIEL]}
                       handleFrequency={handleFrequency}
                       identifiant="frequency-filter-nature-contrats"
                       selectedFrequency={selectedFrequency}
      />
      {selectedFrequency === wording.ANNUEL ?
        <GraphiqueNatureContratsAnnuel donnees={[]} />
        :
        <GraphiqueNatureContratsTrimestriel donnees={[]} />
      }
    </div>
  );
}

type GraphiqueNatureContratsAnnuelProps = Readonly<{
  donnees: NatureContratsAnnuel[];
}>;

type GraphiqueNatureContratsTrimestrielProps = Readonly<{
  donnees: NatureContratsTrimestriel[];
}>;

const GraphiqueNatureContratsAnnuel = ({donnees}: GraphiqueNatureContratsAnnuelProps) => {
  return <HistogrammeComparaisonVerticalAvecRef donnees={donnees} />
}

const GraphiqueNatureContratsTrimestriel = ({donnees}: GraphiqueNatureContratsTrimestrielProps) => {
  return <HistogrammeComparaisonVerticalAvecRef donnees={donnees} />
}

type HistogrammeComparaisonVerticalAvecRefProps = Readonly<{
  donnees: any;
}>;

const HistogrammeComparaisonVerticalAvecRef = ({donnees}: HistogrammeComparaisonVerticalAvecRefProps) => {
  return <div>histogramme</div>;
}

export default GraphiqueNatureContrats;
