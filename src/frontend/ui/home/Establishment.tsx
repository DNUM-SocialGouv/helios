import Image from "next/image";

import { StarButton } from "../commun/StarButton/StarButton";
import { useSearchHistory } from "../search-history/useSearchHistory";
import styles from "./Recherche.module.css";

type EstablishmentProps = Readonly<{
  résultatViewModel: any;
}>;

export const Establishment = ({
  résultatViewModel
}: EstablishmentProps) => {

  const { saveSearchHistory } = useSearchHistory();

  const saveToHistory = () => {
    saveSearchHistory(résultatViewModel.socialReason, résultatViewModel.numéroFiness, résultatViewModel.type);
  }

  return (
    <div className="fr-tile fr-tile--horizontal-md">
      <StarButton favorite={résultatViewModel} />
      <div className="fr-tile__body fr-enlarge-link">
        <h2 className="fr-tile__title">
          <a className="fr-tile__link" href={résultatViewModel.construisLeLien()} onClick={saveToHistory}>
            {résultatViewModel.titre}
          </a>
        </h2>
        <p className={"fr-tile__desc " + styles["description"]}>{résultatViewModel.départementEtCommune}</p>
      </div>
      <div className={styles["tuile"]}>
        <Image alt="" height="40" src={résultatViewModel.afficheLeLogo()} width="40" />
      </div>
    </div>
  );
};
