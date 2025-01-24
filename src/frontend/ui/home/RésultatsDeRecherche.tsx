import { useContext } from "react";

import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { GrilleEtablissements } from "../commun/GrilleEtablissements/GrilleEtablissements";
import { TuileEtablissementViewModel } from "../commun/TuileEtablissement/TuileEtablissementViewModel";

type RésultatsDeRechercheProps = Readonly<{
  estCeQueLesRésultatsSontTousAffichés: boolean;
  chargeLesRésultatsSuivants: () => void;
  nombreRésultats: number;
  résultats: TuileEtablissementViewModel[];
  termeFixe: string;
}>;

export const RésultatsDeRecherche = ({
  estCeQueLesRésultatsSontTousAffichés,
  chargeLesRésultatsSuivants,
  nombreRésultats,
  résultats,
  termeFixe,
}: RésultatsDeRechercheProps) => {
  const { wording } = useDependencies();
  const context = useContext(UserContext);
  const favorisListId = context?.favorisLists.find(list => list.isFavoris)?.id || -1;

  return (
    <section aria-label={wording.RÉSULTAT_DE_RECHERCHE}>
      <p className="fr-h6 fr-mt-4w">
        {(nombreRésultats === 0 && wording.aucunRésultat(termeFixe)) || wording.rechercheNombreRésultats(nombreRésultats, termeFixe)}
      </p>
      <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} currentListId={favorisListId} estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés} résultats={résultats} />
    </section>
  );
};
