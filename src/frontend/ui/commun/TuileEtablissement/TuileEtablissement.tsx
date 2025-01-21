import Image from "next/image";

import { StarButton } from "../StarButton/StarButton";
import styles from "./TuileEtablissement.module.css";
import { TuileEtablissementViewModel } from "./TuileEtablissementViewModel";

type EstablishmentProps = Readonly<{
  tuileEtablissementViewModel: TuileEtablissementViewModel;
}>;

export const TuileEtablissement = ({
  tuileEtablissementViewModel
}: EstablishmentProps) => {

  return (
    <>
      <div className={"fr-tile " + styles["tuile"]}>
        <div className="fr-tile__body fr-enlarge-link">
          <div className="fr-tile__content">
            <h2 className="fr-tile__title">
              <a href={tuileEtablissementViewModel.construisLeLien()} rel="noreferrer">
                {tuileEtablissementViewModel.titre}
              </a>
            </h2>
            <p className={"fr-tile__desc " + styles["description"]}>{tuileEtablissementViewModel.départementEtCommune}</p>
          </div>
        </div>
        <div>
          <Image alt="" height="40" src={tuileEtablissementViewModel.afficheLeLogo()} width="40" />
        </div>
      </div>
      <StarButton favorite={tuileEtablissementViewModel} parent="establishment" />
    </>
  );
};
