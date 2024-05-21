import Head from "next/head";
import { useContext, useEffect, useState } from "react";

import { BackToSearchContext, BackToSearchContextValue } from "../commun/contexts/BackToSearchContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { BandeauCookies } from "../home/Bandeau/BandeauCookies";
import { GroupeOutreMerBoutonRegions } from "../home/Cartographie/GroupeOutreMerButtonRegions";
import { régions, outreMerRegionsList } from "./régions";

export const PageRégion = ({ région }: { région: string }) => {
  const labelDeLaRégion = régions[région].label;
  const [arsRegions, setArsRegions] = useState(outreMerRegionsList);
  const { wording } = useDependencies();
  const { setIsInfoPage } = useContext(BackToSearchContext) as BackToSearchContextValue;

  useBreadcrumb([
    {
      label: labelDeLaRégion !== 'France métropolitaine' ? wording.régionBreadcrumb("Outre-mer (DROM-COM)") : wording.régionBreadcrumb(labelDeLaRégion),
      path: labelDeLaRégion !== 'France métropolitaine' ? "/region/outre-mer" : "",
    },
  ]);

  useEffect(() => {
    setIsInfoPage(false);
    localStorage.clear();
  }, [])

  useEffect(() => {
    const filtredList = outreMerRegionsList.filter((region) => region.label !== labelDeLaRégion);
    setArsRegions(filtredList);
  }, [labelDeLaRégion])

  return (
    <main className="fr-container--fluid">
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
