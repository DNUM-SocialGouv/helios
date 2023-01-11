import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageDesMentionsLégales } from "../frontend/ui/mentions-légales/PageDesMentionsLégales";

export default function MentionsLégales() {
  const { wording } = useDependencies();
  useBreadcrumb([
    {
      label: wording.MENTIONS_LÉGALES,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_MENTIONS_LÉGALES}</title>
      </Head>
      <PageDesMentionsLégales />
    </main>
  );
}
