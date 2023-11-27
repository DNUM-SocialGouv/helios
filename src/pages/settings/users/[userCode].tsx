import { GetStaticPathsResult, GetStaticPropsResult } from "next";
import { InstitutionModel } from "../../../../database/models/InstitutionModel";

import { ProfilModel } from "../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { getAllRolesEndpoint } from "../../../backend/infrastructure/controllers/getAllRolesEndpoint";
import { getInstitutionsEndpoint } from "../../../backend/infrastructure/controllers/getInstitutionsEndpoint";
import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { EditUser } from "../../../frontend/ui/parametrage-utilisateurs/EditUser/EditUser";

type RouterProps = Readonly<{
  users: UtilisateurModel;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
}>;

export default function Router({ user, institutions, profiles, roles }: RouterProps) {
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
  return <EditUser institutions={institutions} profiles={profiles} roles={roles} user={user} />;
}

export async function getServerSideProps({ params }: { params: { userCode: string } }): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const { environmentVariables } = dependencies;
    const user = await getUserByCodeEndpoint(dependencies, params.userCode);

    console.log("----user---", user);
    if (!user) {
      return {
        notFound: true,
      };
    }

    const institutions = await getInstitutionsEndpoint(dependencies);
    //console.log("--institutions---", institutions);

    const profiles = await getAllProfilesEndpoint(dependencies);
    // console.log("--profiles---", profiles);

    const roles = await getAllRolesEndpoint(dependencies);
    // console.log("--roles---", roles);

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        institutions: JSON.parse(JSON.stringify(institutions)),
        profiles: JSON.parse(JSON.stringify(profiles)),
        roles: JSON.parse(JSON.stringify(roles)),
      },
    };
  } catch (error) {
    throw error;
  }
}
