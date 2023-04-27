import Link from "next/link";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { régions } from "../../région/régions";

export const GroupeBoutonRegions = () => {
  const { paths } = useDependencies();
  return (
    <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
      <li>
        <Link className="fr-btn" href={paths.RÉGION + "/france-metropolitaine"} passHref>
          {régions["france-metropolitaine"].label}
        </Link>
      </li>
      <li>
        <Link className="fr-btn" href={paths.RÉGION + "/outre-mer"} passHref>
          {régions["outre-mer"].label}
        </Link>
      </li>
    </ul>
  );
};
