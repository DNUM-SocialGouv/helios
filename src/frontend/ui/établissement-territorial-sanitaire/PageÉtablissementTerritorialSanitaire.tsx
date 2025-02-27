/* eslint-disable react/jsx-sort-props */
import Head from "next/head";
import { useRef, useCallback, useEffect, useContext } from "react";
import { useReactToPrint } from "react-to-print";

import { BtnDownloadPDF } from "../commun/BtnDownloadPDF/BtnDownloadPDF";
import { BackToSearchContext, BackToSearchContextValue } from "../commun/contexts/BackToSearchContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { ToggelMultipleBlocs } from "../commun/toggelMultipleBlocs/ToggelMultipleBlocs";
import useToggelMultipleBlocs from "../commun/toggelMultipleBlocs/useToggelMultipleBlocs";
import { ActivitésMensuelViewModel } from "../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
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
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageÉtablissementTerritorialSanitaire = ({ rechercheViewModel, établissementTerritorialSanitaireViewModel, activitéMensuelleViewModel }: ÉtablissementTerritorialProps) => {
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

  const { statusBlocs, allTrue, allFalse, toggelBlocs, setAllValue } = useToggelMultipleBlocs(false, 4, 0);

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{établissementTerritorialSanitaireViewModel.titre}</title>
      </Head>
      <>
        <div className="print-content" ref={componentRef}>
          <Titre downloadPDF={<BtnDownloadPDF handlePrint={handlePrint} />} logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>
            {établissementTerritorialSanitaireViewModel.titre}
          </Titre>
          <BlocIdentitéSanitaire établissementTerritorialSanitaireIdentitéViewModel={établissementTerritorialSanitaireViewModel.identitéViewModel} />

          <ToggelMultipleBlocs allFalse={allFalse} allTrue={allTrue} setAllValue={setAllValue} statusBlocs={statusBlocs} />

          <BlocAutorisationEtCapacitéSanitaire
            établissementTerritorialSanitaireAutorisationsViewModel={établissementTerritorialSanitaireViewModel.autorisationsViewModel}
            opnedBloc={statusBlocs[0]} toggelBlocs={() => toggelBlocs(0)}
          />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocActivitéSanitaire établissementTerritorialSanitaireActivitéViewModel={établissementTerritorialSanitaireViewModel.activitésViewModel}
            activitéMensuelleViewModel={activitéMensuelleViewModel} opnedBloc={statusBlocs[1]} toggelBlocs={() => toggelBlocs(1)} />
          <SeparatorHorizontal></SeparatorHorizontal>

          {établissementTerritorialSanitaireViewModel.appartientAEtablissementsSantePrivesIntérêtsCollectif &&
            <>
              <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={établissementTerritorialSanitaireViewModel.entitéJuridiqueBudgetFinanceViewModel} type="ET_PNL"
                opnedBloc={statusBlocs[2]} toggelBlocs={() => toggelBlocs(2)} />
              <SeparatorHorizontal></SeparatorHorizontal>
            </>}

          {!établissementTerritorialSanitaireViewModel.appartientAEtablissementsSantePrivesIntérêtsCollectif &&
            <>
              <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={établissementTerritorialSanitaireViewModel.entitéJuridiqueBudgetFinanceViewModel} type="ET_Autres"
                opnedBloc={statusBlocs[2]} toggelBlocs={() => toggelBlocs(2)} />
              <SeparatorHorizontal></SeparatorHorizontal>
            </>}

          <BlocQualite etablissementTerritorialQualiteSanitairelViewModel={établissementTerritorialSanitaireViewModel.qualiteViewModel}
            opnedBloc={statusBlocs[3]} toggelBlocs={() => toggelBlocs(3)} />

        </div>
      </>
    </main>
  );
};
