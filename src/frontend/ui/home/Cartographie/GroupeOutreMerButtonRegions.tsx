import Link from "next/link";

import { useDependencies } from "../../commun/contexts/useDependencies";

interface GroupeOutreMerBoutonRegionsProps {
  regionsList: Readonly<{ key: string; label: string; source: string; text: string }>[];
}


export const GroupeOutreMerBoutonRegions = ({ regionsList }: GroupeOutreMerBoutonRegionsProps) => {
  const { paths } = useDependencies();
  return (
    <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg" style={{ justifyContent: 'center' }}>
      {regionsList.map((region: any) => (
        <li key={region.label}>
          <Link className="fr-btn" href={paths.RÉGION + "/" + region.key} passHref>
            {region.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};
