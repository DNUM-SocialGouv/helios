import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";

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
      label: wording.PARAMETRAGE_AUTORISATIONS_TITRE,
      path: paths.PROFILES_LIST,
    },
    {
      label: `${profileLabel}`,
      path: "",
    },
  ]);

  if (!profileValue || !profileLabel) return null;
  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.PARAMETRAGE_AUTORISATIONS_TITRE}</title>
      </Head>
      <ParametrageProfilPage code={profileCode} id={profileId} label={profileLabel} value={profileValue} />
    </main>
  );

}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);

    // if current user is not a National admin
    if (session?.user?.role !== 1) {
      return {
        redirect: {
          permanent: false,
          destination: "/inaccessible",
        },
      };
    }

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
