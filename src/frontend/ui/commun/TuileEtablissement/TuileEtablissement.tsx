import Image from "next/image";
import { useContext } from "react";

import { RechercheViewModel } from "../../home/RechercheViewModel";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";
import styles from "./TuileEtablissement.module.css";

type EstablishmentProps = Readonly<{
  rechercheViewModel: RechercheViewModel;
  currentListId?: number;
}>;

export const TuileEtablissement = ({
  rechercheViewModel,
  currentListId,
}: EstablishmentProps) => {
  const userContext = useContext(UserContext);
  const { wording } = useDependencies();
  const processedListId = currentListId || userContext?.favorisLists.find(list => list.isFavoris)?.id;

  const isInFavoris = () => {
    // Pour le moment il n’y a pas les modal de choix de liste.
    // La liste courante est donc obligatoire et doit être la liste « Favoris »
    // Quand il y aura la modale, currentListId sera optionnel et devra être géré

    // On récurére la liste
    const currentList = rechercheViewModel ? userContext?.favorisLists.find(list => list.id === processedListId) : undefined;

    // On regarde si l’element est dans la liste
    if (currentList) {
      return currentList.userListEtablissements.some(etablissement => etablissement.finessNumber === rechercheViewModel?.numéroFiness);
    }

    return false;
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
