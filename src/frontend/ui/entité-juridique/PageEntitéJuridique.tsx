import Head from "next/head";
import { useState, useEffect } from "react";

import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { useRecherche } from "../home/useRecherche";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { BlocAutorisationsCapacites } from "./bloc-autorisations-capacites/BlocAutorisationsCapacites";
import { BlocBudgetFinance } from "./bloc-budget-finance/BlocBudgetFinance";
import { Catégorisation } from "./catégorisation/Catégorisation";
import { EntitéJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { BlocIdentité } from "./fiche-d-identité/BlocIdentité";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./liste-des-établissements/ListeDesÉtablissementsTerritoriauxRattachés";
import LogoEntitéJuridique from "./logo-entité-juridique.svg";

type EntitéJuridiqueProps = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel;
  établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;
}>;

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel, établissementsTerritoriauxRattachésViewModels }: EntitéJuridiqueProps) => {
  useBreadcrumb([
    {
      label: entitéJuridiqueViewModel.titreAccessible,
      path: "",
    },
  ]);

  const { rechercher, résultats } = useRecherche();
  const [rechercheViewModel, setRechercheViewModel] = useState<RechercheViewModel>();

  useEffect(() => {
    rechercher(entitéJuridiqueViewModel.numéroFiness, 1);
  }, [])

  useEffect(() => {
    setRechercheViewModel(résultats[0] as RechercheViewModel);
  }, [résultats])
  return (
    <main className="fr-container">
      <Head>
        <title>{entitéJuridiqueViewModel.titre}</title>
      </Head>
      {rechercheViewModel && (
        <>
          <Catégorisation catégorisationViewModel={entitéJuridiqueViewModel.catégorisationViewModel} />
          <Titre logo={LogoEntitéJuridique} rechercheViewModel={rechercheViewModel}>{entitéJuridiqueViewModel.titre}</Titre>
          <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
          <ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />
          <BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={entitéJuridiqueViewModel.entitéJuridiqueAutorisationsCapacitesViewModel} />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={entitéJuridiqueViewModel.entitéJuridiqueActivitéViewModel} />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueViewModel.entitéJuridiqueBudgetFinanceViewModel} />
        </>
      )}
    </main>
  );
};
