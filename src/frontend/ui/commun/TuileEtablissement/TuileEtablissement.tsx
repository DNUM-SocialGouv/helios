import Image from "next/image";
import { useContext } from "react";

import styles from "./TuileEtablissement.module.css";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";

type EstablishmentProps = Readonly<{
  rechercheViewModel: RechercheViewModel;
  currentListId?: number;
}>;

export const TuileEtablissement = ({
  rechercheViewModel,
}: EstablishmentProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();


  const isInFavoris = () => {
    const isInFav = userContext?.favorisLists.some((list) => list.userListEtablissements.some((etablissement) => etablissement.finessNumber === rechercheViewModel.numéroFiness));
    return isInFav;
  }


  return (
    <>
      <div className={"fr-tile " + styles["tuile"]}>
        <div className="fr-tile__body fr-enlarge-link">
          <div className={"fr-tile__content " + styles["content"]}>
            <h2 className="fr-tile__title">
              <a className={styles["texte-noir"]} href={rechercheViewModel.construisLeLien()} rel="noreferrer">
                {rechercheViewModel.titre}
              </a>
            </h2>
            <p className={"fr-tile__desc " + styles["description"]}>{rechercheViewModel.départementEtCommune}</p>
          </div>
        </div>
        <div>
          <Image alt="" className={styles["logo"]} height="40" src={rechercheViewModel.afficheLeLogo()} width="40" />
        </div>
      </div>
      <div className={(isInFavoris() ? "fr-icon-star-fill .fr-icon--lg " + styles["starInEstablishment"] : "fr-icon-star-line .fr-icon--lg " + styles["hidden-star"])}>
        <span className="fr-sr-only">
          {isInFavoris() ? wording.DANS_FAVORIS : wording.NON_FAVORIS}
        </span>
      </div>
    </>
  );
};
