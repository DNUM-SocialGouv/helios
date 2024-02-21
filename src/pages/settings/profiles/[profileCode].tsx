import { GetServerSidePropsContext, GetStaticPropsResult } from "next";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { getProfileByCodeEndpoint } from "../../../backend/infrastructure/controllers/getProfileByCodeEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { ParametrageProfilPage } from "../../../frontend/ui/parametrage-profil/ParametrageProfilPage";

type RouterProps = Readonly<{
    profileValue: ProfileValue;
    profileLabel: string;
    profileCode: string;
    profileId: number;
}>;

export default function Router({ profileValue, profileLabel, profileCode, profileId }: RouterProps) {
    const { wording, paths } = useDependencies();
    useBreadcrumb([
        {
            label: wording.PARAMETRAGE_TITRE,
            path: paths.PROFILES_LIST,
        },
        {
            label: `${profileLabel}`,
            path: "",
        },
    ]);
    if (!profileValue || !profileLabel) return null;
    return <ParametrageProfilPage code={profileCode} id={profileId} label={profileLabel} value={profileValue} />;

}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
    try {
        const { params } = context;
        if (params && params["profileCode"]) {
            const profile = (await getProfileByCodeEndpoint(dependencies, params["profileCode"] as string));

            if (!profile) {
                return {
                    notFound: true,
                }
            }

            return {
                props: {
                    profileValue: profile.value,
                    profileLabel: profile.label,
                    profileCode: profile.code,
                    profileId: profile.id,
                },
            };
        } else {
            return {
                notFound: true,
            }
        }
    } catch (error) {
        throw error;
    }
}