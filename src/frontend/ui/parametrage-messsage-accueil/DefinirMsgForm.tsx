import { useState } from "react";

import styles from "./ParametrageMsgAccueil.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";


export function DefinirMsgForm() {
  const { wording } = useDependencies();
  const [message, setMessage] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [badgeStatus, setBadgeStatus] = useState("");
  const [badgeLibelle, setBadgeLibelle] = useState("");
  const [errors, setErrors] = useState<{ message?: string; dateDebut?: string; dateFin?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const todayISO = new Date().toISOString().split("T")[0];

  const validate = (): boolean => {
    const newErrors: { message?: string; dateDebut?: string; dateFin?: string } = {};
    if (!message.trim()) {
      newErrors.message = "Le message est obligatoire.";
    }
    if (!dateDebut) {
      newErrors.dateDebut = "La date de début est obligatoire.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(dateDebut) < today) {
        newErrors.dateDebut = "La date de début doit être supérieure ou égale à la date du jour.";
      }
    }
    if (dateFin && dateDebut && new Date(dateFin) <= new Date(dateDebut)) {
      newErrors.dateFin = "La date de fin doit être supérieure à la date de début.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/message-accueil", {
        body: JSON.stringify({
          badgeLibelle: badgeLibelle || null,
          badgeType: badgeStatus || null,
          contenu: message,
          dateDebut,
          dateFin: dateFin || null,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (response.ok) {
        setSuccessMessage("Votre message est enregistré avec succès.");
        setMessage("");
        setDateDebut("");
        setDateFin("");
        setBadgeStatus("");
        setBadgeLibelle("");
        setErrors({});

      } else {
        setErrorMessage("Erreur lors de l'enregistrement.");
      }
    } catch {
      setErrorMessage("Erreur lors de l'enregistrement.");
    }
  };

   return (
    <div> 
        {successMessage && (
          <div className="fr-alert fr-alert--success fr-alert--sm fr-mb-3w">
            <p>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-3w">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
            <label className="fr-label">
                Badge:
            </label>
            <div className={styles["flex-input"]}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="select-status" >
                    Status:
                </label>
                <select aria-describedby="select-hint-messages" className="fr-select" id="select-status" name="select-hint" onChange={(e) => setBadgeStatus(e.target.value)} value={badgeStatus}>
                    <option disabled hidden value="">Sélectionner une option</option>
                    <option value="Succès">Succès</option>
                    <option value="Avertissement">Avertissement</option>
                    <option value="Erreur">Erreur</option>
                    <option value="Information">Information</option>
                    <option value="Nouveauté">Nouveauté</option>
                </select>
            </div>
            <div className={styles["flex-input"]}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="libelle" >
                    Libellé:
                </label>
                <input className="fr-input" id="libelle" name="libelle" onChange={(e) => setBadgeLibelle(e.target.value)} type="text" value={badgeLibelle} />
            </div>
        </div>
        <div className={`fr-mb-4w ${errors.message ? "fr-input-group--error" : ""}`}>
            <label className="fr-label" htmlFor="message-texte">
                Message 
            </label>
            <textarea
                aria-required="true"
                className={`fr-input ${errors.message ? "fr-input--error" : ""}`}
                id="message-texte"
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                value={message}
            />
            {errors.message && <p className="fr-error-text" id="message-texte-error">{errors.message}</p>}
         </div>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
            <label className="fr-label">
                Période d&apos;affichage:
            </label>
            <div className={`${styles["flex-input"]} ${errors.dateDebut ? "fr-input-group--error" : ""}`}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="date-debut" >
                    Du
                </label>
                <input
                    aria-required="true"
                    className={`fr-col fr-input ${errors.dateDebut ? "fr-input--error" : ""}`}
                    id="date-debut"
                    max={dateFin || undefined}
                    min={todayISO}
                    name="date-debut"
                    onChange={(e) => setDateDebut(e.target.value)}
                    type="date"
                    value={dateDebut}
                />
                {errors.dateDebut && <p className="fr-error-text" id="date-debut-error">{errors.dateDebut}</p>}
            </div>
            <div className={`${styles["flex-input"]} ${errors.dateFin ? "fr-input-group--error" : ""}`}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="date-fin" >
                    au
                </label>
                <input
                    className={`fr-col fr-input ${errors.dateFin ? "fr-input--error" : ""}`}
                    id="date-fin"
                    min={dateDebut || todayISO}
                    name="date-fin"
                    onChange={(e) => setDateFin(e.target.value)}
                    type="date"
                    value={dateFin}
                />
                {errors.dateFin && <p className="fr-error-text" id="date-fin-error">{errors.dateFin}</p>}
        </div>
        </div>
         <div className="fr-mt-5w fr-text-right">
            <button
              className="fr-btn fr-btn--secondary fr-mr-2w"
              onClick={() => globalThis.location.reload()}
              type="button"
            >
              {wording.PARAMETRAGE_AIDE_BOUTON_ANNULER_MODIFICATIONS}
            </button>
            <button
              className="fr-btn"
              onClick={handleSubmit}
              type="button"
            >
              {wording.PARAMETRAGE_AIDE_BOUTON_ENREGISTRER}
            </button>
          
          </div>
    </div>
    );
}
