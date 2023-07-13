import Image from "next/image";
import { useContext } from "react";

import { UserContext } from "../commun/contexts/userContext";
import { useFavoris } from "../favoris/useFavoris";
import styles from "./Recherche.module.css";
import { RechercheViewModel } from "./RechercheViewModel";

type EstablishmentProps = Readonly<{
  résultatViewModel: any;
}>;

export const Establishment = ({
  résultatViewModel
}: EstablishmentProps) => {
  const userContext = useContext(UserContext);

  const { addToFavoris, removeFromFavoris } = useFavoris();
  const handleFavoriteStatus = async (element: RechercheViewModel) => {
    const filtredFavoris = userContext?.favoris.filter((item) => item.numéroFiness === element.numéroFiness);

    if (filtredFavoris?.length !== 0) {
      await removeFromFavoris('1', element.numéroFiness);
      userContext?.removeFromFavoris(element);
    } else {
      await addToFavoris(element.numéroFiness, element.type, '1', element.commune, element.departement, element.socialReason);
      userContext?.addToFavoris(element);
    }
  }

  return (
    <div className="fr-tile fr-tile--horizontal-md">
      <button
        className={userContext?.favoris.filter((item) => item.numéroFiness === résultatViewModel.numéroFiness).length !== 0 ? "fr-icon-star-fill " + styles["star"] : "fr-icon-star-line " + styles["star"]}
        onClick={() => handleFavoriteStatus(résultatViewModel)} />
      <div className="fr-tile__body fr-enlarge-link">
        <h2 className="fr-tile__title">
          <a className="fr-tile__link" href={résultatViewModel.construisLeLien()}>
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
