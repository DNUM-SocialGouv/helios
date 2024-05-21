import Head from "next/head";
import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageGestionDeCookies } from "../frontend/ui/gestion-de-cookies/PageGestionDeCookies";

export default function GestionDesCookies() {
  const { wording } = useDependencies();
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.COOKIES,
      path: "",
    },
  ]);

  useEffect(() => {
    setIsInfoPage(false);
    localStorage.clear();
  }, []);

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_GESTION_COOKIES}</title>
      </Head>
      <PageGestionDeCookies />
    </main>
  );
}
