import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";

import { UserContext } from "../commun/contexts/userContext";
import { useFavoris } from "../favoris/useFavoris";
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

  const { addToFavoris, removeFromFavoris } = useFavoris();
  const handleFavoriteStatus = async (element: RechercheViewModel) => {
    const filtredFavoris = userContext?.favoris.filter((item) => item.finessNumber === element.numéroFiness);
    if (filtredFavoris?.length !== 0) {
      await removeFromFavoris('1', element.numéroFiness);
      userContext?.removeFromFavoris(element);
    } else {
      await addToFavoris(element.numéroFiness, element.type, '1');
      userContext?.addToFavoris(element);
    }
  }

  // eslint-disable-next-line no-console
  console.log('userContext?.favoris.includes(résultatViewModel)', userContext?.favoris.includes(résultatViewModel));

  return (
    <div className="fr-tile fr-enlarge-link fr-tile--horizontal-md">
      <button
        className={userContext?.favoris.filter((item) => item.finessNumber === résultatViewModel.numéroFiness).length !== 0 ? "fr-icon-star-fill " + styles["star"] : "fr-icon-star-line " + styles["star"]}
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
