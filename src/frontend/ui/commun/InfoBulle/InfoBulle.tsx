"use client";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import { useDependencies } from "../contexts/useDependencies";

type InfoBulleProps = Readonly<{
  children: ReactElement;
  estCeOuvert: boolean;
  identifiant: string;
  setEstCeOuvert: Function;
  titre: ReactNode;
}>;

export const InfoBulle = ({ children, estCeOuvert, identifiant, setEstCeOuvert, titre }: InfoBulleProps) => {
  const { wording } = useDependencies();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.body);
  }, []);

  let className = "fr-modal";

  if (estCeOuvert) {
    className = "fr-modal fr-modal--opened";
  }

  if (!estCeOuvert) {
    className = "fr-modal";
  }

  const fermelInfoBulle = () => {
    setEstCeOuvert(false);
  };

  const InfoBulleContent = (
    <dialog aria-labelledby={`titre-info-bulle-${identifiant}`} className={className} id={`nom-info-bulle-${identifiant}`} open={estCeOuvert}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8">
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button
                  aria-controls={`nom-info-bulle-${identifiant}`}
                  className="fr-btn--close fr-btn"
                  onClick={fermelInfoBulle}
                  title="Fermer la fenêtre modale"
                  type="button"
                >
                  {wording.FERMER}
                </button>
              </div>
              <div className="fr-modal__content">
                <h1 className="fr-modal__title" id={`titre-info-bulle-${identifiant}`}>
                  <span aria-hidden="true" className="fr-fi-arrow-right-line fr-fi--lg"></span>
                  {titre}
                </h1>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );

  if (!container) {
    return null;
  }

  return createPortal(InfoBulleContent, document.body);
};
