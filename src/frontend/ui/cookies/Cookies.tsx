import Link from "next/link";
import { ChangeEvent, useState, useEffect, useRef } from "react";

import styles from "./Cookies.module.css";
import { AnalyticsConsentValue, getAnalyticsConsent, setAnalyticsConsent } from "../../utils/analyticsConsent";
import { useDependencies } from "../commun/contexts/useDependencies";
import "@gouvfr/dsfr/dist/component/consent/consent.min.css";


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

  const closeModal2 = () => {
    if (allowCookies === "") {
      setCurrentModal(1);
    } else {
      appliqueLeConsentementAnalytics(allowCookies as "true" | "false");
    }
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    appliqueLeConsentementAnalytics(e.target.value as AnalyticsConsentValue);
  };

  const onAllowCookies = () => {
    appliqueLeConsentementAnalytics("true");
  };

  const onDenyCookies = () => {
    appliqueLeConsentementAnalytics("false");
  };

  const handleMentionsLegalesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentModal(1);
    window.open("/mentions-legales", "_blank");
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
                      <button aria-controls="fr-modal-cookies" className="fr-btn" onClick={onAllowCookies}>
                        Tout accepter
                      </button>
                    </li>

                    <li>
                      <button aria-controls="fr-modal-cookies" className="fr-btn" onClick={onDenyCookies}>
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
                  />
                </div>
                <div className="fr-modal__content">
                  <h1 className="fr-modal__title" id="fr-consent-modal-title">
                            Panneau de gestion des cookies
                  </h1>
                  <div className="fr-consent-manager">
                    <div className="fr-consent-service fr-consent-manager__header">
                      <fieldset className="fr-fieldset">
                        <legend className="fr-consent-service__title" id="finality-legend"> {wording.PREFERENCES_SERVICES}{" "}
                          <a className="fr-link" href="#" onClick={handleMentionsLegalesClick} title={wording.MENTIONS_LÉGALES}>
                            {wording.MENTIONS_LÉGALES}
                          </a>
                        </legend>
                          <div className="fr-consent-service__radios">
                            <div className="fr-radio-group">
                              <input checked={allowCookies === "true"} id="consent-all-accept" name="consent-all" onChange={onAllowCookies} type="radio"/>
                              <label className="fr-label" htmlFor="consent-all-accept"> Tout accepter</label>
                            </div>
                            <div className="fr-radio-group">
                              <input checked={allowCookies === "false"} id="consent-all-refuse" name="consent-all" onChange={onDenyCookies} type="radio"/>
                              <label className="fr-label" htmlFor="consent-all-refuse"> Tout refuser</label>
                            </div>
                          </div>
                      </fieldset>
                    </div>
                    <div className="fr-consent-service">
                        <legend className="fr-consent-service__title fr-h4 fr-pb-0" id="finality-0-legend">Mesure d’audience</legend>
                    
                      <div className="fr-consent-service">
                        <fieldset aria-labelledby="finality-1-legend finality-1-desc" className="fr-fieldset fr-fieldset--inline" role="group">
                          <legend className="fr-consent-service__title fr-pb-1v" id="finality-1-legend">Matomo</legend>
                          <div className="fr-consent-service__radios">
                            <div className="fr-radio-group">
                              <input checked={allowCookies === "true"} id="consent-finality-1-accept" name="consent-finality-1" onChange={onOptionChange} type="radio" value="true"/>
                              <label className="fr-label" htmlFor="consent-finality-1-accept"> Autoriser </label>
                            </div>
                            <div className="fr-radio-group">
                              <input checked={allowCookies === "false"} id="consent-finality-1-refuse" name="consent-finality-1" onChange={onOptionChange} type="radio" value="false"/>
                              <label className="fr-label" htmlFor="consent-finality-1-refuse"> Interdire </label>
                            </div>
                          </div>
                            <p className="fr-mb-1v" id="finality-1-desc">Ce service utilise 3 cookies.</p>
                        </fieldset>
                      </div>
                    </div>
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
