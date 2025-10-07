import { useSession } from "next-auth/react";

import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { NewProfileSettingsPage } from "../../../frontend/ui/parametrage-profil/NewProfileSettingsPage";
import Inaccessible from "../../inaccessible";

const Parametrage = () => {
    const { wording, paths } = useDependencies();
    const userSession = useSession();

    useBreadcrumb([
        {
            label: wording.PARAMETRAGE_AUTORISATIONS_TITRE,
            path: `${paths.PROFILES_LIST}`,
        },
        {
            label: wording.PARAMETRAGE_NEW_PROFILE,
            path: "",
        }
    ]);

    if (userSession.data?.user?.role !== 1) {
        return <Inaccessible />
    }

    return <NewProfileSettingsPage />;
}

export default Parametrage;
