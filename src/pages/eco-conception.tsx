import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageEcoConception } from "../frontend/ui/eco-conception/PageEcoConception";

export default function EcoConception() {
  const { wording } = useDependencies();
  useBreadcrumb([
    {
      label: wording.ECO_CONCEPTION,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_ECO_CONCEPTION}</title>
      </Head>
      <PageEcoConception />
    </main>
  );
}
