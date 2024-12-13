import { RechercheAvanceeFormulaire } from "../../recherche-avancee/RechecheAvanceeFormulaire";

export const AjoutEtablissements = () => {
  return (
    <>
      <dialog aria-labelledby="fr-modal-ajout-etablissement-comparaison-title" className="fr-modal" id="fr-modal-ajout-etablissement-comparaison">
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-modal__body">
                <div className="fr-modal__header">
                  <button
                    aria-controls="titre-info-bulle-etablissement"
                    className="fr-btn--close fr-btn"
                    onClick={() => {}}
                    title="Fermer la fenêtre modale"
                    type="button"
                  >
                    FERMER
                  </button>
                </div>
                <div className="fr-modal__content">
                  <h1 className="fr-modal__title" id="titre-info-bulle-etablissement">
                    <span aria-hidden="true" className="fr-fi-arrow-right-line fr-fi--lg"></span>
                    TITRE DE LA POP UP
                  </h1>
                  <RechercheAvanceeFormulaire lancerLaRecherche={() => {}} rechercheOnChange={() => {}}></RechercheAvanceeFormulaire>
                </div>
                <div className="fr-modal__footer"></div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
