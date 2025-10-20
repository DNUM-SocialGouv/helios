import "@gouvfr/dsfr/dist/component/sidemenu/sidemenu.min.css";

import styles from "./GestionAide.module.css";
import type { SectionEditable } from "./types";
import { useDependencies } from "../commun/contexts/useDependencies";

type MenuSectionsProps = Readonly<{
  sections: SectionEditable[];
  slugActif: string;
  surSelection: (slug: string) => void;
  surAjout: () => void;
  surSuppression: (slug: string) => void;
}>;

export function MenuSections({ sections, slugActif, surSelection, surAjout, surSuppression }: MenuSectionsProps) {
  const { wording } = useDependencies();

  return (
    <nav aria-label={wording.PARAMETRAGE_AIDE_NAV_SECTIONS} className={`fr-sidemenu ${styles["barreLaterale"]}`}>
      <div className={styles["boutonAjouterSection"]}>
        <button
          className="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left"
          onClick={surAjout}
          type="button"
        >
          <span aria-hidden className="fr-icon-add-line" /> {wording.PARAMETRAGE_AIDE_BOUTON_AJOUTER_SECTION}
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
                  aria-label={wording.PARAMETRAGE_AIDE_ARIA_SUPPRIMER_SECTION(section.titre)}
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
