import { useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammesHorizontaux } from "../../../commun/Graphique/HistogrammesHorizontaux";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";
import { ContenuAllocationRessourcesEJ } from "./ContenuAllocationRessourcesEJ";

type BlocAllocationRessourcesProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

export function AllocationRessources({ entitéJuridiqueBudgetFinanceViewModel }: BlocAllocationRessourcesProps) {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(entitéJuridiqueBudgetFinanceViewModel.annéeInitiale);
  console.log('annéeEnCours :::::', annéeEnCours)
  const allocationRessources = entitéJuridiqueBudgetFinanceViewModel.allocationRessourcesEnCours(annéeEnCours);
  const allocationRessourcesGroubByEnveloppe = entitéJuridiqueBudgetFinanceViewModel.allocationRessourcesEnCoursGroubByEnveloppe(annéeEnCours);
  const allocationRessourcesGroubByEnveloppeSousEnvelopeETMode = entitéJuridiqueBudgetFinanceViewModel.allocationRessourcesEnCoursGroubByEnveloppeSousEnvelopeETMode(annéeEnCours);

  console.log('11144447777', allocationRessourcesGroubByEnveloppeSousEnvelopeETMode)
  

  return (
    <IndicateurGraphique
      années={{ liste: entitéJuridiqueBudgetFinanceViewModel.lesAnnéesEffectivesDuCompteDeRésultat(), setAnnéeEnCours }}
      contenuInfoBulle={<ContenuAllocationRessourcesEJ dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour} source={wording.HAPI} />}
      dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-allocation-de-resources"
      nomDeLIndicateur={<>{wording.ALLOCATION_DE_RESSOURCES}</>}
      prefixSelect="Compagne"
      source={wording.HAPI}
    >
      {entitéJuridiqueBudgetFinanceViewModel.allocationDeRessource(annéeEnCours)}
    </IndicateurGraphique>
  );
}
