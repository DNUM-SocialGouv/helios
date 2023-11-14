import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { UsersListPage } from "../../../frontend/ui/parametrage-utilisateurs/usersListPage";

const ParametrageUser = () => {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.USERS_LIST,
            path: "",
        },
    ]);
    return <UsersListPage />;
}

export default ParametrageUser;