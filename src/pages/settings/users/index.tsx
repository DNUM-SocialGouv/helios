import { GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { InstitutionModel } from "../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { getAllRolesEndpoint } from "../../../backend/infrastructure/controllers/getAllRolesEndpoint";
import { getInstitutionByCodeEndpoint } from "../../../backend/infrastructure/controllers/getInstitutionByCodeEndpoint";
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
  status: string;
  lastElementInPage: boolean;
  itemsPerPage: number;
  userSessionRole: string;
}>;

export default function Router({
  usersPaginatedList,
  keyWord,
  institutions,
  profiles,
  roles,
  institution,
  profile,
  role,
  status,
  lastElementInPage,
  itemsPerPage,
  userSessionRole,
}: RouterProps) {
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
      itemsPerPageValue={itemsPerPage}
      keyWord={keyWord}
      lastElementInPage={lastElementInPage}
      profile={profile}
      profiles={profiles}
      role={role}
      roles={roles}
      userSessionRole={userSessionRole}
      users={usersPaginatedList}
    />
  );
}

export async function getServerSideProps(context): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);

    console.log("session?.user?", session?.user);

    let userSessionRole = "";

    switch (session?.user?.role as unknown as number) {
      case 1:
        userSessionRole = "Admin National";
        break;
      case 2:
        userSessionRole = "Admin Regional";
        break;
      case 3:
        userSessionRole = "Utilisateur";
        break;
      default:
        userSessionRole = "Utilisateur";
    }

    let { page, key, institution, role, profil, institutionId, roleId, profileId, status, itemsPerPage } = context.query;
    page = parseInt(page) | 1;
    itemsPerPage = parseInt(itemsPerPage) | 10;
    key = key as string | "";

    institutionId = parseInt(institutionId) | 0;
    if (userSessionRole === "Admin Regional") {
      institutionId = session?.user?.institutionId || 0;
    }
    roleId = parseInt(roleId) | 0;
    const profilId = profileId as string | "";

    //   console.log("---------------CCCC------------");
    //   console.log(context.query);
    //   console.log("---------------------A-------------------");
    //   console.log("institutionId : ", institutionId);
    //   console.log("roleId : ", roleId);
    //   console.log("profilId : ", profileId);

    const users = await getUsersListPaginatedEndpoint(dependencies, key, "Desc", page, institutionId, roleId, profilId, itemsPerPage);
    //console.log("--users---", users);

    let lastElementInPage = false;
    if (users.data.length === 1) {
      lastElementInPage = true;
    }

    const institutions = await getInstitutionsEndpoint(dependencies);
    // console.log("--institutions---", institutions);

    const profiles = await getAllProfilesEndpoint(dependencies);
    // console.log("--profiles---" /*, profiles*/);

    const roles = await getAllRolesEndpoint(dependencies);
    //console.log("--roles---", roles);

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
        status: status || "",
        lastElementInPage: lastElementInPage,
        itemsPerPage: itemsPerPage || 10,
        userSessionRole: userSessionRole,
      },
    };
  } catch (error) {
    throw error;
  }
}
