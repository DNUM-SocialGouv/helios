import Head from "next/head";

import { FEATURE_NAME } from "../../utils/featureToggle";
import { useDependencies } from "../commun/contexts/useDependencies";
import { BandeauDInformation } from "./Bandeau/BandeauDInformation";
import { Cartographie } from "./Cartographie/Cartographie";
import { FormulaireDeRecherche } from "./FormulaireDeRecherche";
import { RechercheCassée } from "./RechercheCassée";
import { RechercheEnAttente } from "./RechercheEnAttente";
import { RésultatsDeRecherche } from "./RésultatsDeRecherche";
import { useRecherche } from "./useRecherche";

export const PageRecherche = () => {
  const { wording, isFeatureEnabled } = useDependencies();

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

  let bandeau = <></>;

  if (!isFeatureEnabled(FEATURE_NAME.BANDEAU)) {
    bandeau = <BandeauDInformation texte={wording.SITE_EN_CONSTRUCTION} />;
  }

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_ACCUEIL}</title>
      </Head>
      {bandeau}
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
