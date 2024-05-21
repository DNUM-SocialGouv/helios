import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { SearchHistoryPage } from "../frontend/ui/search-history/SearchHistoryPage";

export default function Favoris() {
    const { wording } = useDependencies();
    const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([
        {
            label: wording.HISTORIQUE_DE_RECHERECHE_TITRE,
            path: "",
        },
    ]);

    useEffect(() => {
        setIsInfoPage(false);
    }, []);
    return <SearchHistoryPage />;
}