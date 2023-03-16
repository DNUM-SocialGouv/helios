import Link from "next/link";

import { FEATURE_NAME } from "../../../utils/featureToggle";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { régions } from "../../région/régions";

export const GroupeBoutonRegions = () => {
  const { paths, isFeatureEnabled } = useDependencies();

  if (!isFeatureEnabled(FEATURE_NAME.CARTO_FRANCE_METROPOLE)) {
    return (
      <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
        <li>
          <Link className="fr-btn" href={paths.RÉGION + "/auvergne-rhone-alpes"} passHref>
            {régions["auvergne-rhone-alpes"].label}
          </Link>
        </li>
        <li>
          <Link className="fr-btn" href={paths.RÉGION + "/occitanie"} passHref>
            {régions["occitanie"].label}
          </Link>
        </li>
        <li>
          <Link className="fr-btn" href={paths.RÉGION + "/bretagne"} passHref>
            {régions["bretagne"].label}
          </Link>
        </li>
        <li>
          <Link className="fr-btn" href={paths.RÉGION + "/pays-de-la-loire"} passHref>
            {régions["pays-de-la-loire"].label}
          </Link>
        </li>
      </ul>
    );
  }
  return (
    <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
      <li>
        <Link className="fr-btn" href={paths.RÉGION + "/france-metropolitaine"} passHref>
          {régions["france-metropolitaine"].label}
        </Link>
      </li>
    </ul>
  );
};
