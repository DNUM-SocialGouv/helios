import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import styles from "./Registration.module.css";
import { Institution } from "../../../backend/métier/entities/Utilisateur/Institution";
import { useDependencies } from "../commun/contexts/useDependencies";

import "@gouvfr/dsfr/dist/component/select/select.min.css";

export const RegistrationForm = () => {
  const { paths, wording } = useDependencies();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institutionList, setInstitutionsList] = useState<Institution[]>([]);
  const [institution, setInstitution] = useState(institutionList[0]?.code);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clickBtnSend, setClickBtnSend] = useState(false);

  const createAccount = async (e: FormEvent) => {
    e.preventDefault();
    setClickBtnSend(true);
    fetch("/api/utilisateurs/createAccount", {
      body: JSON.stringify({ firstName, lastName, email, institution }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.err === "Email already used") {
          setErrorMessage("EMAIL_ALREADY_USED");
          setEmailSent(false);
        } else {
          if (data.err === "Can't use this email for this institution") {
            setErrorMessage("NOT_AUTORIZED_EMAIL");
            setEmailSent(false);
          } else {
            setInstitution(institutionList[0]?.code);
            setFirstName("");
            setLastName("");
            setEmail("");
            setEmailSent(true);
            setErrorMessage("");
          }
        }
        setClickBtnSend(false);
      })
      .catch(() => {
        router.push("/connexion");
      });
  };

  const cancel = () => {
    router.push("/connexion");
  };

  const handleInstitutionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setInstitution(event.target.value);
  };

  useEffect(() => {
    fetch("/api/institution/get", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setInstitutionsList(data);
      })
      .catch(() => {
        setInstitutionsList([]);
      });
  }, []);

  return (
    <div className={styles["container"]}>
      <h1>{wording.REGISTRATION_PAGE_TITLE}</h1>
      <div className="fr-grid-row fr-grid-row--center fr-mt-8w">
        <div className="fr-col-12 fr-col-md-8 fr-mt-5w">
          {errorMessage && errorMessage === "EMAIL_ALREADY_USED" && (
            <div className={"fr-mb-5w " + styles["error"]}>
              {" "}
              {wording.EMAIL_ALREADY_USED}{" "}
              <Link className={styles["forget-email-link"]} href={paths.FORGET_PASSWORD}>
                {" "}
                ici{" "}
              </Link>{" "}
            </div>
          )}
          {errorMessage && errorMessage === "NOT_AUTORIZED_EMAIL" && (
            <div className={"fr-mb-5w " + styles["error"]}>
              {wording.NOT_AUTORIZED_EMAIL}
            </div>
          )}
          {emailSent && <div className={"fr-mb-5w " + styles["success"]}> {wording.REGISTRARTION_SUCCESS_MESSAGE} </div>}
          <form className="fr-col-12 fr-mt-5w" onSubmit={createAccount}>
            <div className="fr-grid-row fr-grid-row--center fr-mb-3w">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label">{wording.LASTNAME}</label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <input
                  aria-label={wording.LASTNAME}
                  className="fr-input"
                  onChange={({ target }) => {
                    setLastName(target.value);
                  }}
                  required
                  type="text"
                  value={lastName}
                />
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--center fr-mb-3w">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label">{wording.FIRSTNAME}</label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <input
                  aria-label={wording.FIRSTNAME}
                  className="fr-input"
                  onChange={({ target }) => {
                    setFirstName(target.value);
                  }}
                  required
                  type="text"
                  value={firstName}
                />
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--center fr-mb-3w">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label">{wording.EMAIL}</label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <input
                  aria-label={wording.EMAIL}
                  className="fr-input"
                  onChange={({ target }) => {
                    setEmail(target.value);
                  }}
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>
            <div className="fr-select-group fr-grid-row fr-grid-row--center fr-mb-3w">
              <div className="fr-col-12 fr-col-md-4">
                <label className="fr-label" htmlFor="select">
                  {wording.ORGANIZATION}
                </label>
              </div>
              <div className="fr-col-11 fr-col-md-8">
                <select className="fr-select" id="select" name="select" onChange={handleInstitutionChange} required value={institution}>
                  <option disabled hidden selected value="">
                    Selectionnez votre institution
                  </option>
                  {institutionList.map((institution) => (
                    <option key={institution.id} value={institution.code}>
                      {" "}
                      {institution.libelle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--center fr-mt-8w fr-mb-6w">
              <ul className="fr-btns-group fr-btns-group--inline-sm">
                <li>
                  <button className="fr-btn fr-btn--secondary" onClick={cancel} type="button">
                    {wording.CANCEL}
                  </button>
                </li>
                <li>
                  <button className="fr-btn" disabled={clickBtnSend} type="submit">
                    {wording.SEND}
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
