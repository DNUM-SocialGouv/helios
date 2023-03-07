import Head from "next/head";

import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { Titre } from "../commun/Titre/Titre";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { BlocBudgetFinance } from "./bloc-budget-finance/BlocBudgetFinance";
import { Catégorisation } from "./catégorisation/Catégorisation";
import { EntitéJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { BlocIdentité } from "./fiche-d-identité/BlocIdentité";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./liste-des-établissements/ListeDesÉtablissementsTerritoriauxRattachés";
import LogoEntitéJuridique from "./logo-entité-juridique.svg";
import {ResultatNetComptableViewModel} from "../indicateur-métier/resultat-net-comptable/ResultatNetComptableViewModel";

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

  return (
    <main className="fr-container">
      <Head>
        <title>{entitéJuridiqueViewModel.titre}</title>
      </Head>
      <Catégorisation catégorisationViewModel={entitéJuridiqueViewModel.catégorisationViewModel} />
      <Titre logo={LogoEntitéJuridique}>{entitéJuridiqueViewModel.titre}</Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
      <ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />
      <BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={entitéJuridiqueViewModel.entitéJuridiqueActivitéViewModel} />
      <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueViewModel.entitéJuridiqueBudgetFinanceViewModel}
      />
    </main>
  );
};
