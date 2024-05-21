import Head from "next/head";
import { useRef, useCallback, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

import { BtnDownloadPDF } from "../commun/BtnDownloadPDF/BtnDownloadPDF";
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
import { LogoÉtablissementTerritorial } from "./logo-établissement-territorial-médico-social";
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

  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef<any>(null);

  const handleOnBeforeGetContent = useCallback(() => {
    return new Promise<void>((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      resolve();
    });
  }, []);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: établissementTerritorialViewModel.titre,
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);
  return (
    <main className="fr-container">
      <Head>
        <title>{établissementTerritorialViewModel.titre}</title>
      </Head>
      <>
        <div className="print-content" ref={componentRef}>
          <Titre downloadPDF={<BtnDownloadPDF handlePrint={handlePrint} />} logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>
            {établissementTerritorialViewModel.titre}
          </Titre>

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
            établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={établissementTerritorialViewModel.budgetEtFinancesViewModel}
          />
          <BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={établissementTerritorialViewModel.qualiteViewModel} />
        </div>
      </>
    </main>
  );
};
