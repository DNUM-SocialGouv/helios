import { ChangeEventHandler, MouseEventHandler, FormEventHandler } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";

import styles from "./changeMdp.module.css";

type FormulaireChangeMdpProps = Readonly<{
  changePassword: FormEventHandler<HTMLFormElement>;
  annuler: MouseEventHandler<HTMLButtonElement>;
  passwordValueOnChange: ChangeEventHandler<HTMLInputElement>;
  confirmPasswordValueOnChange: ChangeEventHandler<HTMLInputElement>;
  passwordValue: string;
  confirmPasswordValue: string;
  errorMessage: string;
  // isLoading: boolean;
}>;


export const FormulaireChangeMdp = ({
  annuler,
  changePassword,
  confirmPasswordValue,
  confirmPasswordValueOnChange,
  errorMessage,
  passwordValue,
  passwordValueOnChange,
}: FormulaireChangeMdpProps) => {
  const { wording } = useDependencies();

  return (
    <div className={styles["container"]}>
      <h1>{wording.CHANGEMENT_MOT_PASSE_TITRE}</h1>
      <p>{wording.CHANGEMENT_MOT_PASSE_DESCRIPTION}</p>
      <div className="fr-grid-row fr-grid-row--center fr-mt-8w">
        <form className="fr-col-12 fr-col-md-6" onSubmit={changePassword} >
          {errorMessage && <div className={"fr-mb-5w " + styles["error"]}> {errorMessage} </div>}
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-4">
              <label className="fr-label">
                {wording.MOT_DE_PASSE}
              </label>
            </div>
            <div className="fr-col-11 fr-col-md-8">
              <input
                className="fr-input"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}"
                title="Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."
                type="password"
                value={passwordValue}
                onChange={passwordValueOnChange}
                required
              />
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--center fr-mt-5w">
            <div className="fr-col-12 fr-col-md-4">
              <label className="fr-label">
                {wording.CONFIRMER_MOT_DE_PASSE}
              </label>
            </div>
            <div className="fr-col-11 fr-col-md-8">
              <input
                className="fr-input"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}"
                title="Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."
                type="password"
                value={confirmPasswordValue}
                onChange={confirmPasswordValueOnChange}
                required
              />
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--center fr-mt-8w fr-mb-6w">
            <ul className="fr-btns-group fr-btns-group--inline-sm">
              <li>
                <button className="fr-btn fr-btn--secondary" onClick={annuler}>
                  {wording.CANCEL}
                </button>
              </li>
              <li>
                <button className="fr-btn" type="submit">
                  {wording.CONFIRM_CHANGE_PASSWORD}
                </button>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};
