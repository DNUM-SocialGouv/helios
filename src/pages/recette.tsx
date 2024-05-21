import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDeRecette } from "../frontend/ui/recette/PageDeRecette";

export default function Recette() {
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([]);
  useEffect(() => {
    setIsInfoPage(false);
    localStorage.clear();
  }, [])

  return <PageDeRecette />;
}
