import Head from "next/head";

import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { BlocAutorisationsCapacites } from "./bloc-autorisations-capacites/BlocAutorisationsCapacites";
import { BlocBudgetFinance } from "./bloc-budget-finance/BlocBudgetFinance";
import { BlocQualité } from "./bloc-qualite/BlocQualite";
import { Catégorisation } from "./catégorisation/Catégorisation";
import { EntitéJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { BlocIdentité } from "./fiche-d-identité/BlocIdentité";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./liste-des-établissements/ListeDesÉtablissementsTerritoriauxRattachés";
import LogoEntitéJuridique from "./logo-entité-juridique.svg";

type EntitéJuridiqueProps = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel;
  établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel, rechercheViewModel, établissementsTerritoriauxRattachésViewModels }: EntitéJuridiqueProps) => {
  useBreadcrumb([
    {
      label: entitéJuridiqueViewModel.titreAccessible,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{entitéJuridiqueViewModel.titre}</title>
      </Head>
      <>
        <Catégorisation catégorisationViewModel={entitéJuridiqueViewModel.catégorisationViewModel} />
        <Titre logo={LogoEntitéJuridique} rechercheViewModel={rechercheViewModel}>{entitéJuridiqueViewModel.titre}</Titre>
        <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
        <ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />
        <BlocAutorisationsCapacites entitéJuridiqueAutorisationsCapacitesViewModel={entitéJuridiqueViewModel.entitéJuridiqueAutorisationsCapacitesViewModel} />
        <BlocQualité entitéJuridiqueAutorisationsCapacitesViewModel={entitéJuridiqueViewModel.entitéJuridiqueAutorisationsCapacitesViewModel} />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={entitéJuridiqueViewModel.entitéJuridiqueActivitéViewModel} />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueViewModel.entitéJuridiqueBudgetFinanceViewModel} />
      </>
    </main>
  );
};
