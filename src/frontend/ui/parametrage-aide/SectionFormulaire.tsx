import { ChangeEvent, useEffect, useRef } from "react";

import { ROLES_SECTIONS } from "./aideUtils";
import styles from "./GestionAide.module.css";
import { TableRessources } from "./TableRessources";
import { SectionNormalisee } from "./types";
import { useDependencies } from "../commun/contexts/useDependencies";

type SectionFormulaireProps = Readonly<{
  section: SectionNormalisee;
  definition: {
    titre: string;
    icone: string;
    nature: "resources" | "faq";
  };
  rolesSelectionnes: number[];
  surModificationTitre: (valeur: string) => void;
  surModificationIcone: (valeur: string) => void;
  surModificationDescription: (valeur: string) => void;
  surBasculeRole: (role: number, actif: boolean) => void;
  surModificationOrdre: (valeur: number | undefined) => void;
  surAjoutRessource: () => void;
  surEditionRessource: (index: number) => void;
  surSuppressionRessource: (index: number) => void;
  surMonterRessource: (index: number) => void;
  surDescendreRessource: (index: number) => void;
}>;

export function SectionFormulaire({
  section,
  definition,
  rolesSelectionnes,
  surModificationTitre,
  surModificationIcone,
  surModificationDescription,
  surBasculeRole,
  surModificationOrdre,
  surAjoutRessource,
  surEditionRessource,
  surSuppressionRessource,
  surMonterRessource,
  surDescendreRessource,
}: SectionFormulaireProps) {
  const { wording } = useDependencies();
  const estSectionRessource = definition.nature === "resources";
  const refTitre = useRef<HTMLInputElement | null>(null);

  const gererModificationTitre = (evenement: ChangeEvent<HTMLInputElement>) => {
    const valeur = evenement.target.value;
    const champ = evenement.target;
    champ.setCustomValidity(
      valeur.trim().length === 0 ? wording.PARAMETRAGE_AIDE_ALERTE_NOM_SECTION_OBLIGATOIRE : ""
    );
    champ.reportValidity();
    surModificationTitre(valeur);
  };

  useEffect(() => {
    const champ = refTitre.current;
    if (!champ) {
      return;
    }
    const valeur = section.title ?? "";
    champ.setCustomValidity(
      valeur.trim().length === 0 ? wording.PARAMETRAGE_AIDE_ALERTE_NOM_SECTION_OBLIGATOIRE : ""
    );
  }, [section.title, wording]);

  return (
    <div className={`fr-card fr-card--shadow fr-card--no-border ${styles["encart"]}`}>
      <header className="fr-mb-4w">
        <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
          <div className="fr-col-auto">
            <span aria-hidden className={`${definition.icone} fr-icon fr-icon--lg fr-text-title--blue-france`} />
          </div>
          <div className="fr-col">
            <h2 className="fr-h3 fr-m-0">{definition.titre}</h2>
            <p className="fr-text--sm fr-text-mention--grey fr-mt-1w">
              {estSectionRessource
                ? wording.PARAMETRAGE_AIDE_MESSAGE_SECTION_RESSOURCE
                : wording.PARAMETRAGE_AIDE_MESSAGE_SECTION_AUTRE}
            </p>
          </div>
        </div>
      </header>
      <div className="fr-input-group">
        <label className="fr-label" htmlFor="section-order">{wording.PARAMETRAGE_AIDE_LABEL_NOM_SECTION}</label>
        <input
          className="fr-input"
          id="section-titre"
          min={1}
          name="titre"
          onBlur={() => refTitre.current?.reportValidity()}
          onChange={gererModificationTitre}
          ref={refTitre}
          required
          type="text"
          value={section.title ?? ""}
        />
      </div>
      <div className="fr-input-group">
        <label className="fr-label" htmlFor="section-order"><a className="fr-link fr-link--sm" href="https://www.systeme-de-design.gouv.fr/version-courante/fr/fondamentaux/icone#selection-d-icones" id="link-icone-dsfr" rel="noopener external noreferrer" target="_blank" title="Lien vers la liste des icônes du DSFR">{wording.PARAMETRAGE_AIDE_LABEL_ICONE_SECTION}</a></label>
        <input
          className="fr-input"
          id="section-icone"
          min={1}
          name="icone"
          onChange={(evenement) => {
            surModificationIcone(evenement.target.value);
          }}
          required
          type="text"
          value={section.icon ?? ""}
        />
      </div>
      <div className="fr-input-group">
        <label className="fr-label" htmlFor="section-description">{wording.PARAMETRAGE_AIDE_LABEL_DESCRIPTION}</label>
        <textarea
          className="fr-input"
          id="section-description"
          name="description"
          onChange={(evenement) => surModificationDescription(evenement.target.value)}
          rows={3}
          value={section.description}
        />
      </div>
      {section.type !== "faq" && (
        <fieldset className="fr-fieldset fr-mt-4w">
          <legend className="fr-fieldset__legend">{wording.PARAMETRAGE_AIDE_LEGENDE_ROLES}</legend>
          <div className={`fr-fieldset__content ${styles["rolesSection"]}`}>
            {ROLES_SECTIONS.map((role) => {
              const identifiant = `section-role-${role.identifiant}`;
              const estSelectionne = rolesSelectionnes.includes(role.identifiant);
              return (
                <div className="fr-checkbox-group fr-mt-1w" key={role.identifiant}>
                  <input
                    checked={estSelectionne}
                    className="fr-checkbox"
                    id={identifiant}
                    name="roles"
                    onChange={(evenement) => surBasculeRole(role.identifiant, evenement.target.checked)}
                    type="checkbox"
                  />
                  <label className="fr-label" htmlFor={identifiant}>
                    {role.libelle}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="fr-input-group">
        <label className="fr-label" htmlFor="section-order">{wording.PARAMETRAGE_AIDE_LABEL_ORDRE_AFFICHAGE}</label>
        <input
          className="fr-input"
          id="section-order"
          min={1}
          name="order"
          onChange={(evenement) => {
            const valeur = Number.parseInt(evenement.target.value, 10);
            surModificationOrdre(Number.isNaN(valeur) ? undefined : valeur);
          }}
          placeholder={wording.PARAMETRAGE_AIDE_PLACEHOLDER_ORDRE}
          type="number"
          value={section.order ?? ""}
        />
      </div>

      {estSectionRessource ? (
        <>
          <div className="fr-grid-row fr-grid-row--middle fr-mt-6w">
            <div className="fr-col">
              <h3 className="fr-h4 fr-m-0">{wording.PARAMETRAGE_AIDE_TITRE_RESSOURCES}</h3>
            </div>
            <div className="fr-col-auto">
              <button className="fr-btn fr-btn--primary" onClick={surAjoutRessource} type="button">
                {wording.PARAMETRAGE_AIDE_BOUTON_AJOUTER_RESSOURCE}
              </button>
            </div>
          </div>

          <TableRessources
            ressources={section.resources}
            surDescendre={surDescendreRessource}
            surModifier={surEditionRessource}
            surMonter={surMonterRessource}
            surSupprimer={surSuppressionRessource}
          />
        </>
      ) : (
        <p className={styles["messageInfo"]}>{wording.PARAMETRAGE_AIDE_MESSAGE_SECTION_SANS_PARAMETRAGE}</p>
      )}
    </div>
  );
}
