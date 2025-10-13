import { formaterRoles } from "./aideUtils";
import styles from "./GestionAide.module.css";
import type { RessourceAide } from "./types";

type TableRessourcesProps = Readonly<{
  ressources: RessourceAide[];
  surModifier: (index: number) => void;
  surSupprimer: (index: number) => void;
  surMonter: (index: number) => void;
  surDescendre: (index: number) => void;
}>;

export function TableRessources({ ressources, surModifier, surSupprimer, surMonter, surDescendre }: TableRessourcesProps) {
  if (ressources.length === 0) {
    return (
      <p className="fr-text--sm fr-text-mention--grey fr-my-4w">Aucune ressource n’a encore été ajoutée.</p>
    );
  }

  return (
    <div className="fr-table fr-table--layout-fixed fr-mt-4w">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption className="fr-sr-only">Ressources de la section</caption>
              <thead>
                <tr>
                  <th>Ordre</th>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Lien ou contenu</th>
                  <th>Date</th>
                  <th>Nom du fichier</th>
                  <th>Rôles</th>
                  <th>Utilisateur</th>
                  <th aria-label="Actions" />
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
                            aria-label="Monter la ressource"
                            className={`fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left ${styles["boutonIcone"]}`}
                            disabled={estPremier}
                            onClick={() => surMonter(index)}
                            type="button"
                          >
                            <span aria-hidden className="fr-icon-arrow-up-s-line" />
                          </button>
                          <button
                            aria-label="Descendre la ressource"
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
                      <td>{ressource.type}</td>
                      <td>{ressource.contenu}</td>
                      <td>{ressource.date ?? ""}</td>
                      <td>{ressource.nom_telechargement ?? ""}</td>
                      <td>{formaterRoles(ressource.allowedRoles ?? ressource.roles)}</td>
                      <td>{nomUtilisateur || ""}</td>
                      <td>
                        <div className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                          <button className="fr-btn fr-btn--secondary fr-btn--sm" onClick={() => surModifier(index)} type="button">
                            Modifier
                          </button>
                          <button
                            className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
                            onClick={() => surSupprimer(index)}
                            type="button"
                          >
                            Supprimer
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
