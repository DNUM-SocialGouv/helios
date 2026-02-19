import Head from "next/head";
import { useEffect, useState } from "react";

import { Cartographie } from "./Cartographie/Cartographie";
import { FormulaireDeRecherche } from "./FormulaireDeRecherche";
import { RechercheCassée } from "./RechercheCassée";
import { RechercheEnAttente } from "./RechercheEnAttente";
import { RésultatsDeRecherche } from "./RésultatsDeRecherche";
import { useRecherche } from "./useRecherche";
import { PasswordStatus } from "../../../backend/métier/entities/Utilisateur/RésultatLogin";
import { useDependencies } from "../commun/contexts/useDependencies";
import { NewFeaturesNotice } from "../commun/NewFeaturesNotice/NewFeaturesNotice";
import { PasswordWarnningNotice } from "../commun/PasswordWarningNotice/PasswordWarningNotice";

type PageRechercheProps = {
  passwordStatus: PasswordStatus;
};

export const PageRecherche = ({ passwordStatus }: PageRechercheProps) => {
  const { wording } = useDependencies();
  const [displayTable, setDisplayTable] = useState(false);

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
    pageInitiale,
    defaultOrder,
    defaultOrderBy
  } = useRecherche();

  const showNotice = new Date() <= new Date(wording.NOUVELLES_FONCTIONNALITÉS_DATE_FIN);
  const showPasswordWarning = passwordStatus.status === 'warning';

  useEffect(() => {
    async function loadDisplayKind() {
      const storedDisplayTable = (localStorage.getItem('displayTable') ?? 'false') === 'true';
      setDisplayTable(storedDisplayTable);
      localStorage.setItem('FromBackToSearch', 'false');
      const terme = localStorage.getItem('searchItem') ?? '';

      if (!displayTable) {
        rechercher(terme, pageInitiale);
      } else {
        rechercher(terme, pageInitiale, defaultOrder, defaultOrderBy, storedDisplayTable)
      }
    }

    if (localStorage.getItem('searchItem') && localStorage.getItem('FromBackToSearch') === 'true') {
      loadDisplayKind();
    }
  }, [])

  return (
    <main id="content">
      <Head>
        <title>{wording.TITRE_PAGE_ACCUEIL}</title>
      </Head>
      <div className="fr-container">
        {showPasswordWarning ? <PasswordWarnningNotice daysLeft={passwordStatus.daysLeft} /> : null}
        {showNotice ? <NewFeaturesNotice /> : null}
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
