import Image from "next/image";

import { useDependencies } from "../../commun/contexts/useDependencies";
import carteFrance from "./carte-france.svg";
import "@gouvfr/dsfr/dist/component/card/card.min.css";
import styles from "./Cartographie.module.css";
import { GroupeBoutonRegions } from "./GroupeBoutonRegions";

export const Cartographie = () => {
  const { wording } = useDependencies();

  return (
    <section aria-label={wording.CARTOGRAPHIE}>
      <h2 className={styles["titre"]}></h2>
      <div className="fr-card fr-card--horizontal fr-card--no-arrow">
        <div className={"fr-card__body " + styles["body"]}>
          <div className="fr-card__content">
            <h3 className="fr-card__title">{wording.CARTOGRAPHIE}</h3>
            <p className="fr-card__desc">{wording.CARTOGRAPHIE_DESCRIPTION}</p>
          </div>
          <div className="fr-card__footer">
            <GroupeBoutonRegions />
          </div>
        </div>
        <div>
          <Image alt="" height="300" src={carteFrance} width="300" />
        </div>
      </div>
    </section>
  );
};
