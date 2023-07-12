import Head from "next/head";
import { useEffect } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useFavoris } from "../favoris/useFavoris";
import { Cartographie } from "./Cartographie/Cartographie";
import { FormulaireDeRecherche } from "./FormulaireDeRecherche";
import { RechercheCassée } from "./RechercheCassée";
import { RechercheEnAttente } from "./RechercheEnAttente";
import { RésultatsDeRecherche } from "./RésultatsDeRecherche";
import { useRecherche } from "./useRecherche";

export const PageRecherche = () => {
  const { wording } = useDependencies();
  const { getAllFavoris } = useFavoris();


  useEffect(() => {
    getAllFavoris('1');
  }, []);

  const {
    estCeEnAttente,
    estCeQueLeBackendNeRépondPas,
    estCeQueLesRésultatsSontReçus,
    estCeQueLesRésultatsSontTousAffichés,
    chargeLesRésultatsSuivants,
    lancerLaRecherche,
    nombreRésultats,
    rechercheOnChange,
    résultats,
    terme,
    termeFixe,
  } = useRecherche();

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_ACCUEIL}</title>
      </Head>
      <FormulaireDeRecherche isLoading={estCeEnAttente} lancerLaRecherche={lancerLaRecherche} rechercheOnChange={rechercheOnChange} terme={terme} />

      {estCeEnAttente && <RechercheEnAttente />}

      {estCeQueLeBackendNeRépondPas && <RechercheCassée />}

      {estCeQueLesRésultatsSontReçus && (
        <RésultatsDeRecherche
          chargeLesRésultatsSuivants={chargeLesRésultatsSuivants}
          estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés()}
          nombreRésultats={nombreRésultats}
          résultats={résultats}
          termeFixe={termeFixe}
        />
      )}
      <Cartographie />
    </main>
  );
};
