import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { useContext, useEffect } from "react";

import { getAll } from "../backend/infrastructure/controllers/userListEndpoint";
import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { UserContext } from "../frontend/ui/commun/contexts/userContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { FavorisPage } from "../frontend/ui/favoris/FavorisPage";
import { UserListViewModel } from "../frontend/ui/user-list/UserListViewModel";

type RouterProps = Readonly<{
    favoris: UserListViewModel[];
}>;

export default function Router({ favoris }: RouterProps) {
    const { wording } = useDependencies();
    const userContext = useContext(UserContext);
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
        userContext?.setFavorisLists(favoris);
    }, [backToSearchContext])

    return <FavorisPage />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
    try {
        const session = await getSession(context);
        const userUuid = session?.user?.idUser as string;

        const list = await getAll(userUuid);
        if (!list) {
            return { notFound: true };
        }

        return {
            props: {
                favoris: JSON.parse(JSON.stringify(list)),
            },
        };

    } catch (error) {
        return { notFound: true };
    }
}