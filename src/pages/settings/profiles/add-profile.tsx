import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../../../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { NewProfileSettingsPage } from "../../../frontend/ui/parametrage-profil/NewProfileSettingsPage";

const Parametrage = () => {
    const { wording, paths } = useDependencies();
    const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([
        {
            label: wording.PARAMETRAGE_TITRE,
            path: `${paths.PROFILES_LIST}`,
        },
        {
            label: wording.PARAMETRAGE_NEW_PROFILE,
            path: "",
        }
    ]);

    useEffect(() => {
        setIsInfoPage(false);
        localStorage.clear();
    }, [])

    return <NewProfileSettingsPage />;
}

export default Parametrage;