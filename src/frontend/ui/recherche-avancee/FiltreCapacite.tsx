import { Dispatch, SetStateAction, useContext, useState } from "react";

import { WordingFr } from "../../configuration/wording/WordingFr";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { CapaciteEtablissement } from "./model/CapaciteEtablissement";
import { classificationTypes } from "./model/ClassificationTypes";
import styles from "./RechercheAvanceeFormulaire.module.css";
import "@gouvfr/dsfr/dist/component/tooltip/tooltip.css";

export const FiltreCapacite = () => {
  const wording = new WordingFr();
  const [showToolip, setShowTooltip] = useState<boolean>(false);
  const [showToolip2, setShowTooltip2] = useState<boolean>(false);
  const [capaciteMedicoSociaux, setCapaciteMedicoSociaux] = useState<CapaciteEtablissement>(new CapaciteEtablissement("", []));
  const [capaciteHandicap, setCapaciteHandicap] = useState<CapaciteEtablissement>(new CapaciteEtablissement("", []));
  const [capaciteAgees, setCapaciteAgees] = useState<CapaciteEtablissement>(new CapaciteEtablissement("", []));
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
  const contenuInfoBulle = (
    <span style={{ lineHeight: "22px", fontSize: "12px" }}>
      <ul>
        <li>SESSAD - Service d’Education Spéciale et de Soins à Domicile (cat FINESS 182)</li>
        <li>IME - Institut Médico Éducatif (Cat FINESS 183)</li>
        <li>ITEP - Institut Thérapeutique Éducatif et Pédagogique (cat FINESS 186)</li>
        <li>EEAP - Établissement pour Enfants ou Adolescents Polyhandicapés (cat FINESS 188)</li>
        <li>CMPP - Centre Médico-Psycho-Pédagogique (cat FINESS 189)</li>
        <li>CAMSP - Centre Action Médico-Sociale Précoce (cat FINESS 190)</li>
        <li>IEM - Institut d’Education Motrice (cat FINESS 192)</li>
        <li>IDV - Institut pour Déficients Visuels (cat FINESS 194)</li>
        <li>IDA - Institut pour Déficients Auditifs (cat FINESS 195)</li>
        <li>CPO - Établissement et Service de Pré-orientation (cat FINESS 198)</li>
        <li>ESAT - Établissement et Service d’Aide par le Travail (cat FINESS 246)</li>
        <li>CRP - Établissement et Service de Réadaptation Professionnelle (cat FINESS 249)</li>
        <li>MAS - Maison d’Accueil Spécialisée (cat FINESS 255)</li>
        <li>FAM - Foyer d’Accueil Médicalisé pour adultes handicapés (cat FINESS 437)</li>
        <li>SAMSAH - Service d’Accompagnement Médico-Social Adultes Handicapés (cat FINESS 445)</li>
        <li>EAM - Établissement Accueil Médicalisé en tout ou partie personnes handicapées (cat FINESS 448)</li>
        <li>CRA - Centre de Ressources Sans Autre Indication (cat FINESS 461)</li>
        <li>UEROS - Unités Évaluation Réentraînement et d’Orientation Sociale et Professionnelle (cat FINESS 464)</li>
      </ul>
    </span>
  );
  const contenuInfoBulleAgee = (
    <span style={{ lineHeight: "22px", fontSize: "12px" }}>
      <ul>
        <li>EHPAD- Etablissement d’Hébergement pour Personnes Agées Dépendantes (cat FINESS 500)</li>
        <li>SSIAD- Service de Soins Infirmiers A Domicile (cat FINESS 354)</li>
        <li>SAAS- Service Autonomie Aide et Soins (cat FINESS 209)</li>
      </ul>
    </span>
  );

  const onchange = (value: string, typeEtablissement: string) => {
    if (classificationTypes.etablissement_sociaux.classification === typeEtablissement) {
      onChangeCheck(value, capaciteMedicoSociaux?.ranges, setCapaciteMedicoSociaux, classificationTypes.etablissement_sociaux.classification);
    }
    if (classificationTypes.etablissement_handicap.classification === typeEtablissement) {
      onChangeCheck(value, capaciteHandicap?.ranges, setCapaciteHandicap, classificationTypes.etablissement_handicap.classification);
    }
    if (classificationTypes.etablissement_agees.classification === typeEtablissement) {
      onChangeCheck(value, capaciteAgees?.ranges, setCapaciteAgees, classificationTypes.etablissement_agees.classification);
    }
  };

  function onChangeCheck(i: string, statut: string[], setStatut: Dispatch<SetStateAction<CapaciteEtablissement>>, clasification: string): any {
    if (statut.length > 0 && statut.findIndex((a) => i === a) !== -1) {
      statut.splice(
        statut.findIndex((a) => i === a),
        1
      );
      setStatut(new CapaciteEtablissement(clasification, [...statut]));
    } else {
      setStatut(new CapaciteEtablissement(clasification, [...statut, i]));
    }
  }

  const appliquerButton = () => {
    rechercheAvanceeContext?.setCapaciter([capaciteMedicoSociaux, capaciteHandicap, capaciteAgees]);
  };

  const effacerButton = () => {
    setCapaciteMedicoSociaux(new CapaciteEtablissement("", []));
    setCapaciteHandicap(new CapaciteEtablissement("", []));
    setCapaciteAgees(new CapaciteEtablissement("", []));
    emptyCheckboxs();
    rechercheAvanceeContext?.setCapaciter([]);
  };

  // -- Cette fonction permet de unchecker tou les checkbox du modal capacité
  const emptyCheckboxs = () => {
    const container = document.querySelectorAll("#capaciter-container")[0];
    var list = container?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    list?.forEach((e) => {
      e.checked = false;
    });
  };

  return (
    <dialog aria-labelledby="fr-modal-Capacite-Filtre-title" className="fr-modal" id="fr-modal-Capacite-Filtre">
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body" style={{ display: showToolip || showToolip2 ? "block" : "none" }}>
              <div className="fr-modal__header">
                <button
                  aria-controls="titre-info-bulle-etablissement"
                  className="fr-btn--close fr-btn"
                  onClick={() => {
                    setShowTooltip(false);
                    setShowTooltip2(false);
                  }}
                  title="Fermer la fenêtre modale"
                  type="button"
                >
                  {wording.FERMER}
                </button>
              </div>
              <div className="fr-modal__content">
                <h1 className="fr-modal__title" id="titre-info-bulle-etablissement">
                  <span aria-hidden="true" className="fr-fi-arrow-right-line fr-fi--lg"></span>
                  Liste des Etablissements concerné
                </h1>
                {showToolip ? contenuInfoBulle : contenuInfoBulleAgee}
              </div>
            </div>
            <div className="fr-modal__body" style={{ display: showToolip || showToolip2 ? "none" : "block" }}>
              <div className="fr-modal__content fr-pt-5w" id="capaciter-container">
                <div>
                  <div id="etablissement-medico-sociaux">
                    <div>
                      <h6 style={{ margin: "0" }}>{wording.ETABLISSEMENTS_SOCIAUX_MEDICO_SOCIAUX}</h6>
                    </div>
                    <label className="fr-label" htmlFor="statut">
                      {wording.CAPACITE_INITIALE}
                    </label>
                    <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-capacite-initiale-tranche-1"
                          id="checkboxe-capacite-initiale-tranche-1"
                          name="checkboxe-capacite-initiale-tranche-1"
                          onChange={(e) => onchange(e.target.value, "non_classifie")}
                          type="checkbox"
                          value=">51"
                        />
                        <label htmlFor="checkboxe-capacite-initiale-tranche-1">1-50</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-capacite-initiale-tranche-1"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-capacite-initiale-tranche-2"
                          id="checkboxe-capacite-initiale-tranche-2"
                          name="checkboxe-capacite-initiale-tranche-2"
                          onChange={(e) => onchange(e.target.value, "non_classifie")}
                          type="checkbox"
                          value="51,100"
                        />
                        <label htmlFor="checkboxe-capacite-initiale-tranche-2">51-100</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-capacite-initiale-tranche-2"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-capacite-initiale-tranche-3"
                          id="checkboxe-capacite-initiale-tranche-3"
                          name="checkboxe-capacite-initiale-tranche-3"
                          onChange={(e) => onchange(e.target.value, "non_classifie")}
                          type="checkbox"
                          value="101,150"
                        />
                        <label htmlFor="checkboxe-capacite-initiale-tranche-3">101-150</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-capacite-initiale-tranche-3"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-capacite-initiale-tranche-4"
                          id="checkboxe-capacite-initiale-tranche-4"
                          name="checkboxe-capacite-initiale-tranche-4"
                          onChange={(e) => onchange(e.target.value, "non_classifie")}
                          type="checkbox"
                          value="151,199"
                        />
                        <label htmlFor="checkboxe-capacite-initiale-tranche-4">151-199</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-capacite-initiale-tranche-4"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-capacite-initiale-tranche-5"
                          id="checkboxe-capacite-initiale-tranche-5"
                          name="checkboxe-capacite-initiale-tranche-5"
                          onChange={(e) => onchange(e.target.value, "non_classifie")}
                          type="checkbox"
                          value="<199"
                        />
                        <label htmlFor="checkboxe-capacite-initiale-tranche-5">200 et plus</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-capacite-initiale-tranche-5"></div>
                      </div>
                    </div>
                  </div>
                  <div id="etablissement-public-handicap" style={{ marginTop: "20px" }}>
                    <h6 style={{ margin: "0" }}>{wording.ETABLISSEMENT_PUBLIC_HANDICAP}</h6>
                    <label className="fr-label" htmlFor="statut">
                      {wording.CAPACITE_INSTALLEE_EN_PLACE}
                    </label>
                    <button
                      className="fr-btn--tooltip fr-btn"
                      id="button-info-handicap"
                      name="tooltip-info-handicap"
                      onClick={() => {
                        setShowTooltip(!showToolip);
                      }}
                      type="button"
                    >
                      Info
                    </button>
                    <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-public-tranche-1"
                          id="checkboxe-etablissements-public-tranche-1"
                          name="checkboxe-etablissements-public-tranche-1"
                          onChange={(e) => onchange(e.target.value, "publics_en_situation_de_handicap")}
                          type="checkbox"
                          value=">31"
                        />
                        <label htmlFor="checkboxe-etablissements-public-tranche-1">1-30</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-public-tranche-1"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-public-tranche-2"
                          id="checkboxe-etablissements-public-tranche-2"
                          name="checkboxe-etablissements-public-tranche-2"
                          onChange={(e) => onchange(e.target.value, "publics_en_situation_de_handicap")}
                          type="checkbox"
                          value="31,50"
                        />
                        <label htmlFor="checkboxe-etablissements-public-tranche-2">31-50</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-public-tranche-2"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-public-tranche-3"
                          id="checkboxe-etablissements-public-tranche-3"
                          name="checkboxe-etablissements-public-tranche-3"
                          onChange={(e) => onchange(e.target.value, "publics_en_situation_de_handicap")}
                          type="checkbox"
                          value="51,100"
                        />
                        <label htmlFor="checkboxe-etablissements-public-tranche-3">51-100</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-public-tranche-3"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-public-tranche-4"
                          id="checkboxe-etablissements-public-tranche-4"
                          name="checkboxe-etablissements-public-tranche-4"
                          onChange={(e) => onchange(e.target.value, "publics_en_situation_de_handicap")}
                          type="checkbox"
                          value="<100"
                        />
                        <label htmlFor="checkboxe-etablissements-public-tranche-4">101 et plus</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-public-tranche-4"></div>
                      </div>
                    </div>
                  </div>
                  <div id="etablissement-personnes-agees" style={{ marginTop: "20px" }}>
                    <h6 style={{ margin: "0" }}>{wording.ETABLISSEMENT_PERSONNE_AGEES}</h6>
                    <label className="fr-label" htmlFor="statut">
                      {wording.CAPACITE_INSTALLEE_EN_PLACE}
                    </label>
                    <button
                      className="fr-btn--tooltip fr-btn"
                      id="button-info-agee"
                      name="tooltip-info-agee"
                      onClick={() => {
                        setShowTooltip2(!showToolip2);
                      }}
                      type="button"
                    >
                      Information contextuelle
                    </button>
                    <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-personnes-agees-tranche-1"
                          id="checkboxe-etablissements-personnes-agees-tranche-1"
                          name="checkboxe-etablissements-personnes-agees-tranche-1"
                          onChange={(e) => onchange(e.target.value, "personnes_agees")}
                          type="checkbox"
                          value=">45"
                        />
                        <label htmlFor="checkboxe-etablissements-personnes-agees-tranche-1">1-44</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-personnes-agees-tranche-1"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-personnes-agees-tranche-2"
                          id="checkboxe-etablissements-personnes-agees-tranche-2"
                          name="checkboxe-etablissements-personnes-agees-tranche-2"
                          onChange={(e) => onchange(e.target.value, "personnes_agees")}
                          type="checkbox"
                          value="45,80"
                        />
                        <label htmlFor="checkboxe-etablissements-personnes-agees-tranche-2">45-80</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-personnes-agees-tranche-2"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-personnes-agees-tranche-3"
                          id="checkboxe-etablissements-personnes-agees-tranche-3"
                          name="checkboxe-etablissements-personnes-agees-tranche-3"
                          onChange={(e) => onchange(e.target.value, "personnes_agees")}
                          type="checkbox"
                          value="81,120"
                        />
                        <label htmlFor="checkboxe-etablissements-personnes-agees-tranche-3">81-120</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-personnes-agees-tranche-3"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-personnes-agees-tranche-4"
                          id="checkboxe-etablissements-personnes-agees-tranche-4"
                          name="checkboxe-etablissements-personnes-agees-tranche-4"
                          onChange={(e) => onchange(e.target.value, "personnes_agees")}
                          type="checkbox"
                          value="121,199"
                        />
                        <label htmlFor="checkboxe-etablissements-personnes-agees-tranche-4">121-199</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-personnes-agees-tranche-4"></div>
                      </div>
                      <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                        <input
                          aria-describedby="checkboxe-etablissements-personnes-agees-tranche-5"
                          id="checkboxe-etablissements-personnes-agees-tranche-5"
                          name="checkboxe-etablissements-personnes-agees-tranche-5"
                          onChange={(e) => onchange(e.target.value, "personnes_agees")}
                          type="checkbox"
                          value="<200"
                        />
                        <label htmlFor="checkboxe-etablissements-personnes-agees-tranche-5">200 et plus</label>
                        <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-etablissements-personnes-agees-tranche-5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-modal__footer">
                <button
                  className={"fr-btn fr-btn--secondary " + styles["eraseButton"]}
                  disabled={capaciteMedicoSociaux.ranges.length === 0 && capaciteHandicap.ranges.length === 0 && capaciteAgees.ranges.length === 0}
                  onClick={effacerButton}
                >
                  Effacer
                </button>
                <button
                  aria-controls="fr-modal-Capacite-Filtre"
                  className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                  disabled={capaciteMedicoSociaux.ranges.length === 0 && capaciteHandicap.ranges.length === 0 && capaciteAgees.ranges.length === 0}
                  onClick={appliquerButton}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
