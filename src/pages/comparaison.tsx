import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ComparaisonPage } from "../frontend/ui/comparaison/ComparaisonPage";

export default function Comparison() {
    const { wording } = useDependencies();
    const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([
        {
            label: wording.COMPARAISON,
            path: "",
        },
    ]);

    useEffect(() => {
        if (backToSearchContext) {
            backToSearchContext.setIsInfoPage(false);
            localStorage.clear();
        }
    }, [backToSearchContext])

    return <ComparaisonPage />;
}