import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { ProfilModel } from "../../../../database/models/ProfilModel";
import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { ParametragePage } from "../../../frontend/ui/parametrage-profil/ParametragePage";

type RouterProps = Readonly<{ profiles: ProfilModel[] }>;

export default function Router({ profiles }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.PARAMETRAGE_TITRE,
      path: "",
    },
  ]);
  return <ParametragePage profiles={profiles} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);

    if (session?.user?.role === 3 || session?.user?.role === 2) {
      return {
        redirect: {
          permanent: false,
          destination: "/inaccessible",
        },
      };
    }

    const profiles = await getAllProfilesEndpoint(dependencies);
    return {
      props: { profiles: JSON.parse(JSON.stringify(profiles)) },
    };
  } catch (error) {
    throw error;
  }
}
