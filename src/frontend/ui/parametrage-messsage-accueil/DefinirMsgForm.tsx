import { useState } from "react";

import styles from "./ParametrageMsgAccueil.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";

interface MessageChevauchement {
  id: number;
  contenu: string;
  dateDebut: string;
  dateFin: string | null;
}

export function DefinirMsgForm() {
  const { wording } = useDependencies();
  const [message, setMessage] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [badgeStatus, setBadgeStatus] = useState("");
  const [badgeLibelle, setBadgeLibelle] = useState("");
  const [lienUrl, setLienUrl] = useState("");
  const [lienLibelle, setLienLibelle] = useState("");
  const [errors, setErrors] = useState<{ message?: string; dateDebut?: string; dateFin?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [chevauchements, setChevauchements] = useState<MessageChevauchement[]>([]);
  const [showChevauchementAlert, setShowChevauchementAlert] = useState(false);
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
    if (!dateFin) {
      newErrors.dateFin = "La date de fin est obligatoire.";
    } else if (dateDebut && new Date(dateFin) <= new Date(dateDebut)) {
      newErrors.dateFin = "La date de fin doit être supérieure à la date de début.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (forcerEnregistrement = false, desactiverIds: number[] = []) => {
    if (!validate()) return;

    setSuccessMessage("");
    setErrorMessage("");
    setShowChevauchementAlert(false);

    try {
      const response = await fetch("/api/message-accueil", {
        body: JSON.stringify({
          badgeLibelle: badgeLibelle || null,
          badgeType: badgeStatus || null,
          contenu: message,
          dateDebut,
          dateFin,
          desactiverIds,
          forcerEnregistrement,
          lienUrl: lienUrl || null,
          lienLibelle: lienLibelle || null,
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
        setLienUrl("");
        setLienLibelle("");
        setErrors({});
        setChevauchements([]);
      } else if (response.status === 409) {
        const data = await response.json();
        setChevauchements(data.chevauchements);
        setShowChevauchementAlert(true);
      } else {
        setErrorMessage("Erreur lors de l'enregistrement.");
      }
    } catch {
      setErrorMessage("Erreur lors de l'enregistrement.");
    }
  };

  const handleChoisirNouveauMessage = () => {
    const idsADesactiver = chevauchements.map((c) => c.id);
    handleSubmit(true, idsADesactiver);
  };

  const handleAnnulerChevauchement = () => {
    setShowChevauchementAlert(false);
    setChevauchements([]);
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
        {showChevauchementAlert && (
          <div className="fr-alert fr-alert--warning fr-mb-3w">
            <p>
              Un seul message peut être affiché sur une même période. Veuillez sélectionner le message que vous souhaitez afficher ou modifier les dates de début et de fin du message en cours de création.
            </p>
            <ul className="fr-mt-2w">
              {chevauchements.map((c) => (
                <li key={c.id}>
                  &laquo; {c.contenu} &raquo; (du {c.dateDebut} au {c.dateFin || "—"})
                </li>
              ))}
            </ul>
            <div className="fr-mt-2w">
              <button
                className="fr-btn fr-btn--sm fr-mr-2w"
                onClick={handleChoisirNouveauMessage}
                type="button"
              >
                Afficher le nouveau message
              </button>
              <button
                className="fr-btn fr-btn--sm fr-btn--secondary"
                onClick={handleAnnulerChevauchement}
                type="button"
              >
                Modifier les dates
              </button>
            </div>
          </div>
        )}
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
            <span className="fr-label">
                Badge:
            </span>
            <div className={styles["flex-input"]}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="select-status" >
                    Statut:
                </label>
                <select aria-describedby="select-hint-messages" className="fr-select" id="select-status" name="select-hint" onChange={(e) => setBadgeStatus(e.target.value)} value={badgeStatus}>
                    <option disabled hidden value="">Sélectionner une option</option>
                    <option value="success">Succès</option>
                    <option value="warning">Avertissement</option>
                    <option value="error">Erreur</option>
                    <option value="info">Information</option>
                    <option value="new">Nouveauté</option>
                </select>
            </div>
            <div className={styles["flex-input"]}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="libelle" >
                    Libellé:
                </label>
                <input 
                className={`fr-input ${styles["full-width"]}`} 
                id="libelle" 
                name="libelle"
                 onChange={(e) => setBadgeLibelle(e.target.value)} 
                 type="text" 
                 value={badgeLibelle} 
                 />
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
        <div className="fr-mb-4w">
          <span className="fr-label fr-mb-2w">
            Lien hypertexte:
          </span>
            <label className="fr-label" htmlFor="lien-url">
                URL du lien hypertexte:
            </label>
            <textarea 
              className="fr-input" 
              id="lien-url" 
              name="lien-url" 
              onChange={(e) => setLienUrl(e.target.value)} 
              rows={3} 
              value={lienUrl} 
            />
        </div>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
            <div className={`${styles["flex-input"]} ${styles["full-width"]}`}>
                <label className="fr-label fr-ml-2w fr-mr-2w" htmlFor="lien-libelle" >
                    Texte cliquable du lien hypertexte:
                </label>
                <input 
                  className={`fr-input ${styles["full-width"]}`} 
                  id="lien-libelle" 
                  name="lien-libelle" 
                  onChange={(e) => setLienLibelle(e.target.value)} 
                  type="text" 
                  value={lienLibelle} 
                />
            </div>
        </div>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
            <span className="fr-label">
                Période d&apos;affichage:
            </span>
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
                    aria-required="true"
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
              onClick={() => handleSubmit()}
              type="button"
            >
              {wording.PARAMETRAGE_AIDE_BOUTON_ENREGISTRER}
            </button>
          
          </div>
    </div>
    );
}
