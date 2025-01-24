import Image from "next/image";

import { StarButtonList } from "../commun/StarButtonList/StarButtonList";
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
      <div className={"fr-tile fr-tile--horizontal-md " + styles["tuile"]}>
        <div className="fr-tile__body fr-enlarge-link">
          <h2 className="fr-tile__title">
            <a href={résultatViewModel.construisLeLien()} onClick={saveToHistory} rel="noreferrer">
              {résultatViewModel.titre}
            </a>
          </h2>
          <p className={"fr-tile__desc " + styles["description"]}>{résultatViewModel.départementEtCommune}</p>
        </div>
        <div>
          <Image alt="" height="40" src={résultatViewModel.afficheLeLogo()} width="40" />
        </div>
      </div>
      <StarButtonList favorite={résultatViewModel} parent="establishment" />
    </>
  );
};
