import Head from "next/head";
import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageEcoConception } from "../frontend/ui/eco-conception/PageEcoConception";

export default function EcoConception() {
  const { wording } = useDependencies();
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.ECO_CONCEPTION,
      path: "",
    },
  ]);

  useEffect(() => {
    if (backToSearchContext) {
      backToSearchContext.setIsInfoPage(false);
      localStorage.clear();
    }
  }, [backToSearchContext])

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_ECO_CONCEPTION}</title>
      </Head>
      <PageEcoConception />
    </main>
  );
}
