import Head from "next/head";
import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDesDonnéesPersonnelles } from "../frontend/ui/données-personnelles/PageDesDonnéesPersonnelles";

export default function DonnéesPersonnelles() {
  const { wording } = useDependencies();
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.DONNÉES_PERSONNELLES,
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
        <title>{wording.TITRE_PAGE_DONNÉES_PERSONNELLES}</title>
      </Head>
      <PageDesDonnéesPersonnelles />
    </main>
  );
}
