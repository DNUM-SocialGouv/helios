import "@gouvfr/dsfr/dist/component/sidemenu/sidemenu.min.css";

import styles from "./GestionAide.module.css";
import type { SectionEditable } from "./types";

type MenuSectionsProps = Readonly<{
  sections: SectionEditable[];
  slugActif: string;
  surSelection: (slug: string) => void;
  surAjout: () => void;
  surSuppression: (slug: string) => void;
}>;

export function MenuSections({ sections, slugActif, surSelection, surAjout, surSuppression }: MenuSectionsProps) {
  return (
    <nav aria-label="Sections d’aide" className={`fr-sidemenu ${styles["barreLaterale"]}`}>
      <div className={styles["boutonAjouterSection"]}>
        <button
          className="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left"
          onClick={surAjout}
          type="button"
        >
          <span aria-hidden className="fr-icon-add-line" /> Ajouter une section
        </button>
      </div>

      <ul className="fr-sidemenu__list">
        {sections.map((section) => (
          <li className="fr-sidemenu__item" key={section.slug}>
            <div style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}>
              <button
                className={`fr-sidemenu__link ${slugActif === section.slug ? "fr-sidemenu__link--active" : ""}`}
                onClick={() => surSelection(section.slug)}
                style={{ alignItems: "center", display: "flex", flex: 1 }}
                type="button"
              >
                <span aria-hidden className={`${section.icone} fr-icon fr-icon--sm fr-text-mention--grey`} />
                <span className="fr-ml-1w">{section.titre}</span>
              </button>
              {section.peutEtreSupprimee && (
                <button
                  aria-label={`Supprimer la section ${section.titre}`}
                  className={`fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left ${styles["boutonIcone"]}`}
                  onClick={() => surSuppression(section.slug)}
                  type="button"
                >
                  <span aria-hidden className="fr-icon-delete-line" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
