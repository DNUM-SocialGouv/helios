

import { parse } from "cookie";
import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";
import { useContext, useEffect } from "react";

import { getAnneesComparaisonEndpoint } from "../backend/infrastructure/controllers/getAnneesComparaisonEndpoint";
import { getDatesMiseAjourSourcesEndpoint } from "../backend/infrastructure/controllers/getDatesMiseAjourSources";
import { dependencies } from "../backend/infrastructure/dependencies";
import { DatesMisAjourSources } from "../backend/métier/entities/ResultatDeComparaison";
import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ComparaisonPage } from "../frontend/ui/comparaison/ComparaisonPage";


type RouterProps = Readonly<{ annees: number[], datesMisAjour: DatesMisAjourSources, codeProfiles: string[], codeRegion: string }>;

export default function Router({ annees, codeProfiles, codeRegion, datesMisAjour }: RouterProps) {
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
    return <ComparaisonPage codeProfiles={codeProfiles} codeRegion={codeRegion} datesMisAjour={datesMisAjour} listeAnnees={annees} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
    try {

        const cookies = parse(context.req.headers.cookie || "");

        const numerosFiness = cookies["list"] ? JSON.parse(decodeURIComponent(cookies["list"])) : [];
        const type = cookies["type"] ? decodeURIComponent(cookies["type"]) : "";

        const session = await getSession(context);
        const codeRegion = session?.user.codeRegion as unknown as string;
        const codeProfiles = session?.user.codeProfiles as string[];

        const annees = await getAnneesComparaisonEndpoint(dependencies, type, numerosFiness);
        const datesMisAjour = await getDatesMiseAjourSourcesEndpoint(dependencies);

        return {
            props: { annees: JSON.parse(JSON.stringify(annees)), codeProfiles, codeRegion, datesMisAjour: JSON.parse(JSON.stringify(datesMisAjour)) },
        };
    } catch (error) {
        throw error;
    }
}
