import { useDependencies } from "../contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/tile/tile.min.css";
import { Etablissement } from "../TuileEtablissement/Etablissement";
import { TuileEtablissementViewModel } from "../TuileEtablissement/TuileEtablissementViewModel";
import styles from "./GrilleEtablissement.module.css";

type GrilleEtablissementsProps = Readonly<{
  estCeQueLesRésultatsSontTousAffichés: boolean;
  chargeLesRésultatsSuivants: () => void;
  résultats: TuileEtablissementViewModel[];
}>;

export const GrilleEtablissements = ({
  estCeQueLesRésultatsSontTousAffichés,
  chargeLesRésultatsSuivants,
  résultats,
}: GrilleEtablissementsProps) => {
  const { wording } = useDependencies();

  return (
    <>
      <ul className={"fr-grid-row fr-grid-row--gutters " + styles["tuiles"]}>
        {résultats.map((résultatViewModel, index) => (
          <li className="fr-col-3" key={résultatViewModel.numéroFiness + index}>
            <Etablissement résultatViewModel={résultatViewModel} />
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
