import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RegistrationPage } from "../frontend/ui/registration/RegistrationPage";

export default function PageDInscription() {
    const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([]);
    useEffect(() => {
        setIsInfoPage(false);
        localStorage.clear();
    }, [])

    return <RegistrationPage />;
}