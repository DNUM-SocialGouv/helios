import Image from "next/image";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";

import { WordingFr } from "../../configuration/wording/WordingFr";
import { Badge } from "../commun/Badge/Badge";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import LogoÉtablissementTerritorialMédicoSocial from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg";
import LogoÉtablissementTerritorialSanitaire from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg";
import LogoEntitéJuridiqueNoir from "../home/logo-entité-juridique-noir.svg";
import { AttribuesDefaults } from "./model/Attribues";
import styles from "./RechercheAvanceeFormulaire.module.css";

export const FiltreStructure = () => {
  const wording = new WordingFr();
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
  const [typeSelected, setTypeSelected] = useState(rechercheAvanceeContext?.typeStructure || "");
  const [statutJuridiqueSelected, setStatutJuridiqueSelected] = useState<string[]>(rechercheAvanceeContext?.statutJuridiqueStructure || []);
  const checkboxElementPublic = useRef<any>();
  const checkboxElementPriveL = useRef<any>();
  const checkboxElementPriveNL = useRef<any>();

  useEffect(() => {
    if (rechercheAvanceeContext?.capaciteSMS.length && rechercheAvanceeContext?.capaciteSMS.length > 0) {
      setTypeSelected(AttribuesDefaults.etablissementMedicoSocial);
      rechercheAvanceeContext.setTypeStructure(AttribuesDefaults.etablissementMedicoSocial);
    }
  }, [rechercheAvanceeContext?.capaciteSMS]);

  function onChangeType(i: any): any {
    setTypeSelected((prev) => (i === prev ? null : i));
  }

  function onChangeStatutJuridique(i: string, statut: string[], setStatut: Dispatch<SetStateAction<string[]>>): any {
    if (statut.length > 0 && statut.findIndex((a) => i === a) !== -1) {
      statut.splice(
        statut.findIndex((a) => i === a),
        1
      );
      setStatut([...statut]);
    } else {
      setStatut([...statut, i]);
    }
  }

  const effacerButton = () => {
    setTypeSelected("");
    emptyStatutJuridiqueCheckboxs();
    rechercheAvanceeContext?.setTypeStructure("");
    rechercheAvanceeContext?.setStatutJuridiqueStructure([]);
  };

  function emptyStatutJuridiqueCheckboxs() {
    setStatutJuridiqueSelected([]);
    if (checkboxElementPublic && checkboxElementPriveL && checkboxElementPriveNL) {
      checkboxElementPublic.current.checked = false;
      checkboxElementPriveL.current.checked = false;
      checkboxElementPriveNL.current.checked = false;
    }
  }

  const appliquerButton = () => {
    if (typeSelected !== AttribuesDefaults.entiteJuridque) {
      emptyStatutJuridiqueCheckboxs();
    }
    rechercheAvanceeContext?.setTypeStructure(typeSelected);
    rechercheAvanceeContext?.setStatutJuridiqueStructure(statutJuridiqueSelected);
    if (
      typeSelected !== AttribuesDefaults.etablissementMedicoSocial &&
      rechercheAvanceeContext?.capaciteSMS &&
      rechercheAvanceeContext?.capaciteSMS.length > 0
    ) {
      rechercheAvanceeContext?.setCapaciteSMS([]);
    }
  };

  return (
    <dialog aria-labelledby="fr-modal-Structure-Filtre-title" className="fr-modal" id="fr-modal-Structure-Filtre">
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__content fr-pt-5w">
                <div id="type">
                  <label className="fr-label" htmlFor="type">
                    Type
                  </label>
                  <div className="fr-mb-1w" id="type" style={{ marginTop: "10px" }}>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-ej"
                        checked={typeSelected === AttribuesDefaults.entiteJuridque}
                        id="checkboxe-ej"
                        name="checkboxe-ej"
                        onChange={() => onChangeType(AttribuesDefaults.entiteJuridque)}
                        type="checkbox"
                        value={AttribuesDefaults.entiteJuridque}
                      />
                      <label className="fr-label" htmlFor="checkboxe-ej">
                        <Image alt="" height="22" src={LogoEntitéJuridiqueNoir} width="22" />
                        <span style={{ marginLeft: "8px" }}>{wording.ENTITES_JURIDIQUES}</span>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-ej"></div>
                    </div>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-es"
                        checked={typeSelected === AttribuesDefaults.etablissementSanitaire}
                        id="checkboxe-es"
                        name="checkboxe-es"
                        onChange={() => onChangeType(AttribuesDefaults.etablissementSanitaire)}
                        type="checkbox"
                        value={AttribuesDefaults.etablissementSanitaire}
                      />
                      <label className="fr-label" htmlFor="checkboxe-es">
                        <Image alt="" height="22" src={LogoÉtablissementTerritorialSanitaire} width="22" />
                        <span style={{ marginLeft: "8px" }}>{wording.ETABLISSEMENTS_SANITAIRES}</span>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-es"></div>
                    </div>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-esms"
                        checked={typeSelected === AttribuesDefaults.etablissementMedicoSocial}
                        id="checkboxe-esms"
                        name="checkboxe-esms"
                        onChange={() => onChangeType(AttribuesDefaults.etablissementMedicoSocial)}
                        type="checkbox"
                        value={AttribuesDefaults.etablissementMedicoSocial}
                      />
                      <label className="fr-label" htmlFor="checkboxe-esms">
                        <Image alt="" height="22" src={LogoÉtablissementTerritorialMédicoSocial} width="22" />
                        <span style={{ marginLeft: "8px" }}>{wording.ETABLISSEMENTS_SOCIAUX_MEDICO_SOCIAUX}</span>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-esms"></div>
                    </div>
                  </div>
                </div>
                <div id="statut-juridique" style={{ display: typeSelected === AttribuesDefaults.entiteJuridque ? "unset" : "none" }}>
                  <label className="fr-label" htmlFor="statut">
                    Statut juridique
                  </label>
                  <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-sj-public"
                        id="checkboxe-sj-public"
                        name="checkboxe-sj-public"
                        onChange={(e) => onChangeStatutJuridique(e.target.value, statutJuridiqueSelected, setStatutJuridiqueSelected)}
                        ref={checkboxElementPublic}
                        type="checkbox"
                        value={AttribuesDefaults.statutPublic}
                      />
                      <label htmlFor="checkboxe-sj-public">
                        <Badge className="" colour="purple-glycine" label={wording.PUBLIC}></Badge>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-sj-public"></div>
                    </div>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-sj-prive-lucratif"
                        id="checkboxe-sj-prive-lucratif"
                        name="checkboxe-sj-prive-lucratif"
                        onChange={(e) => onChangeStatutJuridique(e.target.value, statutJuridiqueSelected, setStatutJuridiqueSelected)}
                        ref={checkboxElementPriveL}
                        type="checkbox"
                        value={AttribuesDefaults.statutPriveLucratif}
                      />
                      <label htmlFor="checkboxe-sj-prive-lucratif">
                        <Badge className="" colour="green-archipel" label={wording.PRIVÉ_LUCRATIF}></Badge>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-sj-prive-lucratif"></div>
                    </div>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-sj-prive-non-lucratif"
                        id="checkboxe-sj-prive-non-lucratif"
                        name="checkboxe-sj-prive-non-lucratif"
                        onChange={(e) => onChangeStatutJuridique(e.target.value, statutJuridiqueSelected, setStatutJuridiqueSelected)}
                        ref={checkboxElementPriveNL}
                        type="checkbox"
                        value={AttribuesDefaults.statutPriveNonLucratif}
                      />
                      <label htmlFor="checkboxe-sj-prive-non-lucratif">
                        <Badge className="" colour="blue-ecume" label={wording.PRIVÉ_NON_LUCRATIF}></Badge>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-sj-prive-non-lucratif"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fr-modal__footer">
                <button className={"fr-btn fr-btn--secondary " + styles["eraseButton"]} disabled={!typeSelected} onClick={effacerButton}>
                  Effacer
                </button>
                <button
                  aria-controls="fr-modal-Structure-Filtre"
                  className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                  disabled={!typeSelected}
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
