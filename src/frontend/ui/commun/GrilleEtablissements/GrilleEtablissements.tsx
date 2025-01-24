import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { TuileEtablissement } from "../TuileEtablissement/TuileEtablissement";
import styles from "./GrilleEtablissement.module.css";

type GrilleEtablissementsProps = Readonly<{
  estCeQueLesRésultatsSontTousAffichés: boolean;
  chargeLesRésultatsSuivants: () => void;
  résultats: RechercheViewModel[];
  currentListId?: number;
  rafraichitAuRetraitFavoris?: boolean;
}>;

export const GrilleEtablissements = ({
  estCeQueLesRésultatsSontTousAffichés,
  chargeLesRésultatsSuivants,
  résultats,
  currentListId,
  rafraichitAuRetraitFavoris,
}: GrilleEtablissementsProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <ul className={"fr-grid-row fr-grid-row--gutters " + styles["tuiles"]}>
        {résultats.map((rechercheViewModel, index) => (
          <li className="fr-col-3" key={rechercheViewModel.numéroFiness + index}>
            <TuileEtablissement currentListId={currentListId} rafraichitAuRetraitFavoris={rafraichitAuRetraitFavoris} rechercheViewModel={rechercheViewModel} />
          </li>
        ))}
      </ul>
      {!estCeQueLesRésultatsSontTousAffichés && (
        <div className={styles["voir-plus-de-résultats"]}>
          <button className="fr-btn fr-btn--secondary" onClick={chargeLesRésultatsSuivants}>
            {wording.VOIR_PLUS_RÉSULTATS}
          </button>
        </div>
      )}
    </>
  );
};
