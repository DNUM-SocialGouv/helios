import Head from "next/head";
import { useRef, useCallback, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { ToggelMultipleBlocs } from "../commun/toggelMultipleBlocs/ToggelMultipleBlocs";
import useToggelMultipleBlocs from "../commun/toggelMultipleBlocs/useToggelMultipleBlocs";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { ActivitesMensuelViewModel } from "./bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { LogoEntitéJuridique } from "./bloc-activité/LogoEntitéJuridique";
import { BlocAutorisationsCapacites } from "./bloc-autorisations-capacites/BlocAutorisationsCapacites";
import { BlocBudgetFinance } from "./bloc-budget-finance/BlocBudgetFinance";
import { BlocRessourcesHumainesEntiteJuridique } from "./bloc-ressources-humaines/BlocRessourcesHumainesEntiteJuridique";
import { Catégorisation } from "./catégorisation/Catégorisation";
import { EntiteJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { useExportExcelETRattache } from "./ExportExcelETRattaches";
import { BlocIdentité } from "./fiche-d-identité/BlocIdentité";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./liste-des-établissements/ListeDesÉtablissementsTerritoriauxRattachés";

type EntitéJuridiqueProps = Readonly<{
  entitéJuridiqueViewModel: EntiteJuridiqueViewModel;
  entitéJuridiqueActivitéMensuelleViewModel: ActivitesMensuelViewModel;
  établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel, entitéJuridiqueActivitéMensuelleViewModel, rechercheViewModel, établissementsTerritoriauxRattachésViewModels }: EntitéJuridiqueProps) => {
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
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  const { statusBlocs, allTrue, allFalse, toggelBlocs, setAllValue } = useToggelMultipleBlocs(false, 3, 0);

  const { exportEtRattache } = useExportExcelETRattache(entitéJuridiqueViewModel, établissementsTerritoriauxRattachésViewModels);
  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{entitéJuridiqueViewModel.titre}</title>
      </Head>
      <div className="print-content" ref={componentRef}>
        <Catégorisation catégorisationViewModel={entitéJuridiqueViewModel.catégorisationViewModel} />
        <Titre downloadPDF={handlePrint} exportET={exportEtRattache} logo={LogoEntitéJuridique} rechercheViewModel={rechercheViewModel}>
          {entitéJuridiqueViewModel.titre}
        </Titre>
        <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
        <ListeDesÉtablissementsTerritoriauxRattachés ETRattachés={établissementsTerritoriauxRattachésViewModels} />

        <ToggelMultipleBlocs allFalse={allFalse} allTrue={allTrue} setAllValue={setAllValue} statusBlocs={statusBlocs} />

        <BlocAutorisationsCapacites
          entitéJuridiqueAutorisationsCapacitesViewModel={entitéJuridiqueViewModel.entitéJuridiqueAutorisationsCapacitesViewModel}
          etabFiness={entitéJuridiqueViewModel.numéroFiness}
          etabNom={entitéJuridiqueViewModel.nomDeLEntitéJuridique}
          etabTitle={entitéJuridiqueViewModel.titre}
          opnedBloc={statusBlocs[0]}
          toggelBlocs={() => toggelBlocs(0)}
        />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocActivitéSanitaire
          entitéJuridiqueActivitéMensuelleViewModel={entitéJuridiqueActivitéMensuelleViewModel}
          entitéJuridiqueActivitéViewModel={entitéJuridiqueViewModel.entitéJuridiqueActivitéViewModel}
          etabFiness={entitéJuridiqueViewModel.numéroFiness}
          etabTitle={entitéJuridiqueViewModel.titre}
          opnedBloc={statusBlocs[1]}
          toggelBlocs={() => toggelBlocs(1)} />

        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocRessourcesHumainesEntiteJuridique
          entiteJuridiqueRessourcesHumainesViewModel={entitéJuridiqueViewModel.entiteJuridiqueRessourcesHumainesViewModel}
          etabFiness={entitéJuridiqueViewModel.numéroFiness}
          etabTitle={entitéJuridiqueViewModel.titre}
          openedBloc={statusBlocs[2]}
          toggleBlocs={() => toggelBlocs(2)} />

        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocBudgetFinance
          entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueViewModel.entitéJuridiqueBudgetFinanceViewModel}
          etabFiness={entitéJuridiqueViewModel.numéroFiness}
          etabTitle={entitéJuridiqueViewModel.titre}
          opnedBloc={statusBlocs[3]}
          toggelBlocs={() => toggelBlocs(3)}
          type="EJ" />
      </div>
    </main>
  );
};
