import { GetServerSidePropsContext, GetStaticPropsResult } from "next";

import { rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint } from "../backend/infrastructure/controllers/rechercheAvanceeEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { RésultatDeRecherche } from "../backend/métier/entities/RésultatDeRecherche";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RechercheEnAttente } from "../frontend/ui/home/RechercheEnAttente";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/resultat-recherche-avancee/ResultatRechercheAvancee";
import { ResultatRecherchePlaceholderText } from "../frontend/ui/recherche-avancee/resultat-recherche-avancee/ResultatRecherchePlaceHolderText";
import { useRechercheAvancee } from "../frontend/ui/recherche-avancee/useRechercheAvancee";

export interface ExtendedRésultatDeRecherche extends RésultatDeRecherche {
    page: number;
    terme: string;
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
        résultats,
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
            {(estCeQueLesRésultatsSontReçus || props.nombreDeRésultats > 0 && !estCeEnAttente) &&
                <ResultatRechercheAvancee
                    data={résultats}
                    lastPage={lastPage}
                    nombreRésultats={nombreRésultats}
                    page={page}
                    setPage={setPage}
                />
            }
            {(!estCeQueLaRechercheEstLancee && !estCeEnAttente && props.nombreDeRésultats === 0) && <ResultatRecherchePlaceholderText />}
            {estCeEnAttente && <RechercheEnAttente />}
        </main>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<ExtendedRésultatDeRecherche>> {
    try {
        const { query: {
            terme = "",
            commune = "",
            page
        } } = context;
        const pageParam = Number(page)
        const termeParam = String(terme)
        const communeParam = String(commune)
        if (pageParam && termeParam !== "") {
            const recherche = await rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(dependencies, termeParam, communeParam, pageParam)
            return {
                props: {
                    ...recherche,
                    page: pageParam,
                    terme: termeParam
                }
            }
        } else {
            return {
                props: {
                    nombreDeRésultats: 0,
                    résultats: [],
                    page: 1,
                    terme: ""
                }
            }
        }
    } catch (error) {
        throw error
    }
}