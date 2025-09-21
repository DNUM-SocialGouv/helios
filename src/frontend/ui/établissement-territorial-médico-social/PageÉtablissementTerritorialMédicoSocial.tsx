import Head from "next/head";
import { useRef, useCallback, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { ToggelMultipleBlocs } from "../commun/toggelMultipleBlocs/ToggelMultipleBlocs";
import useToggelMultipleBlocs from "../commun/toggelMultipleBlocs/useToggelMultipleBlocs";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéMédicoSocial } from "./bloc-activité/BlocActivitéMédicoSocial";
import { BlocAutorisationEtCapacitéMédicoSocial } from "./bloc-autorisations/BlocAutorisationEtCapacitéMédicoSocial";
import { BlocBudgetEtFinancesMédicoSocial } from "./bloc-budget-et-finances/BlocBudgetEtFinancesMédicoSocial";
import { BlocIdentitéMédicoSocial } from "./bloc-identité/BlocIdentitéMédicoSocial";
import BlocQualite from "./bloc-qualite/BlocQualite";
import { BlocRessourcesHumainesMédicoSocial } from "./bloc-ressources-humaines/BlocRessourcesHumainesMédicoSocial";
import { LogoÉtablissementTerritorial } from "./logo-établissement-territorial-médico-social";
import { EtablissementTerritorialMedicoSocialViewModel } from "./ÉtablissementTerritorialMédicoSocialViewModel";

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialViewModel: EtablissementTerritorialMedicoSocialViewModel;
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

  const { statusBlocs, allTrue, allFalse, toggelBlocs, setAllValue, statusSousBlocs, setStatusSousBlocs } = useToggelMultipleBlocs(false, 5, 2);

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{établissementTerritorialViewModel.titre}</title>
      </Head>
      <div className="print-content" ref={componentRef}>
        <Titre downloadPDF={handlePrint} logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>
          {établissementTerritorialViewModel.titre}
        </Titre>

        <BlocIdentitéMédicoSocial établissementTerritorialIdentitéMédicoSocialViewModel={établissementTerritorialViewModel.identitéViewModel} />

        <ToggelMultipleBlocs allFalse={allFalse} allTrue={allTrue} setAllValue={setAllValue} statusBlocs={statusBlocs} />

        <BlocAutorisationEtCapacitéMédicoSocial
          opnedBloc={statusBlocs[0]}
          toggelBlocs={() => toggelBlocs(0)} établissementTerritorialAutorisationsMédicoSocialViewModel={établissementTerritorialViewModel.autorisationsViewModel}
        />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocActivitéMédicoSocial categorie={établissementTerritorialViewModel.identitéViewModel.catégorieDeLÉtablissement} opnedBloc={statusBlocs[1]}
          toggelBlocs={() => toggelBlocs(1)} établissementTerritorialActivitéMédicoSocialViewModel={établissementTerritorialViewModel.activitésViewModel} />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocRessourcesHumainesMédicoSocial
          blocVigieRhViewModel={établissementTerritorialViewModel.vigieRHViewModel}
          categorie={établissementTerritorialViewModel.identitéViewModel.catégorieDeLÉtablissement}
          opnedBloc={statusBlocs[2]}
          setStatusSousBlocs={setStatusSousBlocs}
          statusSousBlocs={statusSousBlocs}
          toggelBlocs={() => toggelBlocs(2)}
          établissementTerritorialMédicoSocialRessourcesHumainesViewModel={établissementTerritorialViewModel.ressourcesHumainesViewModel}
        />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocBudgetEtFinancesMédicoSocial
          opnedBloc={statusBlocs[3]}
          toggelBlocs={() => toggelBlocs(3)} établissementTerritorialMédicoSocialBudgetEtFinancesViewModel={établissementTerritorialViewModel.budgetEtFinancesViewModel}
        />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocQualite etablissementTerritorialQualiteMédicoSocialViewModel={établissementTerritorialViewModel.qualiteViewModel}
          opnedBloc={statusBlocs[4]} toggelBlocs={() => toggelBlocs(4)} />
      </div>
    </main>
  );
};
