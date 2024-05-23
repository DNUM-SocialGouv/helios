import Image from "next/image";

import { StarButton } from "../commun/StarButton/StarButton";
import { useSearchHistory } from "../search-history/useSearchHistory";
import styles from "./Recherche.module.css";
import { RechercheViewModel } from "./RechercheViewModel";

type EstablishmentProps = Readonly<{
  résultatViewModel: RechercheViewModel;
}>;

export const Establishment = ({
  résultatViewModel
}: EstablishmentProps) => {

  const { saveSearchHistory } = useSearchHistory();

  const saveToHistory = () => {
    saveSearchHistory(résultatViewModel.socialReason, résultatViewModel.numéroFiness, résultatViewModel.type);
  }

  return (
    <>
      <div className="fr-tile fr-tile--horizontal-md">
        <div className="fr-tile__body fr-enlarge-link">
          <h2 className="fr-tile__title">
            <a className={"fr-tile__link " + styles["hideArrow"]} href={résultatViewModel.construisLeLien()} onClick={saveToHistory} rel="noreferrer" target="_blank">
              {résultatViewModel.titre}
            </a>
          </h2>
          <p className={"fr-tile__desc " + styles["description"]}>{résultatViewModel.départementEtCommune}</p>
        </div>
        <div className={styles["tuile"]}>
          <Image alt="" height="40" src={résultatViewModel.afficheLeLogo()} width="40" />
        </div>
      </div>
      <StarButton favorite={résultatViewModel} parent="establishment" />
    </>
  );
};
