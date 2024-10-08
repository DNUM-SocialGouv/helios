import { ChangeEventHandler, MouseEventHandler, FormEventHandler } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./changeMdp.module.css";

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
}>;


export const FormulaireChangeMdp = ({ annuler, changePassword, oldPasswordValue, oldPasswordValueOnChange, confirmPasswordValue, confirmPasswordValueOnChange, errorMessage, isLoading, passwordValue, passwordValueOnChange, updated }: FormulaireChangeMdpProps) => {
    const { wording } = useDependencies();

    return (
        <div className="fr-grid-row">
            <section className="fr-col-12 fr-mt-5w">
                <h1 className={styles["title"]}>{wording.CHANGEMENT_MOT_PASSE_TITRE}</h1>
                <p>{wording.CHANGEMENT_MOT_PASSE_DESCRIPTION}</p>
                <div className="fr-grid-row fr-mt-8w fr-ml-8w">
                    <form className="fr-col-11 fr-mt-5w" onSubmit={changePassword} >
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
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}"
                                    required
                                    title="Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."
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
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}"
                                    required
                                    title="Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."
                                    type="password"
                                    value={passwordValue}
                                />
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
                                    title="Mot de passe invalide. Le mot de passe doit être composé d'au moins 12 caractères dont: 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial."
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
