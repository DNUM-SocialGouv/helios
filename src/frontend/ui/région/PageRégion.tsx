import Head from "next/head";
import { useEffect, useState } from "react";

import { régions, outreMerRegionsList } from "./régions";
import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { BandeauCookies } from "../home/Bandeau/BandeauCookies";
import { GroupeOutreMerBoutonRegions } from "../home/Cartographie/GroupeOutreMerButtonRegions";

export const PageRégion = ({ région }: { région: string }) => {
  const labelDeLaRégion = régions[région].label;
  const [arsRegions, setArsRegions] = useState(outreMerRegionsList);
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: labelDeLaRégion !== 'France métropolitaine' ? wording.régionBreadcrumb("Outre-mer (DROM-COM)") : wording.régionBreadcrumb(labelDeLaRégion),
      path: labelDeLaRégion !== 'France métropolitaine' ? "/region/outre-mer" : "",
    },
  ]);

  useEffect(() => {
    const filtredList = outreMerRegionsList.filter((region) => region.label !== labelDeLaRégion);
    setArsRegions(filtredList);
  }, [labelDeLaRégion])

  return (
    <main className="fr-container--fluid" id="content">
      <Head>
        <title>{labelDeLaRégion}</title>
      </Head>
      <section>
        <h1 className="fr-container">{labelDeLaRégion}</h1>
        {labelDeLaRégion !== 'France métropolitaine' && <GroupeOutreMerBoutonRegions regionsList={arsRegions} />}
        <BandeauCookies texte={wording.COOKIES_ATLASSANTÉ} />
        <iframe allowFullScreen height="650" src={régions[région].source} title={wording.régionAtlasSanté(régions[région].label)} width="100%" />
      </section>
    </main>
  );
};
