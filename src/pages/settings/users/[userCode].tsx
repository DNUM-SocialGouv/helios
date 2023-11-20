import { GetStaticPathsResult, GetStaticPropsResult } from "next";

import { ProfileValue } from "../../../../database/models/ProfilModel";
import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { EditUser } from "../../../frontend/ui/parametrage-utilisateurs/EditUser/EditUser";

type RouterProps = Readonly<{
  user: any;
}>;

export default function Router({ user }: RouterProps) {
  const { wording } = useDependencies();
  useBreadcrumb([
    {
      label: wording.USERS_LIST,
      path: "/settings/users",
    },
    {
      label: wording.PAGE_EDIT_UTILISATEUR_TITRE,
      path: "",
    },
  ]);
  // return <ParametrageProfilPage code={userCode} />;
  //return <>okkkkkkkkkkkkk user code est : {userCode}</>;
  return <EditUser user={user} />;
}

export function getStaticPaths(): GetStaticPathsResult {
  return {
    fallback: "blocking",
    paths: [],
  };
}

export async function getStaticProps({ params }: { params: { userCode: string } }): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const { environmentVariables } = dependencies;
    const user = await getUserByCodeEndpoint(dependencies, params.userCode);

    console.log("----user---", user);
    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },

      revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE),
    };
  } catch (error) {
    throw error;
  }
}
