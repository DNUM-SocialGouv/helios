"use client";
import { useEffect, useState } from "react";

import styles from "./BoutonRetourHaut.module.css";

export const BoutonRetourHaut = () => {
  const [estVisible, setEstVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      setEstVisible(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!estVisible) return null;

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
