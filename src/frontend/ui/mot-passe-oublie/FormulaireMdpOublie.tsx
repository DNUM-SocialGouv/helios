import { ChangeEventHandler, MouseEventHandler, FormEventHandler } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./MdpOublie.module.css";

type FormulaireMdpOublieProps = Readonly<{
  annuler: MouseEventHandler<HTMLButtonElement>;
  emailSent: boolean;
  emailValue: string;
  emailValueOnChange: ChangeEventHandler<HTMLInputElement>;
  envoyerEmail: FormEventHandler<HTMLFormElement>;
  errorMessage: string;
  retourAccueil: MouseEventHandler<HTMLButtonElement>;
  // isLoading: boolean;
}>;


export const FormulaireMdpOublie = ({ annuler, emailSent, emailValue, emailValueOnChange, envoyerEmail, errorMessage, retourAccueil }: FormulaireMdpOublieProps) => {
  const { wording } = useDependencies();
  return (
    <div className={styles["align"]}>
      <div className="fr-grid-row fr-grid-row--center">
        <h2>{wording.MOT_PASSE_OUBLIE_TITRE}</h2>
      </div>
      <div className="fr-grid-row fr-grid-row--center fr-mt-8w">
        {emailSent ?
          (
            <form className="fr-col-12 fr-col-sm-6" onSubmit={envoyerEmail}>
              <div className={styles["success"]}>{wording.MOT_PASSE_OUBLIE_SUCCESS_MESSAGE + emailValue}</div>
              <div className="fr-grid-row fr-grid-row--center fr-mt-8w fr-mb-6w">
                <ul className="fr-btns-group fr-btns-group--inline-sm">
                  <li>
                    <button className="fr-btn fr-btn--secondary" onClick={retourAccueil}>
                      {wording.BACK_TO_HOME}
                    </button>
                  </li>
                  <li>
                    <button className="fr-btn" type="submit">
                      {wording.RESEND_EMAIL}
                    </button>
                  </li>
                </ul>
              </div>
            </form>
          ) :
          (
            <form className="fr-col-10 fr-col-sm-5" onSubmit={envoyerEmail}>
              {errorMessage && <div className={styles["error"]}> {errorMessage} </div>}
              <div className="fr-grid-row fr-grid-row--center">

                <div className="fr-col-12">
                  <input
                    className="fr-input"
                    onChange={emailValueOnChange}
                    required
                    type="email"
                    value={emailValue}
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
                    <button className="fr-btn" type="submit">
                      {wording.SEND_EMAIL}
                    </button>
                  </li>
                </ul>
              </div>
            </form>
          )}
      </div>
    </div>
  );
};
