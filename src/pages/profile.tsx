import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ProfilePage } from "../frontend/ui/profile/ProfilePage";

export default function Profile() {
    const { wording } = useDependencies();
    const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

    useBreadcrumb([
        {
            label: wording.USER_PROFILE,
            path: "",
        },
    ]);

    useEffect(() => {
        setIsInfoPage(false);
        localStorage.clear();
    }, []);

    return <ProfilePage />;
}
