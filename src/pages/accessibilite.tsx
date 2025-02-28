import Head from "next/head";
import { useContext, useEffect } from "react";

import { PageAccessibilite } from "../frontend/ui/accessibilite/PageAccessibilite";
import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function Accessibilité() {
  const { wording } = useDependencies();
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.ACCESSIBILITÉ,
      path: "",
    },
  ]);

  useEffect(() => {
    if (backToSearchContext)
      backToSearchContext.setIsInfoPage(false);
  }, [backToSearchContext])

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_ACCESSIBILITÉ}</title>
      </Head>
      <PageAccessibilite />
    </main>
  );
}
