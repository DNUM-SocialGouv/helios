import Image from "next/image";

import { useDependencies } from "../../commun/contexts/useDependencies";
import carteFrance from "./carte-france.svg";
import "@gouvfr/dsfr/dist/component/card/card.min.css";
import styles from "./Cartographie.module.css";
import { GroupeBoutonRegions } from "./GroupeBoutonRegions";
import { FEATURE_NAME } from "../../../utils/featureToggle";

export const Cartographie = () => {
  const { wording, isFeatureEnabled } = useDependencies();
  let title = "";
  let cardTitle = wording.CARTOGRAPHIE;

  if (!isFeatureEnabled(FEATURE_NAME.CARTO_FRANCE_METROPOLE)) {
    title = wording.CARTOGRAPHIE;
    cardTitle = wording.OFFRE_SANTÉ_PAR_REGION;
  }

  return (
    <section aria-label={wording.CARTOGRAPHIE}>
      <h2 className={styles["titre"]}>{title}</h2>
      <div className="fr-card fr-card--horizontal fr-card--no-arrow">
        <div className={"fr-card__body " + styles["body"]}>
          <div className="fr-card__content">
            <h3 className="fr-card__title">{cardTitle}</h3>
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
