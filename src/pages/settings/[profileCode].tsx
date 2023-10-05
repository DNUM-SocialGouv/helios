import { GetStaticPathsResult, GetStaticPropsResult } from "next";

import { ProfileValue } from "../../../database/models/ProfilModel";
import { getProfileByCodeEndpoint } from "../../backend/infrastructure/controllers/getProfileByCodeEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ParametrageProfilPage } from "../../frontend/ui/parametrage-profil/ParametrageProfilPage";

type RouterProps = Readonly<{
    profileValue: ProfileValue;
    profileLabel: string;
    profileCode: string;
}>;

export default function Router({ profileValue, profileLabel, profileCode }: RouterProps) {
    if (!profileValue || !profileLabel) return null;

    return <ParametrageProfilPage code={profileCode} label={profileLabel} value={profileValue} />;

}

export function getStaticPaths(): GetStaticPathsResult {
    return {
        fallback: "blocking",
        paths: [],
    };
}

export async function getStaticProps({ params }: { params: { profileCode: string } }): Promise<GetStaticPropsResult<RouterProps>> {
    try {
        const { environmentVariables } = dependencies;
        const profile = (await getProfileByCodeEndpoint(dependencies, params.profileCode));

        if (!profile) {
            return {
                notFound: true,
            }
        }

        return {
            props: {
                profileValue: profile.value,
                profileLabel: profile.label,
                profileCode: profile.code
            },
            revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE),
        };
    } catch (error) {
        throw error;
    }
}