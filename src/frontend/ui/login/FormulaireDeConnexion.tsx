import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { useState, FormEvent, useContext } from "react";

import styles from "./Connexion.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import isEmail from "../commun/validation";

export const FormulaireDeConnexion = () => {
  const { wording } = useDependencies();
  const userContext = useContext(UserContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isEmail(email)) {
      setLoading(true);
      userContext?.setPasswordCreated(false);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("L'identifiant et/ou le mot de passe sont incorrects.");
        setLoading(false);
      } else {
        await fetch("/api/utilisateurs/checkUserIsNotAdminAndInactif", {
          body: JSON.stringify({ email: email }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }).then(async (rep) => {
          if (rep.status === 401) {
            setError(`Votre compte est désactivé.
            Merci de régénérer un mot de passe via Mot de passe oublié ?`);
            setLoading(false);
          } else {
            setError(null);
            await fetch("/api/utilisateurs/updateLastConnectionDate", {
              body: JSON.stringify({ email: email }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            }).then(async (rep) => {
              if (rep.status === 200) {
                window.location.href = "/";
              } else {
                //console.log("error updateLastConnectionDate");
              }
            });
          }
        });
      }
    } else {
      setErrorMsg("Email invalide");
    }
  };

  return (
    <div className="fr-grid-row  fr-grid-row--center">
      <section className={"fr-col-6 " + styles["container"]}>
        {userContext?.passwordCreated && (
          <div className="fr-grid-row  fr-grid-row--center">
            <span> Votre nouveau mot de passe a bien été pris en compte. </span>
            <br />
            <span>Merci de saisir vos identifiant et mot de passe pour vous connecter</span>
          </div>
        )}
        <form className="fr-mt-5w" data-testid="login-form" id="login-1760" onSubmit={handleSubmit}>
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
                  className={`fr-input fr-mt-1w ${styles["mb-20"]}`}
                  id="username-1757"
                  name="username"
                  onChange={({ target }) => {
                    setEmail(target.value);
                    setErrorMsg("");
                    setError("");
                  }}
                  required
                  type="email"
                  value={email}
                />
                {errorMsg && <div className={styles["error"]}> {errorMsg} </div>}
                <div aria-live="assertive" className="fr-messages-group" id="username-1757-messages"></div>
              </div>
            </div>
            <div className="fr-fieldset__element fr-mb-3w">
              <div className="fr-password" id="password-1758">
                <div className={"fr-password__checkbox fr-checkbox-group fr-checkbox-group--sm " + styles["password-label"]}>
                  <label className="fr-label" htmlFor="password-1758-input">
                    {wording.CONNEXION_MOT_DE_PASSE}
                  </label>
                  <label className="fr-password__checkbox fr-label" htmlFor="password-1758-show">
                    <input
                      aria-describedby="password-1758-show-messages"
                      aria-label="Afficher le mot de passe"
                      id="password-1758-show"
                      style={{ marginRight: "3px" }}
                      type="checkbox"
                    />
                    Afficher
                  </label>
                </div>
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
                <div aria-live="assertive" className="fr-messages-group" id="password-1758-input-messages"></div>
                <p>
                  <Link className={"fr-link " + styles["links-underline"]} href="/mot-passe-oublie">
                    {wording.FORGET_PASSEWORD}
                  </Link>
                </p>
                <p>
                  {wording.CONNEXION_MOT_DE_PASSE_OUBLIE}
                  <Link className={"fr-link " + styles["links-underline"]} href="/registration">
                    S&apos;inscrire
                  </Link>
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
          <div aria-live="assertive" className="fr-messages-group" id="login-1760-fieldset-messages"></div>
        </form>
      </section>
    </div>
  );
};
