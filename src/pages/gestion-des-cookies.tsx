import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageGestionDeCookies } from "../frontend/ui/gestion-de-cookies/PageGestionDeCookies";

export default function GestionDesCookies() {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.COOKIES,
      path: "",
    },
  ]);

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_GESTION_COOKIES}</title>
      </Head>
      <PageGestionDeCookies />
    </main>
  );
}
