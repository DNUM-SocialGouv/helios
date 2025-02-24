import Head from "next/head";
import { useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { NewFeaturesNotice } from "../commun/NewFeaturesNotice/NewFeaturesNotice";
import { Cartographie } from "./Cartographie/Cartographie";
import { FormulaireDeRecherche } from "./FormulaireDeRecherche";
import { RechercheCassée } from "./RechercheCassée";
import { RechercheEnAttente } from "./RechercheEnAttente";
import { RésultatsDeRecherche } from "./RésultatsDeRecherche";
import { useRecherche } from "./useRecherche";

export const PageRecherche = () => {
  const { wording } = useDependencies();
  const [displayTable, setDisplayTable] = useState(true);

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
    rechercher,
  } = useRecherche();

  const showNotice = new Date() <= new Date('2025-03-28');

  useEffect(() => {
    if (localStorage.getItem('searchItem') && localStorage.getItem('FromBackToSearch') === 'true') {
      rechercher(localStorage.getItem('searchItem') ?? '', 1);
      localStorage.setItem('FromBackToSearch', 'false');
    }
  }, [])

  return (
    <main>
      <Head>
        <title>{wording.TITRE_PAGE_ACCUEIL}</title>
      </Head>
      {showNotice ? <NewFeaturesNotice /> : null}
      <div className="fr-container">
        <FormulaireDeRecherche isLoading={estCeEnAttente} lancerLaRecherche={(e) => lancerLaRecherche(e, displayTable)} rechercheOnChange={rechercheOnChange} terme={terme} />

        {estCeEnAttente && <RechercheEnAttente />}

        {estCeQueLeBackendNeRépondPas && <RechercheCassée />}

        {estCeQueLesRésultatsSontReçus && (
          <RésultatsDeRecherche
            chargeLesRésultatsSuivants={chargeLesRésultatsSuivants}
            displayTable={displayTable}
            estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés()}
            lancerLaRecherche={lancerLaRecherche}
            nombreRésultats={nombreRésultats}
            rechercher={rechercher}
            résultats={résultats}
            setDisplayTable={setDisplayTable}
            termeFixe={termeFixe}
          />
        )}
        <Cartographie />
      </div>
    </main>
  );
};
