"use client";
import { Dispatch, ReactElement, ReactNode, SetStateAction, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import { useDependencies } from "../contexts/useDependencies";

type InfoBulleProps = Readonly<{
  children: ReactElement;
  estCeOuvert: boolean;
  identifiant: string;
  setEstCeOuvert: Dispatch<SetStateAction<boolean>>;
  titre: ReactNode;
}>;

export const InfoBulleComparaison = ({ children, estCeOuvert, identifiant, setEstCeOuvert, titre }: InfoBulleProps) => {
  const { wording } = useDependencies();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    async function changeContent() {
      setContainer(document.body);
    }
    changeContent();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (estCeOuvert && !dialog.open) {
      dialog.showModal();
    } else if (!estCeOuvert && dialog.open) {
      dialog.close();
    }
  }, [estCeOuvert]);

  let className = "fr-modal";
  if (estCeOuvert) {
    className = "fr-modal fr-modal--opened";
  }

  const fermelInfoBulle = () => {
    setEstCeOuvert(false);
  };

  const InfoBulleContent = (
    <dialog
      aria-labelledby={`titre-info-bulle-${identifiant}`}
      className={className}
      id={`nom-info-bulle-${identifiant}`}
      onCancel={fermelInfoBulle}
      ref={dialogRef}
      role='dialog'
    >
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