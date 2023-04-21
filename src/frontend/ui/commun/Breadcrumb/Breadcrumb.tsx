import Link from "next/link";
import { ReactChild } from "react";
import "@gouvfr/dsfr/dist/component/breadcrumb/breadcrumb.min.css";

import { useDependencies } from "../contexts/useDependencies";
import { useBreadcrumb } from "../hooks/useBreadcrumb";

export const Breadcrumb = () => {
  const { wording } = useDependencies();
  const { breadcrumb } = useBreadcrumb([]);

  if (breadcrumb.length === 0) return null;

  const HomeAndBreadcrumb = [
    {
      label: wording.ACCUEIL as ReactChild,
      path: "/",
    },
  ].concat(breadcrumb);

  return (
    <section className="fr-container">
      <nav aria-label={wording.VOUS_ÊTES_ICI} className="fr-breadcrumb">
        <button aria-controls="breadcrumb-1" aria-expanded="false" className="fr-breadcrumb__button" type="button">
          {wording.VOIR_LE_FIL_D_ARIANE}
        </button>
        <div className="fr-collapse" id="breadcrumb-1">
          <ol className="fr-breadcrumb__list">
            {HomeAndBreadcrumb.map((item, index) => (
              <li key={index}>
                {item.path === "" ? (
                  <button aria-current="page" className="fr-breadcrumb__link">
                    {item.label}
                  </button>
                ) : (
                  <Link className="fr-breadcrumb__link" href={item.path} passHref prefetch={false}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </section>
  );
};
