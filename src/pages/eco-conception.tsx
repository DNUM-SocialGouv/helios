import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageEcoConception } from "../frontend/ui/eco-conception/PageEcoConception";
import { FEATURE_NAME } from "../frontend/utils/featureToggle";

export default function EcoConception() {
  const { wording, isFeatureEnabled } = useDependencies();
  useBreadcrumb([
    {
      label: wording.ECO_CONCEPTION,
      path: "",
    },
  ]);

  if (!isFeatureEnabled(FEATURE_NAME.ECO_CONCEPTION)) {
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
        <title>{wording.TITRE_PAGE_ECO_CONCEPTION}</title>
      </Head>
      <PageEcoConception />
    </main>
  );
}
