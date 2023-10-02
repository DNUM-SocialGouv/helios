import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../frontend/ui/commun/hooks/useBreadcrumb";
import { NewProfileSettingsPage } from "../../frontend/ui/parametrage-profil/NewProfileSettingsPage";

const Parametrage = () => {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.PARAMETRAGE_NEW_PROFILE,
            path: "",
        },
    ]);
    return <NewProfileSettingsPage />;
}

export default Parametrage;