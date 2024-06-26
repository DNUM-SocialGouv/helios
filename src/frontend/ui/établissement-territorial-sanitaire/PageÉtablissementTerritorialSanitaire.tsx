import Head from "next/head";
import { useRef, useCallback, useEffect, useContext } from "react";
import { useReactToPrint } from "react-to-print";

import { BtnDownloadPDF } from "../commun/BtnDownloadPDF/BtnDownloadPDF";
import { BackToSearchContext, BackToSearchContextValue } from "../commun/contexts/BackToSearchContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { BlocBudgetFinance } from "../entité-juridique/bloc-budget-finance/BlocBudgetFinance";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { BlocAutorisationEtCapacitéSanitaire } from "./bloc-autorisations/BlocAutorisationEtCapacitéSanitaire";
import { BlocIdentitéSanitaire } from "./bloc-identité/BlocIdentitéSanitaire";
import BlocQualite from "./bloc-qualite/BlocQualite";
import { LogoÉtablissementTerritorial } from "./logo-établissement-territorial-sanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "./ÉtablissementTerritorialSanitaireViewModel";

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageÉtablissementTerritorialSanitaire = ({ rechercheViewModel, établissementTerritorialSanitaireViewModel }: ÉtablissementTerritorialProps) => {
  const { paths } = useDependencies();
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: établissementTerritorialSanitaireViewModel.titreAccessibleDeLEntitéJuridique,
      path: `${paths.ENTITÉ_JURIDIQUE}/${établissementTerritorialSanitaireViewModel.numéroFinessEntitéJuridiqueBrut}`,
    },
    {
      label: établissementTerritorialSanitaireViewModel.identitéViewModel.nomCourtDeLÉtablissementTerritorial,
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
    documentTitle: établissementTerritorialSanitaireViewModel.titre,
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  useEffect(() => {
    if (backToSearchContext)
      backToSearchContext.setIsInfoPage(true);
  }, [backToSearchContext])

  return (
    <main className="fr-container">
      <Head>
        <title>{établissementTerritorialSanitaireViewModel.titre}</title>
      </Head>
      <>
        <div className="print-content" ref={componentRef}>
          <Titre downloadPDF={<BtnDownloadPDF handlePrint={handlePrint} />} logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>
            {établissementTerritorialSanitaireViewModel.titre}
          </Titre>
          <BlocIdentitéSanitaire établissementTerritorialSanitaireIdentitéViewModel={établissementTerritorialSanitaireViewModel.identitéViewModel} />
          <BlocAutorisationEtCapacitéSanitaire
            établissementTerritorialSanitaireAutorisationsViewModel={établissementTerritorialSanitaireViewModel.autorisationsViewModel}
          />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocActivitéSanitaire établissementTerritorialSanitaireActivitéViewModel={établissementTerritorialSanitaireViewModel.activitésViewModel} />
          <SeparatorHorizontal></SeparatorHorizontal>
          {établissementTerritorialSanitaireViewModel.appartientAEtablissementsSantePrivesIntérêtsCollectif &&
            <>
              <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={établissementTerritorialSanitaireViewModel.entitéJuridiqueBudgetFinanceViewModel} />
              <SeparatorHorizontal></SeparatorHorizontal>
            </>}
          <BlocQualite etablissementTerritorialQualiteSanitairelViewModel={établissementTerritorialSanitaireViewModel.qualiteViewModel} />

        </div>
      </>
    </main>
  );
};
