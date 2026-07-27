import "@gouvfr/dsfr/dist/component/sidemenu/sidemenu.min.css";

import { useDependencies } from "../commun/contexts/useDependencies";

type MenuSectionsProps = Readonly<{
  sections: string[];
  slugActif: string;
  surSelection: (slug: string) => void;
}>;

export function MenuSections({ sections, slugActif, surSelection }: MenuSectionsProps) {
  const { wording } = useDependencies();

  return (
    <nav aria-label={wording.PARAMETRAGE_MESSAGE_ACCUEIL_NAV_SECTIONS} className="fr-sidemenu" style={{ border: "1px solid #e5e5f4", borderRadius: "0.5rem", padding: "1rem 1.5rem" }}>
      <ul className="fr-sidemenu__list">
        {sections.map((section) => (
          <li className="fr-sidemenu__item" key={section}>
            <div style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}>
              <button
                className={`fr-sidemenu__link ${slugActif === section ? "fr-sidemenu__link--active" : ""}`}
                onClick={() => surSelection(section)}
                style={{ alignItems: "center", display: "flex", flex: 1 }}
                type="button"
              >
                <span className="fr-ml-1w">{section}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
