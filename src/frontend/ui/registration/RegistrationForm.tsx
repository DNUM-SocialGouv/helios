import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import { Institution } from "../../../backend/métier/entities/Utilisateur/Institution";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Registration.module.css";

import "@gouvfr/dsfr/dist/component/select/select.min.css";

export const RegistrationForm = () => {
    const { wording } = useDependencies();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [institutionList, setInstitutionsList] = useState<Institution[]>([]);
    const [institution, setInstitution] = useState(institutionList[0]?.code);

    const createAccount = () => {
        fetch("/api/utilisateurs/createAccount", {
            body: JSON.stringify({ firstName, lastName, email, institution }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(() => {
                router.push('/connexion')

            })
            .catch(() => {
                router.push('/connexion')
            })
    }

    const cancel = () => {
        router.push('/connexion')
    }

    const handleInstitutionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setInstitution(event.target.value)
        // eslint-disable-next-line no-console
        console.log('event.target.value', event.target.value);
    }

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
            })
    }, []);

    return (
        <div className={styles["container"]}>
            <h1>{wording.REGISTRATION_PAGE_TITLE}</h1>
            <div className="fr-grid-row fr-grid-row--center fr-mt-8w">
                <form className="fr-col-12 fr-col-md-8 fr-mt-5w" onSubmit={createAccount} >
                    <div className="fr-grid-row fr-grid-row--center fr-mb-3w">
                        <div className="fr-col-12 fr-col-md-4">
                            <label className="fr-label">
                                {wording.LASTNAME}
                            </label>
                        </div>
                        <div className="fr-col-11 fr-col-md-8">
                            <input
                                className="fr-input"
                                onChange={({ target }) => { setLastName(target.value); }}
                                required
                                type="text"
                                value={lastName}
                            />
                        </div>
                    </div>
                    <div className="fr-grid-row fr-grid-row--center fr-mb-3w">
                        <div className="fr-col-12 fr-col-md-4">
                            <label className="fr-label">
                                {wording.FIRSTNAME}
                            </label>
                        </div>
                        <div className="fr-col-11 fr-col-md-8">
                            <input
                                className="fr-input"
                                onChange={({ target }) => { setFirstName(target.value); }}
                                required
                                type="text"
                                value={firstName}
                            />
                        </div>
                    </div>
                    <div className="fr-grid-row fr-grid-row--center fr-mb-3w">
                        <div className="fr-col-12 fr-col-md-4">
                            <label className="fr-label">
                                {wording.EMAIL}
                            </label>
                        </div>
                        <div className="fr-col-11 fr-col-md-8">
                            <input
                                className="fr-input"
                                onChange={({ target }) => { setEmail(target.value); }}
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
                            <select className="fr-select" id="select" name="select" onChange={handleInstitutionChange} value={institution}>
                                <option disabled hidden selected value="">Selectionnez votre institution</option>
                                {institutionList.map((institution) => (
                                    <option key={institution.id} value={institution.code}> {institution.libelle}</option>
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
                                <button className="fr-btn" type="submit">
                                    {wording.SEND}
                                </button>
                            </li>
                        </ul>
                    </div>
                </form>
            </div >
        </div >
    );
};