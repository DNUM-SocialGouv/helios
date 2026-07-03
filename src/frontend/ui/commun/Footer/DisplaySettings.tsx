import "@gouvfr/dsfr/dist/scheme/scheme.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import "@gouvfr/dsfr/dist/component/component.min.css";
import darkSvg from "@gouvfr/dsfr/dist/artwork/pictograms/environment/moon.svg";
import lightSvg from "@gouvfr/dsfr/dist/artwork/pictograms/environment/sun.svg";
import systemSvg from "@gouvfr/dsfr/dist/artwork/pictograms/system/system.svg";

import { useDependencies } from "../contexts/useDependencies";

const DISPLAY_SETTINGS_MODAL_ID = "fr-display-modal";

export const DisplaySettings = () => {
  const { wording } = useDependencies();

  return (
    <>
      <button
        aria-controls={DISPLAY_SETTINGS_MODAL_ID}
        className="fr-btn--display fr-btn"
        data-fr-opened="false"
        title={wording.PARAMÈTRES_D_AFFICHAGE}
        type="button"
      >
        {wording.PARAMÈTRES_D_AFFICHAGE}
      </button>

      <dialog aria-labelledby={`${DISPLAY_SETTINGS_MODAL_ID}-title`} className="fr-modal" id={DISPLAY_SETTINGS_MODAL_ID}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button
                  aria-controls={DISPLAY_SETTINGS_MODAL_ID}
                  className="fr-btn--close fr-btn"
                  title={wording.FERMER}
                  type="button"
                >
                  {wording.FERMER}
                </button>
              </div>
              <div className="fr-modal__content">
                <h1 className="fr-modal__title" id={`${DISPLAY_SETTINGS_MODAL_ID}-title`}>
                  {wording.PARAMÈTRES_D_AFFICHAGE}
                </h1>
                <div className="fr-display" id="fr-display">
                  <fieldset className="fr-fieldset" id="display-fieldset">
                    <legend className="fr-fieldset__legend fr-fieldset__legend--regular" id="display-fieldset-legend">
                      {wording.PARAMÈTRES_D_AFFICHAGE_LÉGENDE}
                    </legend>
                    <div className="fr-fieldset__element">
                      <div className="fr-radio-group fr-radio-rich">
                        <input id="fr-radios-theme-light" name="fr-radios-theme" type="radio" value="light" />
                        <label className="fr-label" htmlFor="fr-radios-theme-light">
                          {wording.PARAMÈTRES_D_AFFICHAGE_CLAIR}
                        </label>
                        <div className="fr-radio-rich__pictogram">
                          <svg aria-hidden="true" className="fr-artwork" height="80" viewBox="0 0 80 80" width="80">
                            <use className="fr-artwork-decorative" href={`${lightSvg}#artwork-decorative`}></use>
                            <use className="fr-artwork-minor" href={`${lightSvg}#artwork-minor`}></use>
                            <use className="fr-artwork-major" href={`${lightSvg}#artwork-major`}></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="fr-fieldset__element">
                      <div className="fr-radio-group fr-radio-rich">
                        <input id="fr-radios-theme-dark" name="fr-radios-theme" type="radio" value="dark" />
                        <label className="fr-label" htmlFor="fr-radios-theme-dark">
                          {wording.PARAMÈTRES_D_AFFICHAGE_SOMBRE}
                        </label>
                        <div className="fr-radio-rich__pictogram">
                          <svg aria-hidden="true" className="fr-artwork" height="80" viewBox="0 0 80 80" width="80">
                            <use className="fr-artwork-decorative" href={`${darkSvg}#artwork-decorative`}></use>
                            <use className="fr-artwork-minor" href={`${darkSvg}#artwork-minor`}></use>
                            <use className="fr-artwork-major" href={`${darkSvg}#artwork-major`}></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="fr-fieldset__element">
                      <div className="fr-radio-group fr-radio-rich">
                        <input id="fr-radios-theme-system" name="fr-radios-theme" type="radio" value="system" />
                        <label className="fr-label" htmlFor="fr-radios-theme-system">
                          {wording.PARAMÈTRES_D_AFFICHAGE_SYSTÈME}
                          <span className="fr-hint-text">{wording.PARAMÈTRES_D_AFFICHAGE_SYSTÈME_HINT}</span>
                        </label>
                        <div className="fr-radio-rich__pictogram">
                          <svg aria-hidden="true" className="fr-artwork" height="80" viewBox="0 0 80 80" width="80">
                            <use className="fr-artwork-decorative" href={`${systemSvg}#artwork-decorative`}></use>
                            <use className="fr-artwork-minor" href={`${systemSvg}#artwork-minor`}></use>
                            <use className="fr-artwork-major" href={`${systemSvg}#artwork-major`}></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </fieldset>
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