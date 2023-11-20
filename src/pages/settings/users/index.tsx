import { GetStaticPropsResult } from "next";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { UsersListPage } from "../../../frontend/ui/parametrage-utilisateurs/UsersListPage/UsersListPage";
import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

type RouterProps = Readonly<{ usersPaginatedList: any[] }>;

export default function Router({ usersPaginatedList }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.USERS_LIST,
      path: "",
    },
  ]);
  return <UsersListPage users={usersPaginatedList} />;
}

export async function getServerSideProps(): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const users = await getUsersListPaginatedEndpoint(dependencies, "", "sortby", 1);

    return {
      props: { usersPaginatedList: JSON.parse(JSON.stringify(users)) },
    };
  } catch (error) {
    throw error;
  }
}
