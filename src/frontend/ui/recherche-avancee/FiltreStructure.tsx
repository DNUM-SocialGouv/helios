import styles from "./RechercheAvanceeFormulaire.module.css";
import { WordingFr } from "../../configuration/wording/WordingFr";
import { Badge } from "../commun/Badge/Badge";
import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import LogoÉtablissementTerritorialMédicoSocial from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg";
import LogoÉtablissementTerritorialSanitaire from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg";
import LogoEntitéJuridiqueNoir from "../home/logo-entité-juridique-noir.svg";
import Image from "next/image";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { AttribuesDefaults } from "./model/Attribues";

export const FiltreStructure = () => {
  const wording = new WordingFr();
  const [typeSelected, setTypeSelected] = useState("");
  const [statutJuridiqueSelected, setStatutJuridiqueSelected] = useState<string[]>([]);
  const checkboxElementPublic = useRef<any>();
  const checkboxElementPriveL = useRef<any>();
  const checkboxElementPriveNL = useRef<any>();
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

  function onChangeType(i: any): any {
    setTypeSelected((prev) => (i === prev ? null : i));
  }

  function onChangeStatutJuridique(i: string, statut: string[], setStatut: Dispatch<SetStateAction<string[]>>): any {
    if (statut.length > 0 && statut.findIndex((a) => i === a) != -1) {
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
    if (typeSelected != AttribuesDefaults.entiteJuridque) {
      emptyStatutJuridiqueCheckboxs();
    }
    rechercheAvanceeContext?.setTypeStructure(typeSelected);
    rechercheAvanceeContext?.setStatutJuridiqueStructure(statutJuridiqueSelected);
  };

  return (
    <dialog aria-labelledby="fr-modal-Structure-Filtre-title" className="fr-modal" id="fr-modal-Structure-Filtre">
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__content fr-pt-5w">
                <div id="type">
                  <label className="fr-label">Type</label>
                  <div className="fr-mb-1w" style={{ marginTop: "10px" }}>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-ej"
                        id="checkboxe-ej"
                        name="checkboxe-ej"
                        type="checkbox"
                        value={AttribuesDefaults.entiteJuridque}
                        checked={typeSelected == AttribuesDefaults.entiteJuridque}
                        onChange={() => onChangeType(AttribuesDefaults.entiteJuridque)}
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
                        id="checkboxe-es"
                        name="checkboxe-es"
                        type="checkbox"
                        value={AttribuesDefaults.etablissementSanitaire}
                        checked={typeSelected == AttribuesDefaults.etablissementSanitaire}
                        onChange={() => onChangeType(AttribuesDefaults.etablissementSanitaire)}
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
                        id="checkboxe-esms"
                        name="checkboxe-esms"
                        type="checkbox"
                        value={AttribuesDefaults.etablissementMedicoSocial}
                        checked={typeSelected == AttribuesDefaults.etablissementMedicoSocial}
                        onChange={() => onChangeType(AttribuesDefaults.etablissementMedicoSocial)}
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
                  <label className="fr-label">Statut juridique</label>
                  <div className="fr-mb-1w" style={{ marginTop: "10px" }}>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-sj-public"
                        id="checkboxe-sj-public"
                        name="checkboxe-sj-public"
                        type="checkbox"
                        ref={checkboxElementPublic}
                        value={AttribuesDefaults.statutPublic}
                        onChange={(e) => onChangeStatutJuridique(e.target.value, statutJuridiqueSelected, setStatutJuridiqueSelected)}
                      />
                      <label htmlFor="checkboxe-sj-public">
                        <Badge label={wording.PUBLIC} className="" colour="purple-glycine"></Badge>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-sj-public"></div>
                    </div>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-sj-prive-lucratif"
                        id="checkboxe-sj-prive-lucratif"
                        name="checkboxe-sj-prive-lucratif"
                        type="checkbox"
                        ref={checkboxElementPriveL}
                        value={AttribuesDefaults.statutPriveLucratif}
                        onChange={(e) => onChangeStatutJuridique(e.target.value, statutJuridiqueSelected, setStatutJuridiqueSelected)}
                      />
                      <label htmlFor="checkboxe-sj-prive-lucratif">
                        <Badge label={wording.PRIVÉ_LUCRATIF} className="" colour="green-archipel"></Badge>
                      </label>
                      <div aria-live="assertive" className="fr-messages-group" id="checkboxe-message-sj-prive-lucratif"></div>
                    </div>
                    <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                      <input
                        aria-describedby="checkboxe-sj-prive-non-lucratif"
                        id="checkboxe-sj-prive-non-lucratif"
                        name="checkboxe-sj-prive-non-lucratif"
                        type="checkbox"
                        ref={checkboxElementPriveNL}
                        value={AttribuesDefaults.statutPriveNonLucratif}
                        onChange={(e) => onChangeStatutJuridique(e.target.value, statutJuridiqueSelected, setStatutJuridiqueSelected)}
                      />
                      <label htmlFor="checkboxe-sj-prive-non-lucratif">
                        <Badge label={wording.PRIVÉ_NON_LUCRATIF} className="" colour="blue-ecume"></Badge>
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
                  className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                  disabled={!typeSelected}
                  aria-controls="fr-modal-Structure-Filtre"
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
