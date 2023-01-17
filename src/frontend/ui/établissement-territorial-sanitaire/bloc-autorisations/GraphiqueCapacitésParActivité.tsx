import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCapacitéParActivités } from "../InfoBulle/ContenuCapacitéParActivités";
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsViewModel";

type GraphiqueCapacitésParActivitéProps = Readonly<{
  établissementTerritorialSanitaireAutorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel;
}>;
export const GraphiqueCapacitésParActivité = ({ établissementTerritorialSanitaireAutorisationsViewModel }: GraphiqueCapacitésParActivitéProps) => {
  const { wording } = useDependencies();
  const [annéeSelectionnée, setAnnéeSelectionnée] = useState<number>(établissementTerritorialSanitaireAutorisationsViewModel.annéeInitiale);

  return (
    <IndicateurGraphique
      années={établissementTerritorialSanitaireAutorisationsViewModel.listeDéroulanteDesAnnéesDesCapacités(setAnnéeSelectionnée)}
      contenuInfoBulle={
        <ContenuCapacitéParActivités
          dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
          source={wording.SAE}
        />
      }
      dateDeMiseÀJour={établissementTerritorialSanitaireAutorisationsViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
      identifiant="capacite-sanitaire"
      nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
      source={wording.SAE}
    >
      {établissementTerritorialSanitaireAutorisationsViewModel.capacitéParActivités(annéeSelectionnée)}
    </IndicateurGraphique>
  );
};
