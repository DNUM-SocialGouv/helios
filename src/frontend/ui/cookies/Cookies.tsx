import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Cookies.module.css";

export const Cookies = () => {
  const { wording } = useDependencies();

  return (
    <>
      <button aria-controls="fr-modal-2" data-fr-opened="true" title="Supprimer">
        <span aria-hidden="true" className="fr-icon-delete-line"></span>
      </button>

      <dialog aria-labelledby="fr-modal-2-title" className={"fr-modal " + styles["unclickable-area"]} id="fr-modal-2">
        <div className="fr-container fr-container--fluid fr-container-md ">
          <div className={"fr-grid-row fr-grid-row--left " + styles["cookies-modal"]}>
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-modal__body">
                <div className="fr-modal__header"></div>
                <div className="fr-modal__content">
                  <h1 className="fr-modal__title" id="fr-modal-2-title">
                    Confirmation de la suppression
                  </h1>
                  <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
                </div>
                <div className="fr-modal__footer">
                  <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <li>
                      <button aria-controls="fr-modal-2" className="fr-btn">
                        Supprimer
                      </button>
                    </li>
                    <li>
                      <button aria-controls="fr-modal-2" className="fr-btn fr-btn--secondary">
                        Annuler
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
