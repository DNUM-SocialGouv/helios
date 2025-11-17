import { ChangeEvent, useState } from "react";

import { NombreDeSejourMCOHistogrammes } from "./NombreDeSejourMCOHistogrammes";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { ContenuNombreDeSéjourMCO } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeSéjourMCO";


type GraphiqueNombreDeSejourMCOProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  activitéMensuelleViewModel: ActivitesMensuelViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueNombreDeSejourMCO = ({ etabTitle, etabFiness, nombreDeSejourMCOViewModel, activitéMensuelleViewModel, estEntitéJuridique = false }: GraphiqueNombreDeSejourMCOProps) => {
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
          estComparaison={false}
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
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        nomGraph={wording.NOMBRE_DE_SÉJOUR_MCO}
        nombreDeSejourMCOViewModel={nombreDeSejourMCOViewModel}
        onFrequencyChange={handleFrequency}
        selectedFrequency={selectedFrequency}
      />
    </IndicateurGraphique>
  );
};
