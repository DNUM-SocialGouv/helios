import { ChangeEvent, FormEvent, RefObject } from "react";

import { RessourceAide } from "./types";

type ModalRessourceProps = Readonly<{
  ouverte: boolean;
  valeurs: RessourceFormulaire;
  editionEnCours: boolean;
  ancre: RefObject<HTMLDialogElement>;
  champInitial: RefObject<HTMLInputElement>;
  surFermeture: () => void;
  surChangement: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  surValidation: (event: FormEvent<HTMLFormElement>) => void;
}>;

export type RessourceFormulaire = {
  slug: string;
  nom: string;
  type: RessourceAide["type"];
  lien: string;
  ordre: number;
  date: string;
  nom_telechargement: string;
};

const TYPES_RESSOURCE: { valeur: RessourceAide["type"]; libelle: string }[] = [
  { valeur: "document", libelle: "Document" },
  { valeur: "video", libelle: "Vidéo" },
  { valeur: "lien", libelle: "Lien" },
];

export function ModalRessource({
  ouverte,
  valeurs,
  editionEnCours,
  ancre,
  champInitial,
  surFermeture,
  surChangement,
  surValidation,
}: ModalRessourceProps) {
  return (
    <dialog
      aria-labelledby="parametrage-aide-resource-modal-title"
      className={`fr-modal ${ouverte ? "fr-modal--opened" : ""}`}
      id="parametrage-aide-resource-modal"
      onCancel={(event) => {
        event.preventDefault();
        surFermeture();
      }}
      ref={ancre}
    >
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button
                  aria-controls="parametrage-aide-resource-modal"
                  className="fr-btn fr-btn--close"
                  onClick={surFermeture}
                  type="button"
                >
                  Fermer
                </button>
              </div>
              <form className="fr-form fr-p-4w fr-card fr-card--shadow fr-modal__content" onSubmit={surValidation}>
                <h3 className="fr-modal__title fr-mb-4w" id="parametrage-aide-resource-modal-title">
                  {editionEnCours ? "Modifier la ressource" : "Ajouter une ressource"}
                </h3>

                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="resource-nom">Nom *</label>
                  <input
                    className="fr-input"
                    id="resource-nom"
                    name="nom"
                    onChange={surChangement}
                    ref={champInitial}
                    required
                    type="text"
                    value={valeurs.nom}
                  />
                </div>

                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-select-group">
                      <label className="fr-label" htmlFor="resource-type">Type *</label>
                      <select
                        className="fr-select"
                        id="resource-type"
                        name="type"
                        onChange={surChangement}
                        required
                        value={valeurs.type}
                      >
                        {TYPES_RESSOURCE.map((option) => (
                          <option key={option.valeur} value={option.valeur}>
                            {option.libelle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="resource-lien">Lien *</label>
                  <textarea
                    className="fr-input"
                    id="resource-lien"
                    name="lien"
                    onChange={surChangement}
                    required
                    value={valeurs.lien}
                  />
                </div>

                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="resource-date">Date</label>
                      <input
                        className="fr-input"
                        id="resource-date"
                        name="date"
                        onChange={surChangement}
                        type="text"
                        value={valeurs.date}
                      />
                    </div>
                  </div>
                </div>

                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="resource-nom-telechargement">Nom du fichier</label>
                      <input
                        className="fr-input"
                        id="resource-nom-telechargement"
                        name="nom_telechargement"
                        onChange={surChangement}
                        type="text"
                        value={valeurs.nom_telechargement}
                      />
                    </div>
                  </div>
                </div>

                <div className="fr-mt-4w fr-btns-group fr-btns-group--inline fr-btns-group--right">
                  <button className="fr-btn fr-btn--secondary" onClick={surFermeture} type="button">
                    Annuler
                  </button>
                  <button className="fr-btn" type="submit">
                    {editionEnCours ? "Enregistrer" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
