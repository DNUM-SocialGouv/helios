import { useContext, useEffect } from "react";

import { ChangePwdPage } from "../frontend/ui/change-mot-passe/ChangePwdPage";
import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function MotPasseOublie() {
  const { wording } = useDependencies();
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.CHANGEMENT_MOT_PASSE_TITRE,
      path: "",
    },
  ]);

  useEffect(() => {
    setIsInfoPage(false);
    localStorage.clear();
  }, []);

  return <ChangePwdPage />;
}

