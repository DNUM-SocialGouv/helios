import { GetStaticPropsResult } from "next";

import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { ParametragePage } from "../../../frontend/ui/parametrage-profil/ParametragePage";

type RouterProps = Readonly<{ profiles: any }>;

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

export async function getServerSideProps(): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    if (true) {
      const profiles = await getAllProfilesEndpoint(dependencies);
      return {
        props: { profiles: JSON.parse(JSON.stringify(profiles)) },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    throw error;
  }
}
