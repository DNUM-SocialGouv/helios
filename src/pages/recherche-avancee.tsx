import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import { useState } from "react";

import { CategoriesFinessModel } from "../../database/models/CategoriesFinessModel";
import { getFinessCategoriesEndpoint } from "../backend/infrastructure/controllers/getFinessCategoriesEndpoint";
import { rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint } from "../backend/infrastructure/controllers/rechercheAvanceeEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { OrderDir, ParametreDeRechercheAvancee } from "../backend/métier/entities/ParametresDeRechercheAvancee";
import { RésultatDeRecherche } from "../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RechercheEnAttente } from "../frontend/ui/home/RechercheEnAttente";
import { CategoriesFinessViewModel } from "../frontend/ui/recherche-avancee/model/CategoriesFinessViewModel";
import { PasResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/PasResultatRechercheAvancee";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/resultat-recherche-avancee/ResultatRechercheAvancee";
import { ResultatRecherchePlaceholderText } from "../frontend/ui/recherche-avancee/resultat-recherche-avancee/ResultatRecherchePlaceHolderText";
import { useRechercheAvancee } from "../frontend/ui/recherche-avancee/useRechercheAvancee";

export interface ExtendedResultatDeRecherche extends RésultatDeRecherche {
  laRechercheEtendueEstLancee: boolean;
}

type RouterProps = Readonly<{ rechercheProps: Readonly<ExtendedResultatDeRecherche>, categories: CategoriesFinessModel[] | null }>;

export default function RechercheAvancee(props: RouterProps) {
  const { wording } = useDependencies();

  const {
    estCeEnAttente,
    estCeQueLesRésultatsSontReçus,
    estCeQueLaRechercheEstLancee,
    lancerLaRecherche,
    rechercheOnChange,
    resultats,
    nombreRésultats,
    page,
    lastPage,
    setPage,
  } = useRechercheAvancee(props.rechercheProps);

  useBreadcrumb([
    {
      label: wording.RECHERCHE_AVANCEE_LABEL,
      path: "",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState<Map<string, string>>(new Map());

  const resetSelectionEtLanceLaRecherche = () => {
    setSelectedRows(new Map<string, string>);
    lancerLaRecherche();
  }

  const resetSelectionOnChange = () => {
    setSelectedRows(new Map<string, string>);
  }

  const categoriesViewModel = props.categories?.map((categorie) => new CategoriesFinessViewModel(categorie));


  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.RECHERCHE_AVANCEE_LABEL}</title>
      </Head>
      <RechercheAvanceeFormulaire
        categoriesViewModel={categoriesViewModel ?? []}
        isComparaison={false}
        lancerLaRecherche={resetSelectionEtLanceLaRecherche}
        rechercheOnChange={rechercheOnChange}
        setIsChangedActivite={resetSelectionOnChange}
        setIsChangedCapacite={resetSelectionOnChange}
        setIsChangedCategories={resetSelectionOnChange}
        setIsChangedStructure={resetSelectionOnChange}
        setIsChangedZG={resetSelectionOnChange}
        setSelectedRows={setSelectedRows}
      />
      {estCeQueLesRésultatsSontReçus && Number(nombreRésultats) === 0 && !estCeEnAttente && <PasResultatRechercheAvancee />}
      {nombreRésultats > 0 && !estCeEnAttente && (
        <ResultatRechercheAvancee categories={categoriesViewModel ?? []} data={resultats} lastPage={lastPage} nombreRésultats={nombreRésultats} page={page ?? 1} selectedRows={selectedRows} setPage={setPage} setSelectedRows={setSelectedRows} />
      )}
      {!estCeQueLaRechercheEstLancee && !props.rechercheProps.laRechercheEtendueEstLancee && !estCeEnAttente && <ResultatRecherchePlaceholderText />}{" "}
      {estCeEnAttente && <RechercheEnAttente />}
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  const { query } = context;

  const pageParam = Number(query['page'] || 1);
  const termeParam = String(query['terme'] || "");
  const zoneParam = String(query['zone'] ?? "");
  const zoneDParam = String(query['zoneD'] ?? "");
  const typeZoneParam = String(query['typeZone'] ?? "");
  const orderParam = String(query['order'] ?? "ASC") as OrderDir;
  const orderByParam = String(query['order_by'] ?? "");


  const transformArrayParam = (param: any, delimiter = ",") =>
    param && typeof param === "string" && param.length > 0 ? param.split(delimiter) : [];

  const typeParam = transformArrayParam(query['type']);
  const statutJuridiqueParam = transformArrayParam(query['statuts']);
  const categoriesParam = transformArrayParam(query['categories']);

  const capaciteMedicoSociauxParam = transformArrayParam(query['capacite_medico_sociaux'], ";");
  const capaciteHandicapParam = transformArrayParam(query['capacite_handicap'], ";");
  const capaciteAgeesParam = transformArrayParam(query['capacite_agees'], ";");

  const activiteMcoParam = transformArrayParam(query['activiteMco'], ";");
  const activitePsyParam = transformArrayParam(query['activitePsy'], ";");
  const activiteSsrParam = transformArrayParam(query['activiteSsr'], ";");
  const activiteUsldParam = transformArrayParam(query['activiteUsld'], ";");

  const capacites = [
    { classification: "non_classifie", ranges: capaciteMedicoSociauxParam },
    { classification: "publics_en_situation_de_handicap", ranges: capaciteHandicapParam },
    { classification: "personnes_agees", ranges: capaciteAgeesParam },
  ].filter((capacite) => capacite.ranges.length > 0);

  const activites = [
    { classification: "mco", ranges: activiteMcoParam },
    { classification: "psy", ranges: activitePsyParam },
    { classification: "ssr", ranges: activiteSsrParam },
    { classification: "usld", ranges: activiteUsldParam },
  ].filter((activite) => activite.ranges.length > 0);

  const categoriesFiness = await getFinessCategoriesEndpoint(dependencies);

  const shouldPerformSearch = pageParam &&
    (termeParam ||
      zoneParam ||
      statutJuridiqueParam.length > 0 ||
      typeParam.length > 0 ||
      categoriesParam.length > 0 ||
      capaciteMedicoSociauxParam.length > 0 ||
      capaciteHandicapParam.length > 0 ||
      capaciteAgeesParam.length > 0 ||
      activiteMcoParam.length > 0 ||
      activitePsyParam.length > 0 ||
      activiteSsrParam.length > 0 ||
      activiteUsldParam.length > 0)

  if (shouldPerformSearch) {
    const params = { terme: termeParam, zone: zoneParam, zoneD: zoneDParam, typeZone: typeZoneParam, type: typeParam, statutJuridique: statutJuridiqueParam, categories: categoriesParam, capaciteSMS: capacites, activiteSAN: activites, order: orderParam, orderBy: orderByParam, page: pageParam, forExport: false } as ParametreDeRechercheAvancee;
    const recherche = await rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(
      dependencies,
      params
    );

    return {
      props: {
        rechercheProps: {
          ...recherche,
          laRechercheEtendueEstLancee: true,
        },
        categories: JSON.parse(JSON.stringify(categoriesFiness))
      },
    };
  } else {
    return {
      props: {
        rechercheProps: {
          nombreDeRésultats: 0,
          résultats: [],
          laRechercheEtendueEstLancee: false,
        },
        categories: JSON.parse(JSON.stringify(categoriesFiness))
      }
    };
  }
}
