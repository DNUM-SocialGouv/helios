import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
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
      <RechercheAvanceeFormulaire
        categoriesViewModel={categoriesViewModel ?? []}
        isComparaison={false}
        lancerLaRecherche={resetSelectionEtLanceLaRecherche}
        rechercheOnChange={rechercheOnChange}
        setIsChangedCapacite={resetSelectionOnChange}
        setIsChangedStructure={resetSelectionOnChange}
        setIsChangedZG={resetSelectionOnChange}
      />
      {estCeQueLesRésultatsSontReçus && Number(nombreRésultats) === 0 && !estCeEnAttente && <PasResultatRechercheAvancee />}
      {nombreRésultats > 0 && !estCeEnAttente && (
        <ResultatRechercheAvancee data={resultats} lastPage={lastPage} nombreRésultats={nombreRésultats} page={page ?? 1} selectedRows={selectedRows} setPage={setPage} setSelectedRows={setSelectedRows} />
      )}
      {!estCeQueLaRechercheEstLancee && !props.rechercheProps.laRechercheEtendueEstLancee && !estCeEnAttente && <ResultatRecherchePlaceholderText />}{" "}
      {estCeEnAttente && <RechercheEnAttente />}
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  const {
    query: {
      terme = "",
      zone = "",
      zoneD = "",
      typeZone = "",
      page = 1,
      statuts = [],
      type = "",
      categories = [],
      capacite_medico_sociaux: capaciteMedicoSociaux = [],
      capacite_handicap: capaciteHandicap = [],
      capacite_agees: capaciteAgees = [],
      order = "ASC",
      order_by: orderBy = "",
    },
  } = context;
  const pageParam = Number(page);
  const termeParam = String(terme);
  const zoneParam = String(zone);
  const zoneDParam = String(zoneD);
  const typeZoneParam = String(typeZone);
  const orderParam = String(order) as OrderDir;
  const orderByParam = String(orderBy);

  const typeParam = type.length > 0 && typeof type === "string" ? type.split(",") : [];
  const statutJuridiqueParam = statuts.length > 0 && typeof statuts === "string" ? statuts.split(",") : [];
  const categoriesParam = categories.length > 0 && typeof categories === "string" ? categories.split(",") : [];
  const capaciteMedicoSociauxParam = capaciteMedicoSociaux.length > 0 && typeof capaciteMedicoSociaux === "string" ? capaciteMedicoSociaux.split(";") : [];
  const capaciteHandicapParam = capaciteHandicap.length > 0 && typeof capaciteHandicap === "string" ? capaciteHandicap.split(";") : [];
  const capaciteAgeesParam = capaciteAgees.length > 0 && typeof capaciteAgees === "string" ? capaciteAgees.split(";") : [];

  const capacites = [
    { classification: "non_classifie", ranges: capaciteMedicoSociauxParam },
    { classification: "publics_en_situation_de_handicap", ranges: capaciteHandicapParam },
    { classification: "personnes_agees", ranges: capaciteAgeesParam },
  ].filter((capacite) => capacite.ranges.length > 0);

  const categoriesFiness = await getFinessCategoriesEndpoint(dependencies);

  if (
    pageParam &&
    (termeParam ||
      zoneParam ||
      statutJuridiqueParam.length > 0 ||
      typeParam.length > 0 ||
      categories.length > 0 ||
      capaciteMedicoSociauxParam.length > 0 ||
      capaciteHandicapParam.length > 0 ||
      capaciteAgeesParam.length > 0)
  ) {
    const params = { terme: termeParam, zone: zoneParam, zoneD: zoneDParam, typeZone: typeZoneParam, type: typeParam, statutJuridique: statutJuridiqueParam, categories: categoriesParam, capaciteSMS: capacites, order: orderParam, orderBy: orderByParam, page: pageParam, forExport: false } as ParametreDeRechercheAvancee;
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
