import Head from "next/head";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéMédicoSocial } from "./bloc-activité/BlocActivitéMédicoSocial";
import { BlocAutorisationEtCapacitéMédicoSocial } from "./bloc-autorisations/BlocAutorisationEtCapacitéMédicoSocial";
import { BlocBudgetEtFinancesMédicoSocial } from "./bloc-budget-et-finances/BlocBudgetEtFinancesMédicoSocial";
import { BlocIdentitéMédicoSocial } from "./bloc-identité/BlocIdentitéMédicoSocial";
import BlocQualite from "./bloc-qualite/BlocQualite";
import { BlocRessourcesHumainesMédicoSocial } from "./bloc-ressources-humaines/BlocRessourcesHumainesMédicoSocial";
import LogoÉtablissementTerritorial from "./logo-établissement-territorial-médico-social.svg";
import { ÉtablissementTerritorialMédicoSocialViewModel } from "./ÉtablissementTerritorialMédicoSocialViewModel";

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialMédicoSocialViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageÉtablissementTerritorialMédicoSocial = ({ rechercheViewModel, établissementTerritorialViewModel }: ÉtablissementTerritorialProps) => {
  const { paths } = useDependencies();

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
        <BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={établissementTerritorialViewModel.qualiteViewModel} />
      </>
    </main>
  );
};
