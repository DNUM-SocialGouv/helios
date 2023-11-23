import { GetStaticPropsResult } from "next";

import { InstitutionModel } from "../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { getAllRolesEndpoint } from "../../../backend/infrastructure/controllers/getAllRolesEndpoint";
import { getInstitutionsEndpoint } from "../../../backend/infrastructure/controllers/getInstitutionsEndpoint";
import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { UsersListPage } from "../../../frontend/ui/parametrage-utilisateurs/UsersListPage/UsersListPage";

interface IUsersPaginatedList {
  data: UtilisateurModel[];
  total: number;
  currentPage: number;
  keyWord: string;
  lastPage: number;
}

type RouterProps = Readonly<{
  usersPaginatedList: IUsersPaginatedList;
  keyWord: string;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
  institution: number;
  profile: number;
  role: string;
}>;

export default function Router({ usersPaginatedList, keyWord, institutions, profiles, roles, institution, profile, role }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.USERS_LIST,
      path: "",
    },
  ]);
  return (
    <UsersListPage
      institution={institution}
      institutions={institutions}
      keyWord={keyWord}
      profile={profile}
      profiles={profiles}
      role={role}
      roles={roles}
      users={usersPaginatedList}
    />
  );
}

export async function getServerSideProps(context): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    let { page, key, institution, role, profil, institutionId, roleId, profileId } = context.query;
    page = page as number | 1;
    key = key as string | "";
    institutionId = institutionId as number | 0;
    roleId = roleId as number | 0;
    const profilId = profileId as string | "";

    console.log("---------------CCCC------------");
    console.log(context.query);
    console.log("---------------------A-------------------");
    console.log("institutionId : ", institutionId);
    console.log("roleId : ", roleId);
    console.log("profilId : ", profileId);

    const users = await getUsersListPaginatedEndpoint(dependencies, key, "Desc", page, institutionId, roleId, profilId);
    console.log("--users---", users);

    const institutions = await getInstitutionsEndpoint(dependencies);
    console.log("--institutions---" /*, institutions*/);

    const profiles = await getAllProfilesEndpoint(dependencies);
    console.log("--profiles---" /*, profiles*/);

    const roles = await getAllRolesEndpoint(dependencies);
    console.log("--roles---" /*, roles*/);

    return {
      props: {
        usersPaginatedList: JSON.parse(JSON.stringify(users)),
        keyWord: key || "",
        institutions: JSON.parse(JSON.stringify(institutions)),
        profiles: JSON.parse(JSON.stringify(profiles)),
        roles: JSON.parse(JSON.stringify(roles)),
        institution: institution || 0,
        role: role || "",
        profil: profil || 0,
      },
    };
  } catch (error) {
    throw error;
  }
}
