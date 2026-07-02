import Link from "next/link";
import { ChangeEvent, useState, useEffect, useRef } from "react";

import styles from "./Cookies.module.css";
import { AnalyticsConsentValue, getAnalyticsConsent, setAnalyticsConsent } from "../../utils/analyticsConsent";
import { useDependencies } from "../commun/contexts/useDependencies";

export const Cookies = ({
  currentModal,
  openModal,
  setCurrentModal,
  setOpenModal,
}: {
  currentModal: number;
  openModal: boolean;
  setCurrentModal: any;
  setOpenModal: any;
}) => {
  const [allowCookies, setAllowCookies] = useState("");
  const [shouldDisplayCookieModal, setShouldDisplayCookieModal] = useState(false);
  const { wording } = useDependencies();

  const modal1Ref = useRef<HTMLDialogElement>(null);
  const modal2Ref = useRef<HTMLDialogElement>(null);
  const closeBtn2Ref = useRef<HTMLButtonElement>(null);

  const appliqueLeConsentementAnalytics = (value: AnalyticsConsentValue) => {
    setAnalyticsConsent(value);
    setAllowCookies(value);
    setCurrentModal(3);
    setOpenModal(false);
  };

  const onAccept = () => {
    appliqueLeConsentementAnalytics("true");
  };

  const onDeny = () => {
    appliqueLeConsentementAnalytics("false");
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAllowCookies(e.target.value);
  };

  const closeModal2 = () => {
    if (allowCookies === "") {
      setCurrentModal(1);
    } else {
      appliqueLeConsentementAnalytics(allowCookies as "true" | "false");
    }
  };

  useEffect(() => {
    function refreshDisplayCondition() {
      const consentement = getAnalyticsConsent();

      setShouldDisplayCookieModal(consentement === undefined);
      if (consentement === "true") {
        setAllowCookies("true");
      }
      if (consentement === "false") {
        setAllowCookies("false");
      }
      if (openModal) {
        setCurrentModal(1);
      }
    }

    refreshDisplayCondition();
  }, []);

  // Gestion de l'ouverture/fermeture du premier modal (gestion des cookies)
  useEffect(() => {
    if (currentModal === 1 && (shouldDisplayCookieModal || openModal)) {
      modal1Ref.current?.showModal();
    } else {
      modal1Ref.current?.close();
    }
  }, [currentModal, openModal, shouldDisplayCookieModal]);

  // Gestion de l'ouverture/fermeture du deuxième modal (personnaliser) et focus
  useEffect(() => {
    if (currentModal === 2) {
      modal2Ref.current?.showModal();
      // Placer le focus sur le bouton fermer
      setTimeout(() => {
        closeBtn2Ref.current?.focus();
      }, 0);
    } else {
      modal2Ref.current?.close();
    }
  }, [currentModal]);

  return (
    <>
      <dialog
        aria-labelledby="fr-modal-cookies-title"
        className={`fr-modal ${currentModal === 1 && (shouldDisplayCookieModal || openModal) ? " fr-modal--opened " : ""} `}
        id="fr-modal-cookies"
        ref={modal1Ref}
      >
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
                      <button aria-controls="fr-modal-cookies" className="fr-btn" onClick={onAccept}>
                        Tout accepter
                      </button>
                    </li>

                    <li>
                      <button aria-controls="fr-modal-cookies" className="fr-btn" onClick={onDeny}>
                        Tout refuser
                      </button>
                    </li>
                    <li>
                      <button
                        aria-controls="fr-modal-privacyPolicy"
                        className="fr-btn  fr-btn--secondary"
                        onClick={() => setCurrentModal(2)}
                      >
                        Personnaliser
                      </button>
                    </li>
                  </ul>
                </div>
                <div className={styles["politique_link"]}>
                  <Link className="fr-text--xs" href="/donnees-personnelles" title={wording.POLITIQUE_CONFIDENTIALITE}>
                    {wording.POLITIQUE_CONFIDENTIALITE}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <dialog className={`fr-modal ${currentModal === 2 ? "fr-modal--opened" : ""} `} id="fr-modal-privacyPolicy" ref={modal2Ref}>
        <div className="fr-container fr-container--fluid fr-container-md">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8">
              <div className="fr-modal__body">
                <div className="fr-modal__header">
                  <button
                    aria-controls="fr-modal-privacyPolicy"
                    className="fr-btn--close fr-btn"
                    onClick={closeModal2}
                    ref={closeBtn2Ref}
                    title="Fermer la fenêtre modale"
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
                            className={`${styles["fr-radio-groupInputRadio"]} }`}
                            id="cookies-all-allow"
                            name="cookies-all"
                            onChange={onOptionChange}
                            type="radio"
                            value="true"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]} ${allowCookies === "true" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="cookies-all-allow"
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
                            id="cookies-all-deny"
                            name="cookies-all"
                            onChange={onOptionChange}
                            type="radio"
                            value="false"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]}  ${allowCookies === "false" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="cookies-all-deny"
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
                    <h2 className={`fr-modal__title ${styles["fr-modal__title"]} }`}>Mesure d&apos;audience</h2>

                    <fieldset aria-labelledby="radio-inline-legend radio-inline-messages" className={styles["fr-fieldset"]}>
                      <div className={`${styles["fr-fieldset__element"]} ${styles["fr-fieldset__element--inline"]}`}>
                        <div className={styles["fr-radio-group"]}>
                          <input
                            checked={allowCookies === "true"}
                            className={`${styles["fr-radio-groupInputRadio"]}  }`}
                            id="cookies-analytics-allow"
                            name="cookies-analytics"
                            onChange={onOptionChange}
                            type="radio"
                            value="true"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]}  ${allowCookies === "true" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="cookies-analytics-allow"
                          >
                            Autoriser
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
                            id="cookies-analytics-deny"
                            name="cookies-analytics"
                            onChange={onOptionChange}
                            type="radio"
                            value="false"
                          />
                          <label
                            className={`${styles["fr-radio-groupInputRadioLabel"]}  ${allowCookies === "false" ? styles["InputRadioChecked"] : ""}`}
                            htmlFor="cookies-analytics-deny"
                          >
                            Interdire
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <p className={styles["label_input"]}>
                      <span className={`${styles["textBold"]} `}>Matomo</span>
                      <br />
                      {allowCookies === "true" ? "autorisé" : "interdit"}
                      <br />- {allowCookies === "true" ? "Ce service peut déposer des cookies de mesure d’audience." : "Ce service est désactivé."}
                      <br />
                      <Link className="fr-mr-1w" href="https://matomo.org/faq/general/faq_146/" target="_blank" title={`${wording.SAVOIR_PLUS} - ${wording.NOUVELLE_FENÊTRE}`}>
                        {wording.SAVOIR_PLUS}
                      </Link>
                      -{" "}
                      <Link className="fr-ml-1w" href="https://matomo.org/" target="_blank" title={`${wording.VOIR_SITE_OFFICIEL} - ${wording.NOUVELLE_FENÊTRE}`}>
                        {wording.VOIR_SITE_OFFICIEL}
                      </Link>{" "}
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
