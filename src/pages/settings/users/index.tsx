import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

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
import UsersListPage from "../../../frontend/ui/parametrage-utilisateurs/UsersListPage/UsersListPage";

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
  etat: string;
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
  etat,
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
      etat={etat.toString()}
      institution={institution}
      institutions={institutions}
      itemsPerPageValue={itemsPerPage}
      keyWord={keyWord}
      lastElementInPage={lastElementInPage}
      profile={profile.toString()}
      profiles={profiles}
      role={parseInt(role)}
      roles={roles}
      userSessionRole={userSessionRole}
      users={usersPaginatedList}
    />
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);

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

    let { page, key, institutionId, roleId, itemsPerPage } = context.query;
    const { institution, role, etat, profil, etatId, profileId, status } = context.query;

    page = parseInt(page) | 1;
    itemsPerPage = parseInt(itemsPerPage) | 10;
    key = key as string | "";

    institutionId = parseInt(institutionId) | 0;
    if (userSessionRole === "Admin Regional") {
      institutionId = session?.user?.institutionId || 0;
    }
    roleId = parseInt(roleId) | 0;
    const profilId = profileId as string | "";

    const users = await getUsersListPaginatedEndpoint(dependencies, key, "Desc", page, institutionId, roleId, profilId, etatId, itemsPerPage);
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
        etat: etat || "",
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
