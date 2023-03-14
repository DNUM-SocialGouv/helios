import Head from "next/head";

import { useDependencies } from "../commun/contexts/useDependencies";
import { BandeauDInformation } from "./BandeauDInformation";
import { Cartographie } from "./Cartographie";
import { FormulaireDeRecherche } from "./FormulaireDeRecherche";
import { RechercheCassée } from "./RechercheCassée";
import { RechercheEnAttente } from "./RechercheEnAttente";
import { RésultatsDeRecherche } from "./RésultatsDeRecherche";
import { useRecherche } from "./useRecherche";

export const PageRecherche = () => {
  const { wording } = useDependencies();

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
      <BandeauDInformation texte={wording.SITE_EN_CONSTRUCTION} />
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
