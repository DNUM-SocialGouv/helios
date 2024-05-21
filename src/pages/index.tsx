import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageRecherche } from "../frontend/ui/home/PageRecherche";

export default function PageDAccueil() {
  useBreadcrumb([]);
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useEffect(() => {
    if (backToSearchContext) {
      backToSearchContext.setIsInfoPage(false);
      localStorage.clear();
    }
  }, [backToSearchContext])

  return <PageRecherche />;
}
