import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDeConnexion } from "../frontend/ui/login/PageDeConnexion";

export default function PageDAccueil() {
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([]);

  useEffect(() => {
    if (backToSearchContext) {
      backToSearchContext.setIsInfoPage(false);
      localStorage.clear();
    }
  }, [backToSearchContext])

  return <PageDeConnexion />;
}
