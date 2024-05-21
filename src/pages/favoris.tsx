import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { FavorisPage } from "../frontend/ui/favoris/FavorisPage";

export default function Favoris() {
    const { wording } = useDependencies();
    const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([
        {
            label: wording.FAVORIS_LIST,
            path: "",
        },
    ]);

    useEffect(() => {
        setIsInfoPage(false);
        localStorage.clear();
    }, []);

    return <FavorisPage />;
}