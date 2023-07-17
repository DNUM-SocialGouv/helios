import Head from "next/head";
import { useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { useRecherche } from "../home/useRecherche";
import { BlocActivitéMédicoSocial } from "./bloc-activité/BlocActivitéMédicoSocial";
import { BlocAutorisationEtCapacitéMédicoSocial } from "./bloc-autorisations/BlocAutorisationEtCapacitéMédicoSocial";
import { BlocBudgetEtFinancesMédicoSocial } from "./bloc-budget-et-finances/BlocBudgetEtFinancesMédicoSocial";
import { BlocIdentitéMédicoSocial } from "./bloc-identité/BlocIdentitéMédicoSocial";
import { BlocRessourcesHumainesMédicoSocial } from "./bloc-ressources-humaines/BlocRessourcesHumainesMédicoSocial";
import LogoÉtablissementTerritorial from "./logo-établissement-territorial-médico-social.svg";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "./ÉtablissementTerritorialMédicoSocialViewModel";

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialMédicoSocialViewModel;
}>;

export const PageÉtablissementTerritorialMédicoSocial = ({ établissementTerritorialViewModel }: ÉtablissementTerritorialProps) => {
  const { paths } = useDependencies();
  const { rechercher, résultats } = useRecherche();
  const [rechercheViewModel, setRechercheViewModel] = useState<RechercheViewModel>();

  useEffect(() => {
    rechercher(établissementTerritorialViewModel.numéroFinessEntitéJuridiqueBrut, 1);
  }, [])

  useEffect(() => {
    setRechercheViewModel(résultats[0] as RechercheViewModel);
  }, [résultats])

  useBreadcrumb([
    {
      label: établissementTerritorialViewModel.titreAccessibleDeLEntitéJuridique,
      path: `${paths.ENTITÉ_JURIDIQUE}/${établissementTerritorialViewModel.numéroFinessEntitéJuridiqueBrut}`,
    },
    {
      label: établissementTerritorialViewModel.identitéViewModel.nomCourtDeLÉtablissementTerritorial,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{établissementTerritorialViewModel.titre}</title>
      </Head>
      {rechercheViewModel && (
        <>
          <Titre logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>{établissementTerritorialViewModel.titre}</Titre>
          <BlocIdentitéMédicoSocial établissementTerritorialIdentitéMédicoSocialViewModel={établissementTerritorialViewModel.identitéViewModel} />
          <BlocAutorisationEtCapacitéMédicoSocial
            établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialViewModel.autorisationsViewModel}
          />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocActivitéMédicoSocial établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialViewModel.activitésViewModel} />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocRessourcesHumainesMédicoSocial
            établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialViewModel.ressourcesHumainesViewModel}
          />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocBudgetEtFinancesMédicoSocial
            établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={établissementTerritorialViewModel.budgetEtFinancesViewModel} />
        </>
      )}
    </main>
  );
};
