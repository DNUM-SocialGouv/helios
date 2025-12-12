import { ChangeEvent, useState } from "react";

import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";
import { NombreDeJournneesPsySsrHistogrammes } from "./NombreDeJournneePsySsrHistogrammes";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { ContenuNombreDeJournéesPSYetSSR } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeJournéesPSYetSSR";

type GraphiquePsySSRProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nombreJournéesPsySSRViewModel: NombreDeJourneesPsySSRViewModel;
  activitéMensuelleViewModel: ActivitesMensuelViewModel;
  estEntitéJuridique?: boolean;
}>;

export function GraphiquePsySSR({ etabTitle, etabFiness, nombreJournéesPsySSRViewModel, activitéMensuelleViewModel, estEntitéJuridique = false }: GraphiquePsySSRProps) {
  const { wording } = useDependencies();
  const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

  const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  }

  const dateDeMiseAJour = (): string => {
    if (selectedFrequency === wording.ANNUEL) {
      return nombreJournéesPsySSRViewModel.dateDeMiseÀJourDuNombreDeJournéesPsyEtSsr;
    } else {
      return activitéMensuelleViewModel.getDateDeMiseAJour();
    }
  }



  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuNombreDeJournéesPSYetSSR
          dateDeMiseÀJour={dateDeMiseAJour()}
          estComparaison={false}
          estEntitéJuridique={estEntitéJuridique}
          source={wording.PMSI}
        />
      }
      dateDeMiseÀJour={dateDeMiseAJour()}
      identifiant="activite-2"
      nomDeLIndicateur={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
      source={wording.PMSI}
    >
      <NombreDeJournneesPsySsrHistogrammes
        activitéMensuelleViewModel={activitéMensuelleViewModel}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        nomGraph={wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR}
        nombreDeJourneePsySsrViewModel={nombreJournéesPsySSRViewModel}
        onFrequencyChange={handleFrequency}
        selectedFrequency={selectedFrequency}
      />
    </IndicateurGraphique>
  );
}
