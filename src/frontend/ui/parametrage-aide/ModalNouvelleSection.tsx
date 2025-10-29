import { FormEvent, ChangeEvent, RefObject } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";

type ModalNouvelleSectionProps = Readonly<{
  ouverte: boolean;
  formulaire: {
    title: string;
    icon: string;
  };
  ancre: RefObject<HTMLDialogElement>;
  champInitial: RefObject<HTMLInputElement>;
  surFermeture: () => void;
  surModification: (event: ChangeEvent<HTMLInputElement>) => void;
  surValidation: (event: FormEvent<HTMLFormElement>) => void;
}>;

export function ModalNouvelleSection({
  ouverte,
  formulaire,
  ancre,
  champInitial,
  surFermeture,
  surModification,
  surValidation,
}: ModalNouvelleSectionProps) {
  const { wording } = useDependencies();

  return (
    <dialog
      aria-labelledby="parametrage-aide-new-section-modal-title"
      className={`fr-modal ${ouverte ? "fr-modal--opened" : ""}`}
      id="parametrage-aide-new-section-modal"
      onCancel={(event) => {
        event.preventDefault();
        surFermeture();
      }}
      ref={ancre}
    >
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button
                  aria-controls="parametrage-aide-new-section-modal"
                  className="fr-btn fr-btn--close"
                  onClick={surFermeture}
                  type="button"
                >
                  {wording.PARAMETRAGE_AIDE_BOUTON_FERMER}
                </button>
              </div>
              <form className="fr-form fr-p-4w fr-card fr-card--shadow fr-modal__content" onSubmit={surValidation}>
                <h3 className="fr-modal__title fr-mb-4w" id="parametrage-aide-new-section-modal-title">
                  {wording.PARAMETRAGE_AIDE_TITRE_MODAL_SECTION}
                </h3>

                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="new-section-title">{wording.PARAMETRAGE_AIDE_LABEL_NOM_SECTION}</label>
                  <input
                    className="fr-input"
                    id="new-section-title"
                    name="title"
                    onChange={surModification}
                    ref={champInitial}
                    required
                    type="text"
                    value={formulaire.title}
                  />
                </div>

                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="new-section-icon">{wording.PARAMETRAGE_AIDE_LABEL_ICONE_SECTION}</label>
                  <input
                    className="fr-input"
                    id="new-section-icon"
                    name="icon"
                    onChange={surModification}
                    type="text"
                    value={formulaire.icon}
                  />
                </div>

                <div className="fr-mt-4w fr-btns-group fr-btns-group--inline fr-btns-group--right">
                  <button className="fr-btn fr-btn--secondary" onClick={surFermeture} type="button">
                    {wording.PARAMETRAGE_AIDE_BOUTON_ANNULER}
                  </button>
                  <button className="fr-btn" type="submit">
                    {wording.PARAMETRAGE_AIDE_BOUTON_AJOUTER}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
