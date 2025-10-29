import Image from "next/image";

import styles from "./Aide.module.css";
import { RESSOURCES_ICONES } from "./utils";
import { useDependencies } from "../commun/contexts/useDependencies";
import type { RessourceAide } from "../parametrage-aide/types";

type BlocRessourcesProps = Readonly<{
  ressources: RessourceAide[];
}>;

export function BlocRessources({ ressources }: BlocRessourcesProps) {
  const { wording } = useDependencies();
  if (ressources.length === 0) {
    return <p className="fr-text--sm">{wording.AIDE_MESSAGE_CONTENU_INDISPONIBLE}</p>;
  }

  return (
    <>
      {RESSOURCES_ICONES.map(({ type, icone }) => {
        const elements = ressources.filter((ressource) => ressource.type === type);
        if (elements.length === 0) {
          return null;
        }
        const titre = wording.AIDE_TITRES_RESSOURCES[type] ?? "";

        return (
          <section className={`fr-card fr-card--no-border fr-card--shadow fr-p-4w fr-mb-4w ${styles["carteRessource"]}`} key={type}>
            <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
              <div className="fr-col-auto">
                <Image alt="" aria-hidden height={72} src={icone} style={{ height: "4.5rem", width: "4.5rem" }} width={72} />
              </div>
              <div className="fr-col">
                <h2 className="fr-h4 fr-m-0 fr-text-title--blue-france">{titre}</h2>
                <ul className="fr-list fr-list--icon-bullet fr-mt-2w">
                  {elements.map((ressource, index) => (
                    <li key={ressource.slug ?? `${ressource.nom}-${index}`}>
                      <a
                        className="fr-link fr-link--icon-right fr-icon-external-link-line"
                        href={ressource.lien}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {ressource.nom}
                      </a>
                      {(ressource.date || ressource.nom_telechargement) && (
                        <div className="fr-text--sm fr-mt-1v fr-text-mention--grey">
                          {ressource.date ? wording.AIDE_INFO_DATE(ressource.date) : null}
                          {ressource.date && ressource.nom_telechargement ? wording.AIDE_INFO_SEPARATEUR : null}
                          {ressource.nom_telechargement ? wording.AIDE_INFO_NOM_FICHIER(ressource.nom_telechargement) : null}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
