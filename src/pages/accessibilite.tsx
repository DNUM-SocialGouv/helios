import Head from "next/head";

import { PageAccessibilite } from "../frontend/ui/accessibilite/PageAccessibilite";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function Accessibilité() {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.ACCESSIBILITÉ,
      path: "",
    },
  ]);

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_ACCESSIBILITÉ}</title>
      </Head>
      <PageAccessibilite />
    </main>
  );
}
