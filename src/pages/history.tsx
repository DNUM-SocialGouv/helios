import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { getAllUserSearchHistoryEndpoint } from "../backend/infrastructure/controllers/getAllUserSearchHistory";
import { dependencies } from "../backend/infrastructure/dependencies";
import { ResultatRechercheHistorique } from "../backend/métier/entities/ResultatHistorique";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { SearchHistoryPage } from "../frontend/ui/search-history/SearchHistoryPage";


type RouterProps = Readonly<{ searchHistory: ResultatRechercheHistorique[] }>;

export default function Router({ searchHistory }: RouterProps) {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.HISTORIQUE_DE_RECHERECHE_TITRE,
            path: "",
        },
    ]);

    return <SearchHistoryPage searchHistory={searchHistory} />;
}


export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
    try {
        const session = await getSession(context);

        const resultatRechercheHistorique = await getAllUserSearchHistoryEndpoint(dependencies, session?.user.idUser!);
        
        return {
            props:
            {
                searchHistory: JSON.parse(JSON.stringify(resultatRechercheHistorique))
            }
        };

    } catch (error) {
        throw error;
    }
}