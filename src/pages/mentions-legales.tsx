import Head from "next/head";
import { useContext, useEffect } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../frontend/ui/commun/contexts/BackToSearchContext";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDesMentionsLégales } from "../frontend/ui/mentions-légales/PageDesMentionsLégales";

export default function MentionsLégales() {
  const { wording } = useDependencies();
  const backToSearchContext = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: wording.MENTIONS_LÉGALES,
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
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_MENTIONS_LÉGALES}</title>
      </Head>
      <PageDesMentionsLégales />
    </main>
  );
}
