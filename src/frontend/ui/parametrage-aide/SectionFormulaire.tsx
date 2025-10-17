import { ROLES_SECTIONS } from "./aideUtils";
import styles from "./GestionAide.module.css";
import { TableRessources } from "./TableRessources";
import { SectionNormalisee } from "./types";

type SectionFormulaireProps = Readonly<{
  section: SectionNormalisee;
  definition: {
    titre: string;
    icone: string;
    nature: "resources" | "faq";
  };
  rolesSelectionnes: number[];
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
  surModificationDescription,
  surBasculeRole,
  surModificationOrdre,
  surAjoutRessource,
  surEditionRessource,
  surSuppressionRessource,
  surMonterRessource,
  surDescendreRessource,
}: SectionFormulaireProps) {
  const estSectionRessource = definition.nature === "resources";
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
                ? "Ajoutez des ressources pour alimenter cette rubrique. Les éléments sont affichés aux utilisateurs selon leur ordre."
                : "Cette rubrique est gérée automatiquement. Vous pouvez mettre à jour sa description, ses rôles et l’ordre d’affichage."}
            </p>
          </div>
        </div>
      </header>

      <div className="fr-input-group">
        <label className="fr-label" htmlFor="section-description">Description</label>
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
          <legend className="fr-fieldset__legend">Rôles autorisés</legend>
          <div className={`fr-fieldset__content ${styles["rolesSection"]}`}>
            {ROLES_SECTIONS.map((role) => {
              const identifiant = `section-role-${role.identifiant}`;
              const estSelectionne = rolesSelectionnes.includes(role.identifiant);
              return (
                <div className="fr-checkbox-group" key={role.identifiant}>
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
        <label className="fr-label" htmlFor="section-order">Ordre d’affichage</label>
        <input
          className="fr-input"
          id="section-order"
          min={1}
          name="order"
          onChange={(evenement) => {
            const valeur = Number.parseInt(evenement.target.value, 10);
            surModificationOrdre(Number.isNaN(valeur) ? undefined : valeur);
          }}
          placeholder="Ordre actuel"
          type="number"
          value={section.order ?? ""}
        />
      </div>

      {estSectionRessource ? (
        <>
          <div className="fr-grid-row fr-grid-row--middle fr-mt-6w">
            <div className="fr-col">
              <h3 className="fr-h4 fr-m-0">Ressources</h3>
            </div>
            <div className="fr-col-auto">
              <button className="fr-btn fr-btn--primary" onClick={surAjoutRessource} type="button">
                Ajouter une ressource
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
        <p className={styles["messageInfo"]}>Cette section ne contient pas de ressources paramétrables depuis cet écran.</p>
      )}
    </div>
  );
}
