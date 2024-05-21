import Head from "next/head";
import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDesDonnéesPersonnelles } from "../frontend/ui/données-personnelles/PageDesDonnéesPersonnelles";

export default function DonnéesPersonnelles() {
  const { wording } = useDependencies();
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.DONNÉES_PERSONNELLES,
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
        <title>{wording.TITRE_PAGE_DONNÉES_PERSONNELLES}</title>
      </Head>
      <PageDesDonnéesPersonnelles />
    </main>
  );
}
