
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import styles from "./Aide.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import type { DefinitionSection } from "../parametrage-aide/types";

type ListeSectionsProps = Readonly<{
  sections: DefinitionSection[];
  onSelection: (slug: string) => void;
}>;

export function ListeSections({ sections, onSelection }: ListeSectionsProps) {
  const { wording } = useDependencies();
  if (sections.length === 0) {
    return <p className="fr-text--sm">{wording.AIDE_MESSAGE_SECTIONS_VIDES}</p>;
  }

  return (
    <section className="fr-mb-6w">
      <ul className={`fr-links-group fr-links-group--icon-right fr-links-group--lg ${styles["listeSections"]}`}>
        {sections.map((section) => (
          <li key={section.slug}>
            <button
              className={`fr-link fr-link--icon-right fr-icon-arrow-right-line ${styles["sectionLien"]}`}
              onClick={() => onSelection(section.slug)}
              type="button"
            >
              <span aria-hidden className={`${section.icone} fr-icon fr-icon--sm ${styles["icone"]}`} />
              {section.titre}
            </button>
          </li>
        ))}
      </ul>
      <div className={`fr-alert fr-alert--info fr-mt-10w ${styles["formationAlert"]}`} role="alert">
        <span className="fr-text--lg fr-text--bold">Besoin de formation : </span><a className="fr-link fr-text--lg" href="mailto:dnum.scn-helios-support@sg.social.gouv.fr" rel="noreferrer" target="_blank">Faites votre demande</a>
      </div>
    </section >
  );
}
