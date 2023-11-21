import { GetStaticPropsResult } from "next";

import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
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

type RouterProps = Readonly<{ usersPaginatedList: IUsersPaginatedList; keyWord: string }>;

export default function Router({ usersPaginatedList, keyWord }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.USERS_LIST,
      path: "",
    },
  ]);
  return <UsersListPage users={usersPaginatedList} keyWord={keyWord} />;
}

export async function getServerSideProps(context): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    let { page, key } = context.query;
    page = page as number | 1;
    key = key as string | "";

    const users = await getUsersListPaginatedEndpoint(dependencies, key, "Desc", page);

    console.log("--users---", users);
    return {
      props: { usersPaginatedList: JSON.parse(JSON.stringify(users)), keyWord: key || "" },
    };
  } catch (error) {
    throw error;
  }
}
