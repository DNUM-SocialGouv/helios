import styles from "./GestionAide.module.css";
import type { RessourceAide } from "./types";
import { useDependencies } from "../commun/contexts/useDependencies";

type TableRessourcesProps = Readonly<{
  ressources: RessourceAide[];
  surModifier: (index: number) => void;
  surSupprimer: (index: number) => void;
  surMonter: (index: number) => void;
  surDescendre: (index: number) => void;
}>;

export function TableRessources({ ressources, surModifier, surSupprimer, surMonter, surDescendre }: TableRessourcesProps) {
  const { wording } = useDependencies();

  if (ressources.length === 0) {
    return (
      <p className="fr-text--sm fr-text-mention--grey fr-my-4w">
        {wording.PARAMETRAGE_AIDE_MESSAGE_AUCUNE_RESSOURCE}
      </p>
    );
  }

  return (
    <div className="fr-table fr-table--layout-fixed fr-mt-4w">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption className="fr-sr-only">{wording.PARAMETRAGE_AIDE_TABLE_TITRE}</caption>
              <thead>
                <tr>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_ORDRE}</th>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_NOM}</th>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_TYPE}</th>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_LIEN}</th>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_DATE}</th>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_FICHIER}</th>
                  <th>{wording.PARAMETRAGE_AIDE_COLONNE_UTILISATEUR}</th>
                  <th aria-label={wording.PARAMETRAGE_AIDE_COLONNE_ACTIONS} />
                </tr>
              </thead>
              <tbody>
                {ressources.map((ressource, index) => {
                  const ordre = ressource.ordre ?? index + 1;
                  const estPremier = index === 0;
                  const estDernier = index === ressources.length - 1;
                  const utilisateur = ressource.updatedBy;
                  const nomUtilisateur = [utilisateur?.prenom, utilisateur?.nom]
                    .filter((valeur) => valeur && valeur.trim().length > 0)
                    .join(" ");

                  return (
                    <tr key={ressource.slug ?? `${ressource.nom}-${index}`}>
                      <td>
                        <div className={styles["actionsTable"]}>
                          <span className={styles["ordreRessource"]}>{ordre}</span>
                          <button
                            aria-label={wording.PARAMETRAGE_AIDE_BOUTON_MONTER_RESSOURCE}
                            className={`fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left ${styles["boutonIcone"]}`}
                            disabled={estPremier}
                            onClick={() => surMonter(index)}
                            type="button"
                          >
                            <span aria-hidden className="fr-icon-arrow-up-s-line" />
                          </button>
                          <button
                            aria-label={wording.PARAMETRAGE_AIDE_BOUTON_DESCENDRE_RESSOURCE}
                            className={`fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left ${styles["boutonIcone"]}`}
                            disabled={estDernier}
                            onClick={() => surDescendre(index)}
                            type="button"
                          >
                            <span aria-hidden className="fr-icon-arrow-down-s-line" />
                          </button>
                        </div>
                      </td>
                      <td>{ressource.nom}</td>
                      <td>{wording.AIDE_TITRES_RESSOURCES[ressource.type] ?? ressource.type}</td>
                      <td>{ressource.lien}</td>
                      <td>{ressource.date ?? ""}</td>
                      <td>{ressource.nom_telechargement ?? ""}</td>
                      <td>{nomUtilisateur || ""}</td>
                      <td>
                        <div className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                          <button className="fr-btn fr-btn--secondary fr-btn--sm" onClick={() => surModifier(index)} type="button">
                            {wording.PARAMETRAGE_AIDE_BOUTON_MODIFIER_RESSOURCE}
                          </button>
                          <button
                            className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
                            onClick={() => surSupprimer(index)}
                            type="button"
                          >
                            {wording.PARAMETRAGE_AIDE_BOUTON_SUPPRIMER_RESSOURCE}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
