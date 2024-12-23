

import { parse } from "cookie";
import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { useContext, useEffect } from "react";

import { getAnneesComparaisonEndpoint } from "../backend/infrastructure/controllers/getAnneesComparaisonEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ComparaisonPage } from "../frontend/ui/comparaison/ComparaisonPage";


type RouterProps = Readonly<{ annees: number[] }>;

export default function Router({ annees }: RouterProps) {
    const { wording } = useDependencies();
    const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

    useEffect(() => {
        if (backToSearchContext) {
            backToSearchContext.setIsInfoPage(false);
            localStorage.clear();
        }
    }, [backToSearchContext])

    useBreadcrumb([
        {
            label: wording.COMPARAISON,
            path: "",
        },
    ]);
    return <ComparaisonPage listeAnnees={annees} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
    try {

        const cookies = parse(context.req.headers.cookie || "");

        const numerosFiness = cookies["list"] ? JSON.parse(decodeURIComponent(cookies["list"])) : [];
        const type = cookies["type"] ? decodeURIComponent(cookies["type"]) : "";

        const annees = await getAnneesComparaisonEndpoint(dependencies, type, numerosFiness);

        return {
            props: { annees: JSON.parse(JSON.stringify(annees)) },
        };
    } catch (error) {
        throw error;
    }
}
