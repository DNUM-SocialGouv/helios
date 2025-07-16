import { ChangeEvent, useState } from "react";

import { NombreDeSejourMCOHistogrammes } from "./NombreDeSejourMCOHistogrammes";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { ContenuNombreDeSéjourMCO } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeSéjourMCO";


type GraphiqueNombreDeSejourMCOProps = Readonly<{
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombreDeSejourMCO = ({ nombreDeSejourMCOViewModel, activitéMensuelleViewModel, estEntitéJuridique = false }: GraphiqueNombreDeSejourMCOProps) => {
  const { wording } = useDependencies();
  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

  const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }

  const dateDeMiseAJour = (): string => {
    if (selectedFrequency === wording.ANNUEL) {
      return nombreDeSejourMCOViewModel.dateDeMiseÀJourDuNombreDeSéjoursMédecineChirurgieObstétrique;
    } else {
      return activitéMensuelleViewModel.getDateDeMiseAJour();
    }
  }

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeSéjourMCO
          dateDeMiseÀJour={dateDeMiseAJour()}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={dateDeMiseAJour()}
      identifiant="activite-0"
      nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
      source={wording.PMSI}
    >
      <NombreDeSejourMCOHistogrammes
        activitéMensuelleViewModel={activitéMensuelleViewModel}
        nombreDeSejourMCOViewModel={nombreDeSejourMCOViewModel}
        onFrequencyChange={handleFrequency}
        selectedFrequency={selectedFrequency}
      />
    </IndicateurGraphique>
  );
};
