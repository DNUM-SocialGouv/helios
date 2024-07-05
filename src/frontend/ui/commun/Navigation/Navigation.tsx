import "@gouvfr/dsfr/dist/component/navigation/navigation.min.css";
import Link from "next/link";

interface Ilink {
  name: string;
  url: string;
}

export const Navigation = ({ data, current_url }: { data: Ilink[]; current_url: string }) => {
  if (!data) return null;
  return (
    <nav aria-label="Menu principal" className="fr-nav" id="header-navigation" role="navigation">
      <ul className="fr-nav__list">
        {data.map((link, index: number) => {
          let inputProps = {};
          if (link.url === current_url) {
            inputProps = { "aria-current": "page" };
          }

          return (
            <li className="fr-nav__item" key={index}>
              <Link {...inputProps} className="fr-nav__link" href={link.url} target="_self">
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
