import { GetServerSidePropsContext, GetStaticPropsResult } from "next";

import { rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint } from "../backend/infrastructure/controllers/rechercheAvanceeEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { RésultatDeRecherche } from "../backend/métier/entities/RésultatDeRecherche";
import { OrderDir } from "../backend/métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RechercheEnAttente } from "../frontend/ui/home/RechercheEnAttente";
import { PasResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/PasResultatRechercheAvancee";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/resultat-recherche-avancee/ResultatRechercheAvancee";
import { ResultatRecherchePlaceholderText } from "../frontend/ui/recherche-avancee/resultat-recherche-avancee/ResultatRecherchePlaceHolderText";
import { useRechercheAvancee } from "../frontend/ui/recherche-avancee/useRechercheAvancee";

export interface ExtendedRésultatDeRecherche extends RésultatDeRecherche {
  page: number;
  terme: string;
  zone: string;
  type: string;
  statutJuridique: string[];
  laRechercheEtendueEstLancee: boolean;
}

export default function RechercheAvancee(props: ExtendedRésultatDeRecherche) {
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
  } = useRechercheAvancee(props);

  useBreadcrumb([
    {
      label: wording.RECHERCHE_AVANCEE_LABEL,
      path: "",
    },
  ]);

  return (
    <main className="fr-container" id="content">
      <RechercheAvanceeFormulaire isComparaison={false} lancerLaRecherche={lancerLaRecherche} rechercheOnChange={rechercheOnChange} />
      {estCeQueLesRésultatsSontReçus && Number(nombreRésultats) === 0 && !estCeEnAttente && <PasResultatRechercheAvancee />}
      {nombreRésultats > 0 && !estCeEnAttente && (
        <ResultatRechercheAvancee data={resultats} lastPage={lastPage} nombreRésultats={nombreRésultats} page={page || 1} setPage={setPage} />
      )}
      {!estCeQueLaRechercheEstLancee && !props.laRechercheEtendueEstLancee && !estCeEnAttente && <ResultatRecherchePlaceholderText />}{" "}
      {estCeEnAttente && <RechercheEnAttente />}
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<ExtendedRésultatDeRecherche>> {
  try {
    const {
      query: {
        terme = "",
        zone = "",
        zoneD = "",
        typeZone = "",
        page = 1,
        statuts = [],
        type = "",
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
    const typeParam = String(type);
    const orderParam = String(order) as OrderDir;
    const orderByParam = String(orderBy);

    const statutJuridiqueParam = statuts.length > 0 && typeof statuts === "string" ? statuts.split(",") : [];
    const capaciteMedicoSociauxParam = capaciteMedicoSociaux.length > 0 && typeof capaciteMedicoSociaux === "string" ? capaciteMedicoSociaux.split(";") : [];
    const capaciteHandicapParam = capaciteHandicap.length > 0 && typeof capaciteHandicap === "string" ? capaciteHandicap.split(";") : [];
    const capaciteAgeesParam = capaciteAgees.length > 0 && typeof capaciteAgees === "string" ? capaciteAgees.split(";") : [];

    const capacites = [
      { classification: "non_classifie", ranges: capaciteMedicoSociauxParam },
      { classification: "publics_en_situation_de_handicap", ranges: capaciteHandicapParam },
      { classification: "personnes_agees", ranges: capaciteAgeesParam },
    ].filter((capacite) => capacite.ranges.length > 0);

    if (
      pageParam &&
      (termeParam ||
        zoneParam ||
        statutJuridiqueParam.length > 0 ||
        typeParam ||
        capaciteMedicoSociauxParam.length > 0 ||
        capaciteHandicapParam.length > 0 ||
        capaciteAgeesParam.length > 0)
    ) {
      const recherche = await rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(
        dependencies,
        termeParam,
        zoneParam,
        zoneDParam,
        typeZoneParam,
        typeParam,
        statutJuridiqueParam,
        capacites,
        orderParam,
        orderByParam,
        pageParam
      );

      return {
        props: {
          ...recherche,
          page: pageParam,
          terme: termeParam,
          zone: zoneParam,
          type: typeParam,
          statutJuridique: statutJuridiqueParam,
          laRechercheEtendueEstLancee: true,
        },
      };
    } else {
      return {
        props: {
          nombreDeRésultats: 0,
          résultats: [],
          page: 1,
          terme: "",
          zone: "",
          type: "",
          statutJuridique: [],
          laRechercheEtendueEstLancee: false,
        },
      };
    }
  } catch (error) {
    throw error;
  }
}
