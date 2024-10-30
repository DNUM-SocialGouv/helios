import { GetServerSidePropsContext, GetStaticPropsResult } from "next";

import { rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint } from "../backend/infrastructure/controllers/rechercheAvanceeEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { RésultatDeRecherche } from "../backend/métier/entities/RésultatDeRecherche";
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
  commune: string;
  type: string;
  statutJuridique: string[];
  laRechercheEtendueEstLancee: boolean
}

export default function RechercheAvancee(props: ExtendedRésultatDeRecherche) {
  const { wording } = useDependencies();

  const {
    estCeEnAttente,
    estCeQueLesRésultatsSontReçus,
    estCeQueLaRechercheEstLancee,
    lancerLaRecherche,
    rechercheOnChange,
    terme,
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
    <main className="fr-container">
      <RechercheAvanceeFormulaire lancerLaRecherche={lancerLaRecherche} rechercheOnChange={rechercheOnChange} terme={terme} />
      {((estCeQueLesRésultatsSontReçus || props.laRechercheEtendueEstLancee) && Number(nombreRésultats) === 0 && !estCeEnAttente) && <PasResultatRechercheAvancee />}
      {(nombreRésultats > 0 && !estCeEnAttente) &&
        <ResultatRechercheAvancee
          data={resultats}
          lastPage={lastPage}
          nombreRésultats={nombreRésultats}
          page={page}
          setPage={setPage}
        />
      }
      {(!estCeQueLaRechercheEstLancee && !props.laRechercheEtendueEstLancee && !estCeEnAttente) && <ResultatRecherchePlaceholderText />}
      {estCeEnAttente && <RechercheEnAttente />}
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<ExtendedRésultatDeRecherche>> {
  try {
    const {
      query: {
        terme = "",
        commune = "",
        page = 1,
        statuts = [],
        type = "",
        capacite_medico_sociaux: capaciteMedicoSociaux = [],
        capacite_handicap: capaciteHandicap = [],
        capacite_agees: capaciteAgees = [],
        order= "", 
        order_by: orderBy = ""
      },
    } = context;

    const pageParam = Number(page);
    const termeParam = String(terme);
    const communeParam = String(commune);
    const typeParam = String(type);
    const orderParam = String(order);
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

    if (pageParam && (termeParam || communeParam || statutJuridiqueParam.length > 0 || typeParam)) {
      const recherche = await rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(
        dependencies,
        termeParam,
        communeParam,
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
          commune: communeParam,
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
          commune: "",
          type: "",
          statutJuridique: [],
          laRechercheEtendueEstLancee: false
        },
      };
    }
  } catch (error) {
    throw error;
  }
}
