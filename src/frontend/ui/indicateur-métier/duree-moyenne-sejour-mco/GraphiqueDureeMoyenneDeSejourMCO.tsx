import { ChangeEvent, useState } from "react";

import { DureeMoyenneDeSejourMCOHistogrammes } from "./DureeMoyenneDeSejourMCOHistogrammes";
import { DureeMoyenneSejourMCOViewModel } from "./DureeMoyenneDeSejourMCOViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { ContenuDureeMoyenneDeSejourMCO } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuDureeMoyenneDeSejourMCO";


type GraphiqueDureeMoyenneDeSejourMCOProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  nombreDeSejourMCOViewModel: DureeMoyenneSejourMCOViewModel;
  activitéMensuelleViewModel: ActivitesMensuelViewModel;
  estEntitéJuridique?: boolean;
}>;
export const GraphiqueDureeMoyenneDeSejourMCO = ({ etabFiness, etabTitle, nombreDeSejourMCOViewModel: dureeMoyenneSejourMCOViewModel, activitéMensuelleViewModel }: GraphiqueDureeMoyenneDeSejourMCOProps) => {
  const { wording } = useDependencies();
  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

  const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }

  const dateDeMiseAJour = (): string => {
    if (selectedFrequency === wording.ANNUEL) {
      return dureeMoyenneSejourMCOViewModel.dateDeMiseÀJourDureeMoyenneSejoursMédecineChirurgieObstétrique;
    } else {
      return activitéMensuelleViewModel.getDateDeMiseAJour();
    }
  }

  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuDureeMoyenneDeSejourMCO
          annuel={selectedFrequency === wording.ANNUEL}
          dateDeMiseÀJour={dateDeMiseAJour()}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={dateDeMiseAJour()}
      identifiant="activite-1"
      nomDeLIndicateur={wording.MOYENNE_DE_SEJOUR_MCO}
      source={wording.PMSI}
    >
      <DureeMoyenneDeSejourMCOHistogrammes
        activiteMensuelleViewModel={activitéMensuelleViewModel}
        dureeMoyenneDeSejourMCOViewModel={dureeMoyenneSejourMCOViewModel}
        etabFiness={etabFiness}
        etabtitle={etabTitle}
        onFrequencyChange={handleFrequency}
        selectedFrequency={selectedFrequency}
      />
    </IndicateurGraphique>
  );
};
