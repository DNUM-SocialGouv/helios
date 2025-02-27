import Head from "next/head";
import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageGestionDeCookies } from "../frontend/ui/gestion-de-cookies/PageGestionDeCookies";

export default function GestionDesCookies() {
  const { wording } = useDependencies();
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.COOKIES,
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
        <title>{wording.TITRE_PAGE_GESTION_COOKIES}</title>
      </Head>
      <PageGestionDeCookies />
    </main>
  );
}
