import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageGestionDeCookies } from "../frontend/ui/gestion-de-cookies/PageGestionDeCookies";
import { FEATURE_NAME } from "../frontend/utils/featureToggle";

export default function GestionDesCookies() {
  const { wording, isFeatureEnabled } = useDependencies();
  useBreadcrumb([
    {
      label: wording.COOKIES,
      path: "",
    },
  ]);

  if (!isFeatureEnabled(FEATURE_NAME.COOKIES)) {
    return (
      <>
        <main className="fr-container">
          <h1 className="inaccessible">{wording.ACCÈS_REFUSÉ}</h1>
        </main>
      </>
    );
  }

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_GESTION_COOKIES}</title>
      </Head>
      <PageGestionDeCookies />
    </main>
  );
}
