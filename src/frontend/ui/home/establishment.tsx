import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";

import { UserContext } from "../commun/contexts/userContext";
import styles from "./Recherche.module.css";
import { RechercheViewModel } from "./RechercheViewModel";


type EstablishmentProps = Readonly<{
  résultatViewModel: RechercheViewModel;
}>;

export const Establishment = ({
  résultatViewModel
}: EstablishmentProps) => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const handleFavoriteStatus = (element: RechercheViewModel) => {
    if (userContext?.favoris.includes(résultatViewModel)) {
      userContext?.removeFromFavoris(element);
    } else {
      userContext?.addToFavoris(element);
    }
  }

  return (
    <div className="fr-tile fr-enlarge-link fr-tile--horizontal-md">
      <button
        className={userContext?.favoris.includes(résultatViewModel) ? "fr-icon-star-fill " + styles["star-fill"] : "fr-icon-star-line " + styles["star-line"]}
        onClick={() => handleFavoriteStatus(résultatViewModel)} />
      <div className="fr-tile__body">
        <h2 className="fr-tile__title">
          <button className="fr-tile__link" onClick={() => { router.push(résultatViewModel.construisLeLien()) }}>
            {résultatViewModel.titre}
          </button>
        </h2>
        <p className={"fr-tile__desc " + styles["description"]}>{résultatViewModel.départementEtCommune}</p>
      </div>
      <div className={styles["tuile"]}>
        <Image alt="" height="40" src={résultatViewModel.afficheLeLogo()} width="40" />
      </div>
    </div>
  );
};
