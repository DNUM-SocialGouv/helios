import Image from "next/image";

import { RechercheViewModel } from "../../home/RechercheViewModel";
import { StarButtonList } from "../StarButtonList/StarButtonList";
import styles from "./TuileEtablissement.module.css";

type EstablishmentProps = Readonly<{
  rechercheViewModel: RechercheViewModel;
  currentListId?: number;
  rafraichitAuRetraitFavoris?: boolean;
}>;

export const TuileEtablissement = ({
  rechercheViewModel,
  currentListId,
  rafraichitAuRetraitFavoris,
}: EstablishmentProps) => {
  return (
    <>
      <div className={"fr-tile " + styles["tuile"]}>
        <div className="fr-tile__body fr-enlarge-link">
          <div className="fr-tile__content">
            <h2 className="fr-tile__title">
              <a className={styles["texte-noir"]} href={rechercheViewModel.construisLeLien()} rel="noreferrer">
                {rechercheViewModel.titre}
              </a>
            </h2>
            <p className={"fr-tile__desc " + styles["description"]}>{rechercheViewModel.départementEtCommune}</p>
          </div>
        </div>
        <div>
          <Image alt="" height="40" src={rechercheViewModel.afficheLeLogo()} width="40" />
        </div>
      </div>
      <StarButtonList currentListId={currentListId} favorite={rechercheViewModel} parent="establishment" rafraichitAuRetraitFavoris={rafraichitAuRetraitFavoris} />
    </>
  );
};
