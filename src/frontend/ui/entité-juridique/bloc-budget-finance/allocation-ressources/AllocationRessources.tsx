import { ReactElement, useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { AllocationRessourcesViewModel } from "../AllocationRessourcesViewModel";
import { ContenuAllocationRessourcesEJ } from "./ContenuAllocationRessourcesEJ";

type BlocAllocationRessourcesProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  allocationRessourcesViewModel: AllocationRessourcesViewModel;
}>;

export function AllocationRessources({ etabFiness, etabTitle, allocationRessourcesViewModel }: BlocAllocationRessourcesProps) {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(allocationRessourcesViewModel.annéeInitiale);

  const source = (): ReactElement => {
    return annéeEnCours < 2025 ? wording.HAPI : wording.STARS_FIR;
  }

  return (
    <IndicateurGraphique
      années={{ liste: allocationRessourcesViewModel.lesAnnéesEffectivesDuAllocationRessources(), setAnnéeEnCours }}
      contenuInfoBulle={<ContenuAllocationRessourcesEJ comparaison={false} dateDeMiseÀJour={allocationRessourcesViewModel.dateMiseÀJour} source={source()} />}
      dateDeMiseÀJour={allocationRessourcesViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-allocation-de-resources"
      nomDeLIndicateur={<>{wording.ALLOCATION_DE_RESSOURCES}</>}
      prefixSelect="Campagne"
      source={source()}
    >
      {allocationRessourcesViewModel.allocationDeRessource(etabFiness, etabTitle, annéeEnCours)}
    </IndicateurGraphique>
  );
}
