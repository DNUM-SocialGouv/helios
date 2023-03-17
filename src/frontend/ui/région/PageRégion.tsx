import Head from "next/head";

import { FEATURE_NAME } from "../../utils/featureToggle";
import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { BandeauCookies } from "../home/Bandeau/BandeauCookies";
import { régions } from "./régions";

export const PageRégion = ({ région }: { région: string }) => {
  const labelDeLaRégion = régions[région].label;
  const { wording, isFeatureEnabled } = useDependencies();
  useBreadcrumb([
    {
      label: wording.régionBreadcrumb(labelDeLaRégion),
      path: "",
    },
  ]);

  let bandeau = <BandeauCookies texte={wording.COOKIES_ATLASSANTÉ} />;

  if (!isFeatureEnabled(FEATURE_NAME.CARTO_FRANCE_METROPOLE)) {
    bandeau = <></>;
  }

  return (
    <main className="fr-container--fluid">
      <Head>
        <title>{labelDeLaRégion}</title>
      </Head>
      <section>
        <h1 className="fr-container">{labelDeLaRégion}</h1>
        {bandeau}
        <iframe allowFullScreen height="650" src={régions[région].source} title={wording.régionAtlasSanté(régions[région].label)} width="100%" />
      </section>
    </main>
  );
};
