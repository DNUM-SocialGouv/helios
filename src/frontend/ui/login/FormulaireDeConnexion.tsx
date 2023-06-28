import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, FormEvent } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Connexion.module.css";

const formsLink = "https://forms.office.com/e/ERQ9ck5sSc"

export const FormulaireDeConnexion = () => {
    const { wording } = useDependencies();
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true);
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("L'identifiant et/ou le mot de passe sont incorrects.");
            setLoading(false);
        } else {
            setError(null);
            router.push("/");
        }
    }

    return (
        <div className="fr-grid-row  fr-grid-row--center">
            <section className={"fr-col-6 " + styles["container"]}>
                <form className="fr-mt-5w" id="login-1760" onSubmit={handleSubmit}>
                    <div className="fr-fieldset__element">
                        <div className="fr-fieldset__element">
                            <div className="fr-input-group fr-mb-3w">
                                <label className="fr-label" htmlFor="username-1757">
                                    {wording.CONNEXION_IDENTIFIANT}
                                </label>
                                <input
                                    aria-describedby="username-1757-messages"
                                    aria-required="true"
                                    autoComplete="username"
                                    className="fr-input fr-mt-1w"
                                    id="username-1757"
                                    name="username"
                                    onChange={({ target }) => { setEmail(target.value) }}
                                    required
                                    type="email"
                                    value={email}
                                />
                                <div aria-live="assertive" className="fr-messages-group" id="username-1757-messages">
                                </div>
                            </div>
                        </div>
                        <div className="fr-fieldset__element fr-mb-3w">
                            <div className="fr-password" id="password-1758">
                                <label className="fr-label" htmlFor="password-1758-input">
                                    {wording.CONNEXION_MOT_DE_PASSE}
                                </label>
                                <div className="fr-input-wrap fr-mt-1w fr-mb-2w">
                                    <input
                                        aria-describedby="password-1758-input-messages"
                                        aria-required="true"
                                        autoComplete="current-password"
                                        className="fr-password__input fr-input"
                                        data-testid="password-1758-input"
                                        id="password-1758-input"
                                        name="password"
                                        onChange={({ target }) => setPassword(target.value)}
                                        required
                                        type="password"
                                        value={password}
                                    />
                                </div>
                                <div aria-live="assertive" className="fr-messages-group" id="password-1758-input-messages">
                                </div>
                                <p>
                                    {wording.CONNEXION_MOT_DE_PASSE_OUBLIE}
                                    <a className="fr-link" href={formsLink}>
                                        S&apos;inscrire
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div aria-live="assertive" className={"fr-messages-group " + styles["error-message"]} id="credentials-messages">
                            {error}
                        </div>
                    </div>
                    <div className="fr-fieldset__element">
                        <ul className="fr-btns-group">
                            <li>
                                <button className="fr-mt-2v fr-btn" disabled={loading} type="submit">
                                    {wording.CONNEXION_LIBELLE}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div aria-live="assertive" className="fr-messages-group" id="login-1760-fieldset-messages">
                    </div>
                </form>
            </section>
        </div>
    );
};
