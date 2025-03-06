import { ChangeEventHandler, MouseEventHandler, FormEventHandler, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./changeMdp.module.css";
import "@gouvfr/dsfr/dist/component/form/form.min.css";
import { PasswordCriteria } from "./useChangeMdp";

type FormulaireChangeMdpProps = Readonly<{
  annuler: MouseEventHandler<HTMLButtonElement>;
  changePassword: FormEventHandler<HTMLFormElement>;
  oldPasswordValue: string;
  oldPasswordValueOnChange: ChangeEventHandler<HTMLInputElement>;
  confirmPasswordValue: string;
  confirmPasswordValueOnChange: ChangeEventHandler<HTMLInputElement>;
  errorMessage: string;
  passwordValue: string;
  passwordValueOnChange: ChangeEventHandler<HTMLInputElement>;
  isLoading: boolean;
  updated: boolean;
  criteriaNewPassword: PasswordCriteria;
}>;


export const FormulaireChangeMdp = ({ criteriaNewPassword, annuler, changePassword, oldPasswordValue, oldPasswordValueOnChange, confirmPasswordValue, confirmPasswordValueOnChange, errorMessage, isLoading, passwordValue, passwordValueOnChange, updated }: FormulaireChangeMdpProps) => {
  const [passwordInputFocus, setPasswordInputFocus] = useState<boolean>(false);
  const { wording } = useDependencies();
  
  const noError = Object.values(criteriaNewPassword).every((value) => value)
  return (
    <div className="fr-grid-row">
      <section className="fr-col-12 fr-mt-5w">
        <h1 className={styles["title"]}>{wording.CHANGEMENT_MOT_PASSE_TITRE}</h1>
        <p>{wording.CHANGEMENT_MOT_PASSE_DESCRIPTION}</p>
        <div className="fr-grid-row fr-mt-8w fr-ml-8w">
          <form className="fr-col-11 fr-mt-5w" onSubmit={noError ? changePassword : (e) => {e.preventDefault()}} >
            {errorMessage && <div className={"fr-mb-5w " + styles["error"]}> {errorMessage} </div>}
            {updated && <div className={"fr-mb-5w " + styles["success"]}> votre mot de passe a été changé avec succès</div>}
            <div className="fr-grid-row ">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label">
                  {wording.OLD_MOT_DE_PASSE}
                </label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <input
                  className="fr-input"
                  onChange={oldPasswordValueOnChange}
                  required
                  type="password"
                  value={oldPasswordValue}
                />
              </div>
            </div>
            <div className="fr-grid-row fr-mt-5w">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label">
                  {wording.MOT_DE_PASSE}
                </label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <input
                  className="fr-input"
                  onChange={passwordValueOnChange}
                  onFocus={() => setPasswordInputFocus(true)}
                  required
                  type="password"
                  value={passwordValue}
                />
                {passwordInputFocus && <div aria-live="polite" className="fr-messages-group" id="password-input-9-messages">
                  <p className="fr-message" id="password-input-9-message">Votre mot de passe doit contenir :</p>
                  <p className={`fr-message ${criteriaNewPassword.length ? "fr-message--valid" : "fr-message--error"}`}>
                    12 caractères
                  </p>
                  <p className={`fr-message ${criteriaNewPassword.uppercase ? "fr-message--valid" : "fr-message--error"}`}>
                    1 caractère majuscule
                  </p>
                  <p className={`fr-message ${criteriaNewPassword.lowercase ? "fr-message--valid" : "fr-message--error"}`}>
                    1 caractère minuscule
                  </p>
                  <p className={`fr-message ${criteriaNewPassword.number ? "fr-message--valid" : "fr-message--error"}`}>
                    1 chiffre
                  </p>
                  <p className={`fr-message ${criteriaNewPassword.specialChar ? "fr-message--valid" : "fr-message--error"}`}>
                    1 caractère spécial parmi !@#$%^&*
                  </p>
                </div>}
              </div>
            </div>
            <div className="fr-grid-row  fr-mt-5w">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label">
                  {wording.CONFIRMER_MOT_DE_PASSE}
                </label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <input
                  className="fr-input"
                  onChange={confirmPasswordValueOnChange}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}"
                  required
                  title={wording.INVALID_PASSWORD_MESSAGE}
                  type="password"
                  value={confirmPasswordValue}
                />
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--center fr-mt-8w fr-mb-6w">
              <ul className="fr-btns-group fr-btns-group--inline-sm">
                <li>
                  <button className="fr-btn fr-btn--secondary" onClick={annuler} type="button">
                    {wording.CANCEL}
                  </button>
                </li>
                <li>
                  <button className="fr-btn" disabled={isLoading} type="submit">
                    {wording.CONFIRM_UPDATE_PASSWORD}
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
