import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { useContext, useEffect } from "react";

import { rechercheParNumeroFinessEndpoint } from "../backend/infrastructure/controllers/rechercheParNumeroFinessEndpoints";
import { getAll } from "../backend/infrastructure/controllers/userListEndpoint";
import { Résultat } from "../backend/métier/entities/RésultatDeRecherche";
import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { TuileEtablissementViewModel } from "../frontend/ui/commun/TuileEtablissement/TuileEtablissementViewModel";
import { FavorisPage } from "../frontend/ui/favoris/FavorisPage";

type RouterProps = Readonly<{
    listId: number;
    etablissements: Résultat[];
}>;

export default function Router({ listId, etablissements }: RouterProps) {
    const { wording, paths } = useDependencies();
    const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([
        {
            label: wording.FAVORIS_LIST,
            path: "",
        },
    ]);

    useEffect(() => {
        if (backToSearchContext) {
            backToSearchContext.setIsInfoPage(false);
            localStorage.clear();
        }
    }, [backToSearchContext])

    const elements = etablissements.map((elmt) => {
        return new TuileEtablissementViewModel(elmt, paths);
    });

    return <FavorisPage favoris={elements} listId={listId}/>;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
    try {

        const session = await getSession(context);
        const userUuid = session?.user?.idUser as string;
        const lists = await getAll(userUuid);
        if (!lists) {
            return { notFound: true };
        }

        // On ne traite que les favoris pour le moment
        const list = lists.find(list => list.isFavoris);
        if (!list) {
            return { notFound: true };
        }
        const finessNumber = list?.userListEtablissements.map((etablissement) => etablissement.finessNumber);
        if (finessNumber) {
            const etablissementList = (await rechercheParNumeroFinessEndpoint(finessNumber));



            return {
                props: {
                    listId: list.id,
                    etablissements: etablissementList,
                },
            };
        } else {
            return { notFound: true };
        }
    } catch (error) {
        return { notFound: true };
    }
}