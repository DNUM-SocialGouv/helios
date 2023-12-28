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
  orderByPage: string;
  sortDirPage: string;
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
  orderByPage,
  sortDirPage,
}: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.PAGE_UTILISATEUR_TITRE,
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
      orderByPage={orderByPage}
      profile={profile?.toString()}
      profiles={profiles}
      role={parseInt(role)}
      roles={roles}
      sortDirPage={sortDirPage}
      userSessionRole={userSessionRole}
      users={usersPaginatedList}
    />
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);

    // if current user has role 'utilisateur' redirect to page inaccessible
    if (session?.user?.role === 3) {
      return {
        redirect: {
          permanent: false,
          destination: "/inaccessible",
        },
      };
    }

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

    let { key, orderBy, sortDir } = context.query;
    const { page, itemsPerPage, institutionId, institution, roleId, role, etat, profil, etatId, profileId, status } = context.query;

    const pageNumber = parseInt(page as string) | 1;
    const itemsPerOnePage = parseInt(itemsPerPage as string) | 10;
    key = key as string | "";

    let institutionCode = parseInt(institutionId as string) | 0;
    if (userSessionRole === "Admin Regional") {
      institutionCode = session?.user?.institutionId || 0;
    }
    const roleCode = parseInt(roleId as string) | 0;
    const profilId = profileId as string | "";
    const etatCode = etatId as string | "";

    orderBy = orderBy as string || "nom";
    sortDir = sortDir as string || "ASC";

    const users = await getUsersListPaginatedEndpoint(dependencies, key, pageNumber, institutionCode, roleCode, profilId, etatCode, itemsPerOnePage, orderBy, sortDir);

    let lastElementInPage = false;
    if (users.data.length === 1) {
      lastElementInPage = true;
    }

    const institutions = await getInstitutionsEndpoint(dependencies);
    const profiles = await getAllProfilesEndpoint(dependencies);
    const roles = await getAllRolesEndpoint(dependencies);

    return {
      props: {
        usersPaginatedList: JSON.parse(JSON.stringify(users)),
        keyWord: key || "",
        institutions: JSON.parse(JSON.stringify(institutions)),
        profiles: JSON.parse(JSON.stringify(profiles)),
        roles: JSON.parse(JSON.stringify(roles)),
        institution: parseInt(institution as string),
        role: role as string || "",
        profile: parseInt(profil as string),
        etat: etat as string || "",
        status: status as string || "",
        lastElementInPage: lastElementInPage,
        itemsPerPage: itemsPerOnePage || 10,
        userSessionRole: userSessionRole,
        orderByPage: orderBy,
        sortDirPage: sortDir,
      },
    };
  } catch (error) {
    throw error;
  }
}
