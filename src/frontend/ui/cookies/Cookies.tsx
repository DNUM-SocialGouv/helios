import Link from "next/link";
import { ChangeEvent, useState } from "react";

import styles from "./Cookies.module.css";

export const Cookies = () => {
  const [allowCookies, setAllowCookies] = useState("");

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAllowCookies(e.target.value);
  };
  return (
    <>
      <button aria-controls="fr-modal-cookies" data-fr-opened="true" title="Supprimer">
        <span aria-hidden="true" className="fr-icon-delete-line"></span>
      </button>

      <dialog aria-labelledby="fr-modal-cookies-title" className={"fr-modal " + styles["unclickable-area"]} id="fr-modal-cookies">
        <div className="fr-container fr-container--fluid fr-container-md ">
          <div className={"fr-grid-row fr-grid-row--left " + styles["cookies-modal"]}>
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-modal__body">
                <div className="fr-modal__header"></div>
                <div className="fr-modal__content">
                  <p className="fr-text--lead">Ce site utilise des cookies et vous donne le contrôle sur ceux que vous souhaitez activer</p>
                </div>
                <div className={"fr-modal__footer " + styles["fr-modal__footer"]}>
                  <ul className="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <li>
                      <button aria-controls="fr-modal-cookies" className="fr-btn">
                        Tout accepter
                      </button>
                    </li>

                    <li>
                      <button aria-controls="fr-modal-cookies" className="fr-btn">
                        Tout refuser
                      </button>
                    </li>
                    <li>
                      <button aria-controls="fr-modal-privacyPolicy" className="fr-btn  fr-btn--secondary" data-fr-opened="true">
                        Personnaliser
                      </button>
                    </li>
                  </ul>
                </div>
                <div className={styles["politique_link"]}>
                  <Link className="fr-text--xs" href="d">
                    Politique de confidentialité
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <dialog className={`fr-modal ${allowCookies === "" ? styles["unclickable-area"] : "fr-modal--opened"} `} id="fr-modal-privacyPolicy">
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8">
              <div className="fr-modal__body">
                <div className="fr-modal__header">
                  <button
                    aria-controls={allowCookies === "" ? "fr-modal-cookies" : "fr-modal-privacyPolicy"}
                    className="fr-btn--close fr-btn"
                    title="Fermer la fenêtre modale"
                    {...(allowCookies === "" ? { "data-fr-opened": "true" } : {})}
                  >
                    Fermer
                  </button>
                </div>
                <div className="fr-modal__content">
                  <div className={`${styles["row-input"]} ${styles["row-input-sep"]}`}>
                    <h2 className={`fr-modal__title ${styles["fr-modal__title"]} }`}>Panneau de gestion des cookies</h2>

                    <fieldset aria-labelledby="radio-inline-legend radio-inline-messages" className={styles["fr-fieldset"]}>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]}`}>
                        <div className={styles["fr-radio-group"]}>
                          <input
                            checked={allowCookies === "true"}
                            className={`${styles["fr-radio-groupInputRadio"]}  }`}
                            id="radio-inline-1"
                            name="radio-inline"
                            onChange={onOptionChange}
                            type="radio"
                            value="true"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]} ${allowCookies === "true" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="radio-inline-1"
                          >
                            Tout accepter
                          </label>
                        </div>
                      </div>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]} ${styles["fr-fieldset__sep"]}`}>
                        <span>1</span>
                      </div>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]}`}>
                        <div className={styles["fr-radio-group"]}>
                          <input
                            checked={allowCookies === "false"}
                            className={styles["fr-radio-groupInputRadio"]}
                            id="radio-inline-2"
                            name="radio-inline"
                            onChange={onOptionChange}
                            type="radio"
                            value="false"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]}  ${allowCookies === "false" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="radio-inline-2"
                          >
                            Tout refuser
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <p className={styles["label_input"]}>Préférences pour tous les services</p>
                  </div>

                  <div className={`${styles["row-input"]} ${styles["row-input-sep-2"]}`}>
                    <h2 className={`fr-modal__title ${styles["fr-modal__title"]} }`}>Cookies obligatoires</h2>

                    <fieldset aria-labelledby="radio-inline-legend radio-inline-messages" className={styles["fr-fieldset"]}>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]}`}>
                        <div className={styles["fr-radio-group"]}>
                          <input className={`${styles["fr-radio-groupInputRadio"]}  }`} disabled id="radio-inline-3" name="radio-inline" type="radio" />
                          <label className={`${styles["fr-radio-groupInputRadioLabel"]} `} htmlFor="radio-inline-3">
                            Autoriser
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <p className={styles["label_input"]}>
                      Ce site utilise des cookies nécessaires à son bon fonctionnement.
                      <br />
                      Ils ne peuvent pas être désactivés.
                    </p>
                  </div>

                  <div className={styles["row-input"]}>
                    <h2 className={`fr-modal__title ${styles["fr-modal__title"]} }`}>Mesure d'audience</h2>

                    <fieldset aria-labelledby="radio-inline-legend radio-inline-messages" className={styles["fr-fieldset"]}>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]}`}>
                        <div className={styles["fr-radio-group"]}>
                          <input
                            className={`${styles["fr-radio-groupInputRadio"]}  }`}
                            id="radio-inline-1"
                            name="radio-inline"
                            onChange={onOptionChange}
                            type="radio"
                            value="true"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]}  ${allowCookies === "true" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="radio-inline-1"
                          >
                            Tout accepter
                          </label>
                        </div>
                      </div>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]} ${styles["fr-fieldset__sep"]}`}>
                        <span>1</span>
                      </div>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]}`}>
                        <div className={styles["fr-radio-group"]}>
                          <input
                            className={styles["fr-radio-groupInputRadio"]}
                            id="radio-inline-2"
                            name="radio-inline"
                            onChange={onOptionChange}
                            type="radio"
                            value="false"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]}  ${allowCookies === "false" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="radio-inline-2"
                          >
                            Tout refuser
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <p className={styles["label_input"]}>
                      <span className={`${styles["textBold"]} `}>AT internet</span>
                      <br />
                      {allowCookies === "true" ? "interdit" : "autorisé"}
                      <br />- {allowCookies === "true" ? "Ce service n'a pas installé de cookies." : "Ce service peut déposer 4 cookies."}
                      <br />
                      <Link className="fr-mr-1w" href="https://tarteaucitron.io/en/service/atinternet" target="_blank">
                        En savoir plus
                      </Link>
                      -{" "}
                      <Link className="fr-ml-1w" href="https://www.atinternet.com" target="_blank">
                        Voir le site Officiel
                      </Link>{" "}
                      <br /> <br /> <br />
                      <Link href="https://tarteaucitron.io/fr/" target="_blank">
                        Site officiel de Tarte au citron
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
