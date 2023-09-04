import React from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { IndicateurTabulaire } from "../../commun/IndicateurTabulaire/IndicateurTabulaire";
import { ContenuRésultatNetComptable } from "../../établissement-territorial-médico-social/InfoBulle/ContenuRésultatNetComptable";
import { ContenuRésultatNetComptableEJ } from "./ContenuRésultatNetComptableEJ";
import { ResultatNetComptableViewModel } from "./ResultatNetComptableViewModel";

type BlocBudgetFinanceProps = Readonly<{
  resultatNetComptableViewModel: ResultatNetComptableViewModel;
  estEntitéJuridique?: boolean;
}>;

export function ResultatNetComptable({ resultatNetComptableViewModel, estEntitéJuridique = false }: BlocBudgetFinanceProps) {
  const { wording } = useDependencies();
  let infoBulleContenu = <ContenuRésultatNetComptable dateDeMiseÀJour={resultatNetComptableViewModel.dateMiseÀJour} source={wording.CNSA} />;
  let sourceName = wording.CNSA;

  if (estEntitéJuridique) {
    infoBulleContenu = <ContenuRésultatNetComptableEJ dateDeMiseÀJour={resultatNetComptableViewModel.dateMiseÀJour} source={wording.ANCRE} />;
    sourceName = wording.ANCRE;
  }

  return resultatNetComptableViewModel.auMoinsUnResultatNetRenseigné() ? (
    <IndicateurGraphique
      authorized
      contenuInfoBulle={infoBulleContenu}
      dateDeMiseÀJour={resultatNetComptableViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-résultat-net-comptable"
      nomDeLIndicateur={wording.RÉSULTAT_NET_COMPTABLE}
      source={sourceName}
    >
      <IndicateurTabulaire
        annéesManquantes={resultatNetComptableViewModel.lesAnnéesManquantesDuResultatNet()}
        valeursParAnnée={resultatNetComptableViewModel.resultatNetComptable()}
      />
    </IndicateurGraphique>
  ) : null;
}
