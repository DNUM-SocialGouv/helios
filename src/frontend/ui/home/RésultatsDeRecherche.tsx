import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import { GrilleEtablissements } from "../commun/GrilleEtablissements/GrilleEtablissements";
import { RechercheViewModel } from "./RechercheViewModel";

type RésultatsDeRechercheProps = Readonly<{
  estCeQueLesRésultatsSontTousAffichés: boolean;
  chargeLesRésultatsSuivants: () => void;
  nombreRésultats: number;
  résultats: RechercheViewModel[];
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

  return (
    <section aria-label={wording.RÉSULTAT_DE_RECHERCHE}>
      <p className="fr-h6 fr-mt-4w">
        {(nombreRésultats === 0 && wording.aucunRésultat(termeFixe)) || wording.rechercheNombreRésultats(nombreRésultats, termeFixe)}
      </p>
      <GrilleEtablissements chargeLesRésultatsSuivants={chargeLesRésultatsSuivants} estCeQueLesRésultatsSontTousAffichés={estCeQueLesRésultatsSontTousAffichés} résultats={résultats} />
    </section>
  );
};
