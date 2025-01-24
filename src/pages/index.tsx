import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { useFavoris } from "../frontend/ui/favoris/useFavoris";
import { PageRecherche } from "../frontend/ui/home/PageRecherche";

export default function PageDAccueil() {
  useBreadcrumb([]);
  const { getFavorisLists } = useFavoris();

  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useEffect(() => {
    getFavorisLists();
  }, []);

  useEffect(() => {
    if (backToSearchContext) {
      backToSearchContext.setIsInfoPage(false);
    }
  }, [backToSearchContext])

  return <PageRecherche />;
}
