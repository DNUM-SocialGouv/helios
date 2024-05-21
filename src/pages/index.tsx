import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageRecherche } from "../frontend/ui/home/PageRecherche";

export default function PageDAccueil() {
  useBreadcrumb([]);
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useEffect(() => {
    setIsInfoPage(false);
  }, [])

  return <PageRecherche />;
}
