import Image from "next/image";

import { StarButton } from "../StarButton/StarButton";
import styles from "./Etablissement.module.css";
import { TuileEtablissementViewModel } from "./TuileEtablissementViewModel";

type EstablishmentProps = Readonly<{
  résultatViewModel: TuileEtablissementViewModel;
}>;

export const Etablissement = ({
  résultatViewModel
}: EstablishmentProps) => {

  return (
    <>
      <div className={"fr-tile " + styles["tuile"]}>
        <div className="fr-tile__body fr-enlarge-link">
          <div className="fr-tile__content">
            <h2 className="fr-tile__title">
              <a href={résultatViewModel.construisLeLien()} rel="noreferrer">
                {résultatViewModel.titre}
              </a>
            </h2>
            <p className={"fr-tile__desc " + styles["description"]}>{résultatViewModel.départementEtCommune}</p>
          </div>
        </div>
        <div>
          <Image alt="" height="40" src={résultatViewModel.afficheLeLogo()} width="40" />
        </div>
      </div>
      <StarButton favorite={résultatViewModel} parent="establishment" />
    </>
  );
};
