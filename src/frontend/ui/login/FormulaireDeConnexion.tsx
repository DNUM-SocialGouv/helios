// import { ChangeEventHandler, MouseEventHandler } from "react";

import { signIn } from "next-auth/react";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Connexion.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export const FormulaireDeConnexion = () => {
    const { wording } = useDependencies();
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if(res?.error) {
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
                <h1>{wording.CONNEXION_TITRE}</h1>
                <form id="login-1760" className="fr-mt-5w" onSubmit={handleSubmit}>
                    <div className="fr-fieldset__element">
                        <div className="fr-fieldset__element">
                            <div className="fr-input-group fr-mb-3w">
                                <label className="fr-label" htmlFor="username-1757">
                                    {wording.CONNEXION_IDENTIFIANT}
                                </label>
                                <input
                                    className="fr-input fr-mt-1w"
                                    autoComplete="username"
                                    aria-required="true"
                                    aria-describedby="username-1757-messages"
                                    name="username"
                                    id="username-1757"
                                    type="email"
                                    value={email}
                                    onChange={({ target }) => { setEmail(target.value) }}
                                    required
                                />
                                <div className="fr-messages-group" id="username-1757-messages" aria-live="assertive">
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
                                        className="fr-password__input fr-input"
                                        aria-describedby="password-1758-input-messages"
                                        aria-required="true"
                                        name="password"
                                        autoComplete="current-password"
                                        id="password-1758-input"
                                        data-testid="password-1758-input"
                                        type="password"
                                        value={password}
                                        onChange={({ target }) => setPassword(target.value)}
                                        required
                                    />
                                </div>
                                <div className="fr-messages-group" id="password-1758-input-messages" aria-live="assertive">
                                </div>
                                <p>
                                    <a href="/mot-de-passe-oublie" className="fr-link">
                                        {wording.CONNEXION_MOT_DE_PASSE_OUBLIE}
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className={"fr-messages-group " + styles["error-message"]} id="credentials-messages" aria-live="assertive">
                            {error}
                        </div>
                    </div>
                    <div className="fr-fieldset__element">
                        <ul className="fr-btns-group">
                            <li>
                                <button className="fr-mt-2v fr-btn" type="submit" disabled={loading}>
                                    {wording.CONNEXION_LIBELLE}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="fr-messages-group" id="login-1760-fieldset-messages" aria-live="assertive">
                        {/* {session.status} */}
                    </div>
                </form>
            </section>
        </div>
    );
};
