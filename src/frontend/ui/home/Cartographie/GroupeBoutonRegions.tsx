import DOMPurify from 'dompurify';
import Link from "next/link";
import "@gouvfr/dsfr/dist/component/sidemenu/sidemenu.min.css";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { régions, outreMerRegionsList } from "../../région/régions";

export const GroupeBoutonRegions = () => {
  const { paths } = useDependencies();
  const router = useRouter()

  const handleOnChangeOutreMerRegions = (e: ChangeEvent<HTMLSelectElement>) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    router.push(sanitizedValue);
  }

  return (
    <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
      <li>
        <Link className="fr-btn" href={paths.RÉGION + "/france-metropolitaine"} passHref>
          {régions["france-metropolitaine"].label}
        </Link>
      </li>
      <li>
        <select className="fr-btn" onChange={handleOnChangeOutreMerRegions}>
          <option disabled hidden selected value="">{régions["outre-mer"].label}</option>
          <option style={{ backgroundColor: 'white', color: 'black' }} value="/region/outre-mer">{régions["outre-mer"].label}</option>
          {outreMerRegionsList.map((region) => (
            <option key={region.key} style={{ backgroundColor: 'white', color: 'black' }} value={`/region/${region.key}`}>{region.label}</option>
          ))}
        </select>
      </li>
    </ul>
  );
};
