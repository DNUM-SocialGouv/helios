import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { AllocationRessourcesViewModel } from "../AllocationRessourcesViewModel";
import { ContenuAllocationRessourcesEJ } from "./ContenuAllocationRessourcesEJ";

type BlocAllocationRessourcesProps = Readonly<{
  allocationRessourcesViewModel: AllocationRessourcesViewModel;
}>;

export function AllocationRessources({ allocationRessourcesViewModel }: BlocAllocationRessourcesProps) {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(allocationRessourcesViewModel.annéeInitiale);

  return (
    <IndicateurGraphique
      années={{ liste: allocationRessourcesViewModel.lesAnnéesEffectivesDuAllocationRessources(), setAnnéeEnCours }}
      contenuInfoBulle={<ContenuAllocationRessourcesEJ dateDeMiseÀJour={allocationRessourcesViewModel.dateMiseÀJour} source={wording.HAPI} />}
      dateDeMiseÀJour={allocationRessourcesViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-allocation-de-resources"
      nomDeLIndicateur={<>{wording.ALLOCATION_DE_RESSOURCES}</>}
      prefixSelect="Compagne"
      source={wording.HAPI}
    >
      {allocationRessourcesViewModel.allocationDeRessource(annéeEnCours)}
    </IndicateurGraphique>
  );
}
