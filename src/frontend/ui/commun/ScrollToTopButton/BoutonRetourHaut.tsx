"use client";
import styles from "./BoutonRetourHaut.module.css";

export const BoutonRetourHaut = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      aria-label="Retour en haut de page"
      className={`fr-btn fr-btn--secondary fr-btn--icon-only ${styles["bouton"]}`}
      onClick={scrollToTop}
      type="button"
    >
      <span aria-hidden="true" className="fr-icon-arrow-up-line" />
    </button>
  );
};
