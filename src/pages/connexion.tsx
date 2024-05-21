import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDeConnexion } from "../frontend/ui/login/PageDeConnexion";

export default function PageDAccueil() {
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([]);

  useEffect(() => {
    setIsInfoPage(false);
    localStorage.clear();
  }, []);

  return <PageDeConnexion />;
}
