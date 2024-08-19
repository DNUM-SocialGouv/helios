import Head from "next/head";
import { useRef, useCallback, useEffect, useContext } from "react";
import { useReactToPrint } from "react-to-print";

import { BtnDownloadPDF } from "../commun/BtnDownloadPDF/BtnDownloadPDF";
import { BackToSearchContext, BackToSearchContextValue } from "../commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { ToggelMultipleBlocs } from "../commun/toggelMultipleBlocs/ToggelMultipleBlocs";
import useToggelMultipleBlocs from "../commun/toggelMultipleBlocs/useToggelMultipleBlocs";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { LogoEntitéJuridique } from "./bloc-activité/LogoEntitéJuridique";
import { BlocAutorisationsCapacites } from "./bloc-autorisations-capacites/BlocAutorisationsCapacites";
import { BlocBudgetFinance } from "./bloc-budget-finance/BlocBudgetFinance";
import { Catégorisation } from "./catégorisation/Catégorisation";
import { EntitéJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { BlocIdentité } from "./fiche-d-identité/BlocIdentité";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./liste-des-établissements/ListeDesÉtablissementsTerritoriauxRattachés";

type EntitéJuridiqueProps = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel;
  établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel, rechercheViewModel, établissementsTerritoriauxRattachésViewModels }: EntitéJuridiqueProps) => {
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: entitéJuridiqueViewModel.titreAccessible,
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
    documentTitle: entitéJuridiqueViewModel.titre,
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (backToSearchContext)
      backToSearchContext.setIsInfoPage(true);
  }, [backToSearchContext])

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  const { statusBlocs, allTrue, allFalse, toggelBlocs, setAllValue } = useToggelMultipleBlocs(false, 3);

  return (
    <main className="fr-container">
      <Head>
        <title>{entitéJuridiqueViewModel.titre}</title>
      </Head>
      <>
        <div className="print-content" ref={componentRef}>
          <Catégorisation catégorisationViewModel={entitéJuridiqueViewModel.catégorisationViewModel} />
          <Titre downloadPDF={<BtnDownloadPDF handlePrint={handlePrint} />} logo={LogoEntitéJuridique} rechercheViewModel={rechercheViewModel}>
            {entitéJuridiqueViewModel.titre}
          </Titre>
          <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
          <ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />

          <ToggelMultipleBlocs allFalse={allFalse} allTrue={allTrue} setAllValue={setAllValue} statusBlocs={statusBlocs} />

          <BlocAutorisationsCapacites
            entitéJuridiqueAutorisationsCapacitesViewModel={entitéJuridiqueViewModel.entitéJuridiqueAutorisationsCapacitesViewModel}
            opnedBloc={statusBlocs[0]} toggelBlocs={() => toggelBlocs(0)}
          />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocActivitéSanitaire entitéJuridiqueActivitéViewModel={entitéJuridiqueViewModel.entitéJuridiqueActivitéViewModel}
            opnedBloc={statusBlocs[1]} toggelBlocs={() => toggelBlocs(1)} />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocBudgetFinance entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueViewModel.entitéJuridiqueBudgetFinanceViewModel} opnedBloc={statusBlocs[2]}
            toggelBlocs={() => toggelBlocs(2)} type="EJ" />

        </div>
      </>
    </main>
  );
};
