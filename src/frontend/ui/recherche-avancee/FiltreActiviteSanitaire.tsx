import { Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useState } from "react";

import { ActiviteSanitaire } from "./model/ActiviteSanitaire";
import { classificationActiviteTypes } from "./model/ClassificationTypes";
import styles from "./RechercheAvanceeFormulaire.module.css";
import { WordingFr } from "../../configuration/wording/WordingFr";
import { ComparaisonContext } from "../commun/contexts/ComparaisonContext";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import "@gouvfr/dsfr/dist/component/tooltip/tooltip.css";

type FiltresForComparaisonProps = Readonly<{
    isComparaison: boolean;
    setIsChanged: Dispatch<SetStateAction<boolean>> | undefined;
}>;

export const FiltreActiviteSanitaire = ({ isComparaison, setIsChanged }: FiltresForComparaisonProps) => {
    const wording = new WordingFr();
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const rechercheAvanceeContext = useContext(isComparaison ? ComparaisonContext : RechercheAvanceeContext);
    const [activiteMco, setActiviteMco] = useState<ActiviteSanitaire>(
        new ActiviteSanitaire("mco", rechercheAvanceeContext?.activiteMco || [])
    );
    const [activitePsy, setActivitePsy] = useState<ActiviteSanitaire>(
        new ActiviteSanitaire("psy", rechercheAvanceeContext?.activitePsy || [])
    );
    const [activiteSsr, setActiviteSsr] = useState<ActiviteSanitaire>(
        new ActiviteSanitaire("ssr", rechercheAvanceeContext?.activiteSsr || [])
    );
    const [activiteUsld, setActiviteUsld] = useState<ActiviteSanitaire>(
        new ActiviteSanitaire("usld", rechercheAvanceeContext?.activiteUsld || [])
    );
    const contenuInfoBulle = (
        <>
            <span>
                Le nombre de séjours annuel MCO, PSY et SSR correspondent à la somme des hospitalisations partielle et complète de la dernière année complète disponible.
                <br />
                <br />
                Source: PMSI, SAE
                <br />
                <br />
                Les établissements appartenant au champ sanitaire regroupent ces catégories d&apos;établissements :
            </span>
            <br />
            <br />
            <span>
                <ul>
                    <li>Appartement Thérapeutique (cat FINESS 412)</li>
                    <li>Autre établissement loi hospitalière (cat FINESS 698)</li>
                    <li>C.H. (ex H.L.) - Centre hospitalier, ex Hôpital local (cat FINESS 106)</li>
                    <li>C.H.R - Centre Hospitalier Régional (cat FINESS 101)</li>
                    <li>CATTP - Centre d&apos;Accueil Thérapeutique à temps partiel (cat FINESS 425)</li>
                    <li>Centre Crise Accueil Permanent (cat FINESS 444)</li>
                    <li>Centre de dialyse (cat FINESS 141)</li>
                    <li>Centre de lutte contre le cancer (cat FINESS 131)</li>
                    <li>Centre hospitalier (cat FINESS 355)</li>
                    <li>Centre Hospitalier Spécialisé lutte Maladies Mentales (cat FINESS 292)</li>
                    <li>Centre Postcure Malades Mentaux (cat FINESS 430)</li>
                    <li>CMP - Centre Médico-Psychologique (cat FINESS 156)</li>
                    <li>Entité ayant autorisation (cat FINESS 699)</li>
                    <li>Établissement de santé privé autorisé en SSR (cat FINESS 109)</li>
                    <li>Établissement de soins chirugicaux (cat FINESS 128)</li>
                    <li>Établissement de Soins Longue Durée (cat FINESS 362)</li>
                    <li>Établissement de Soins Médicaux (cat FINESS 129)</li>
                    <li>Établissement Sanitaire des Prisons (cat FINESS 433)</li>
                    <li>Établissement Soins Obstétriques Chirurgico-Gynécologiques (cat FINESS 122)</li>
                    <li>Établissements de soins pluridisciplinaire (cat FINESS 365)</li>
                    <li>GCS Exploitant - Groupement de coopération sanitaire de moyens- Exploitant (cat FINESS 695)</li>
                    <li>GCS-ES - Groupement de coopération sanitaire- Établissement de santé (cat FINESS 697)</li>
                    <li>GCS-Moyens - Groupement de coopération sanitaire de moyens (cat FINESS 696)</li>
                    <li>Hôpital des armées (cat FINESS 114)</li>
                    <li>Hospitalisation à Domicile (cat FINESS 127)</li>
                    <li>Maison de Santé pour Maladies Mentales (cat FINESS 161)</li>
                    <li>Structure d&apos;Alternative à la dialyse en centre (cat FINESS 146)”</li>
                </ul>
            </span>
        </>
    );

    const onchange = (value: string, activite: string) => {
        if (classificationActiviteTypes.activite_mco.classification === activite) {
            onChangeCheck(value, activiteMco?.ranges, setActiviteMco, classificationActiviteTypes.activite_mco.classification);
        }
        if (classificationActiviteTypes.activite_psy.classification === activite) {
            onChangeCheck(value, activitePsy?.ranges, setActivitePsy, classificationActiviteTypes.activite_psy.classification);
        }
        if (classificationActiviteTypes.activite_ssr.classification === activite) {
            onChangeCheck(value, activiteSsr?.ranges, setActiviteSsr, classificationActiviteTypes.activite_ssr.classification);
        }
        if (classificationActiviteTypes.activite_usld.classification === activite) {
            onChangeCheck(value, activiteUsld?.ranges, setActiviteUsld, classificationActiviteTypes.activite_usld.classification);
        }
    };

    useEffect(() => {
        if (
            rechercheAvanceeContext?.activiteMco.length === 0 &&
            rechercheAvanceeContext?.activitePsy.length === 0 &&
            rechercheAvanceeContext?.activiteSsr.length === 0 &&
            rechercheAvanceeContext?.activiteUsld.length === 0
        ) {
            setActiviteMco(new ActiviteSanitaire("mco", []));
            setActivitePsy(new ActiviteSanitaire("psy", []));
            setActiviteSsr(new ActiviteSanitaire("ssr", []));
            setActiviteUsld(new ActiviteSanitaire("usld", []));
        }
    }, [rechercheAvanceeContext?.activiteMco, rechercheAvanceeContext?.activitePsy, rechercheAvanceeContext?.activiteSsr, rechercheAvanceeContext?.activiteUsld]);

    function onChangeCheck(i: string, statut: string[], setStatut: Dispatch<SetStateAction<ActiviteSanitaire>>, clasification: string): any {
        if (statut.length > 0 && statut.findIndex((a) => i === a) !== -1) {
            statut.splice(
                statut.findIndex((a) => i === a),
                1
            );
            setStatut(new ActiviteSanitaire(clasification, [...statut]));
        } else {
            setStatut(new ActiviteSanitaire(clasification, [...statut, i]));
        }
    }

    const appliquerButton = () => {
        if (rechercheAvanceeContext) {
            rechercheAvanceeContext?.setActiviteMco(activiteMco.ranges);
            rechercheAvanceeContext?.setActivitePsy(activitePsy.ranges);
            rechercheAvanceeContext?.setActiviteSsr(activiteSsr.ranges);
            rechercheAvanceeContext?.setActiviteUsld(activiteUsld.ranges);
            if (setIsChanged) setIsChanged(true);
        }
    };

    const effacerButton = () => {
        setActiviteMco(new ActiviteSanitaire("", []));
        setActivitePsy(new ActiviteSanitaire("", []));
        setActiviteSsr(new ActiviteSanitaire("", []));
        setActiviteUsld(new ActiviteSanitaire("", []));
        rechercheAvanceeContext?.setActiviteMco([]);
        rechercheAvanceeContext?.setActivitePsy([]);
        rechercheAvanceeContext?.setActiviteSsr([]);
        rechercheAvanceeContext?.setActiviteUsld([]);
        if (setIsChanged) setIsChanged(true);
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("activite-san-appliquer-botton")?.click();
        }
    }

    return (
        <dialog aria-labelledby="fr-modal-activite-Filtre-title" className="fr-modal" id="fr-modal-activite-Filtre">
            <div className="fr-container fr-container--fluid fr-container-md">
                <div className="fr-grid-row fr-grid-row--center">
                    <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                        <div className="fr-modal__body" style={{ display: showTooltip ? "block" : "none" }}>
                            <div className={`${styles["sticky"]} fr-modal__header`}>
                                <button
                                    aria-controls="titre-info-bulle-etablissement"
                                    className="fr-btn--close fr-btn"
                                    onClick={() => {
                                        setShowTooltip(false);
                                    }}
                                    title="Fermer la fenêtre modale"
                                    type="button"
                                >
                                    {wording.FERMER}
                                </button>
                            </div>
                            <div className="fr-modal__content">
                                {contenuInfoBulle}
                            </div>
                        </div>
                        <div className="fr-modal__body" style={{ display: showTooltip ? "none" : "block", height: isComparaison ? "547px" : "100%" }}>
                            <div className="fr-modal__content fr-pt-5w" id="activite-container">
                                <div>
                                    <div style={{ display: "flex" }}>
                                        <h6 style={{ margin: "0" }}>{wording.ETABLISSEMENTS_SANITAIRES}</h6>
                                        <button
                                            className={"fr-fi-information-line " + styles["info-container-bulle"]}
                                            id="button-info-agee"
                                            name="tooltip-info-agee"
                                            onClick={() => {
                                                setShowTooltip(!showTooltip);
                                            }}
                                            title=" "
                                            type="button"
                                        ></button>
                                    </div>
                                    <div id="etablissement-MCO">
                                        <div>
                                            <h6 style={{ margin: "0" }}>{wording.FA_MCO}</h6>
                                        </div>
                                        <label className="fr-label" htmlFor="statut">
                                            {wording.FA_SEJOURS_ANN}
                                        </label>
                                        <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-mco-tranche-1"
                                                    checked={activiteMco.ranges.includes("0,14000")}
                                                    id="checkboxe-activite-mco-tranche-1"
                                                    name="checkboxe-activite-mco-tranche-1"
                                                    onChange={(e) => onchange(e.target.value, "mco")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="0,14000"
                                                />
                                                <label htmlFor="checkboxe-activite-mco-tranche-1">0 - 14 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="ccheckboxe-activite-mco-tranche-2"
                                                    checked={activiteMco.ranges.includes("14001,24000")}
                                                    id="checkboxe-activite-mco-tranche-2"
                                                    name="checkboxe-activite-mco-tranche-2"
                                                    onChange={(e) => onchange(e.target.value, "mco")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="14001,24000"
                                                />
                                                <label htmlFor="checkboxe-activite-mco-tranche-2">14 001 - 24 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-mco-tranche-3"
                                                    checked={activiteMco.ranges.includes("24001,36000")}
                                                    id="checkboxe-activite-mco-tranche-3"
                                                    name="checkboxe-activite-mco-tranche-3"
                                                    onChange={(e) => onchange(e.target.value, "mco")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="24001,36000"
                                                />
                                                <label htmlFor="checkboxe-activite-mco-tranche-3">24 001 - 36 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-mco-tranche-4"
                                                    checked={activiteMco.ranges.includes("36001,65000")}
                                                    id="checkboxe-activite-mco-tranche-4"
                                                    name="checkboxe-activite-mco-tranche-4"
                                                    onChange={(e) => onchange(e.target.value, "mco")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="36001,65000"
                                                />
                                                <label htmlFor="checkboxe-activite-mco-tranche-4">36 001 - 65 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-mco-tranche-5"
                                                    checked={activiteMco.ranges.includes(">65000")}
                                                    id="checkboxe-activite-mco-tranche-5"
                                                    name="checkboxe-activite-mco-tranche-5"
                                                    onChange={(e) => onchange(e.target.value, "mco")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value=">65000"
                                                />
                                                <label htmlFor="checkboxe-activite-mco-tranche-5">65 001 et plus</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="PSY" style={{ marginTop: "20px" }}>
                                        <h6 style={{ margin: "0" }}>{wording.FA_PSY}</h6>
                                        <label className={"fr-label " + styles["label-capacite"]} htmlFor="statut">
                                            {wording.FA_JOURS_ANN}
                                        </label>
                                        <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-psy-tranche-1"
                                                    checked={activitePsy.ranges.includes("0,30000")}
                                                    id="checkboxe-activite-psy-tranche-1"
                                                    name="checkboxe-activite-psy-tranche-1"
                                                    onChange={(e) => onchange(e.target.value, "psy")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="0,30000"
                                                />
                                                <label htmlFor="checkboxe-activite-psy-tranche-1">0 - 30 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-psy-tranche-2"
                                                    checked={activitePsy.ranges.includes("30001,50000")}
                                                    id="checkboxe-activite-psy-tranche-2"
                                                    name="checkboxe-activite-psy-tranche-2"
                                                    onChange={(e) => onchange(e.target.value, "psy")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="30001,50000"
                                                />
                                                <label htmlFor="checkboxe-activite-psy-tranche-2">30 001 - 50 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-psy-tranche-3"
                                                    checked={activitePsy.ranges.includes("50001,80000")}
                                                    id="checkboxe-activite-psy-tranche-3"
                                                    name="checkboxe-activite-psy-tranche-3"
                                                    onChange={(e) => onchange(e.target.value, "psy")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="50001,80000"
                                                />
                                                <label htmlFor="checkboxe-activite-psy-tranche-3">50 001 - 80 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-psy-tranche-4"
                                                    checked={activitePsy.ranges.includes("80001,120000")}
                                                    id="checkboxe-activite-psy-tranche-4"
                                                    name="checkboxe-activite-psy-tranche-4"
                                                    onChange={(e) => onchange(e.target.value, "psy")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="80001,120000"
                                                />
                                                <label htmlFor="checkboxe-activite-psy-tranche-4">80 001 - 120 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-psy-tranche-5"
                                                    checked={activitePsy.ranges.includes(">120000")}
                                                    id="checkboxe-activite-psy-tranche-5"
                                                    name="checkboxe-activite-psy-tranche-5"
                                                    onChange={(e) => onchange(e.target.value, "psy")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value=">120000"
                                                />
                                                <label htmlFor="checkboxe-activite-psy-tranche-5">120 001 et plus</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="SSR" style={{ marginTop: "20px" }}>
                                        <h6 style={{ margin: "0" }}>{wording.FA_SSR}</h6>
                                        <label className={"fr-label " + styles["label-capacite"]} htmlFor="statut">
                                            {wording.FA_JOURS_ANN}
                                        </label>
                                        <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-ssr-tranche-1"
                                                    checked={activiteSsr.ranges.includes("0,16000")}
                                                    id="checkboxe-activite-ssr-tranche-1"
                                                    name="checkboxe-activite-ssr-tranche-1"
                                                    onChange={(e) => onchange(e.target.value, "ssr")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="0,16000"
                                                />
                                                <label htmlFor="checkboxe-activite-ssr-tranche-1">0 - 16 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-ssr-tranche-2"
                                                    checked={activiteSsr.ranges.includes("16001,27000")}
                                                    id="checkboxe-activite-ssr-tranche-2"
                                                    name="checkboxe-activite-ssr-tranche-2"
                                                    onChange={(e) => onchange(e.target.value, "ssr")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="16001,27000"
                                                />
                                                <label htmlFor="checkboxe-activite-ssr-tranche-2">16 001 - 27 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-ssr-tranche-3"
                                                    checked={activiteSsr.ranges.includes("27001,37000")}
                                                    id="checkboxe-activite-ssr-tranche-3"
                                                    name="checkboxe-activite-ssr-tranche-3"
                                                    onChange={(e) => onchange(e.target.value, "ssr")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="27001,37000"
                                                />
                                                <label htmlFor="checkboxe-activite-ssr-tranche-3">27 001 - 37 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-ssr-tranche-4"
                                                    checked={activiteSsr.ranges.includes("37001,57000")}
                                                    id="checkboxe-activite-ssr-tranche-4"
                                                    name="checkboxe-activite-ssr-tranche-4"
                                                    onChange={(e) => onchange(e.target.value, "ssr")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="37001,57000"
                                                />
                                                <label htmlFor="checkboxe-activite-ssr-tranche-4">37 001 - 57 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-ssr-tranche-5"
                                                    checked={activiteSsr.ranges.includes(">57000")}
                                                    id="checkboxe-activite-ssr-tranche-5"
                                                    name="checkboxe-activite-ssr-tranche-5"
                                                    onChange={(e) => onchange(e.target.value, "ssr")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value=">57000"
                                                />
                                                <label htmlFor="checkboxe-activite-ssr-tranche-5">57 001 et plus</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="USLD" style={{ marginTop: "20px" }}>
                                        <h6 style={{ margin: "0" }}>{wording.FA_USLD}</h6>
                                        <label className={"fr-label " + styles["label-capacite"]} htmlFor="statut">
                                            {wording.FA_JOURS_ANN}
                                        </label>
                                        <div className="fr-mb-1w" id="statut" style={{ marginTop: "10px" }}>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-usld-tranche-1"
                                                    checked={activiteUsld.ranges.includes("0,10000")}
                                                    id="checkboxe-activite-usld-tranche-1"
                                                    name="checkboxe-activite-usld-tranche-1"
                                                    onChange={(e) => onchange(e.target.value, "usld")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="0,10000"
                                                />
                                                <label htmlFor="checkboxe-activite-usld-tranche-1">0 - 10 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-usld-tranche-2"
                                                    checked={activiteUsld.ranges.includes("10001,16000")}
                                                    id="checkboxe-activite-usld-tranche-2"
                                                    name="checkboxe-activite-usld-tranche-2"
                                                    onChange={(e) => onchange(e.target.value, "usld")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="10001,16000"
                                                />
                                                <label htmlFor="checkboxe-activite-usld-tranche-2">10 001 - 16 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-usld-tranche-3"
                                                    checked={activiteUsld.ranges.includes("16001,23000")}
                                                    id="checkboxe-activite-usld-tranche-3"
                                                    name="checkboxe-activite-usld-tranche-3"
                                                    onChange={(e) => onchange(e.target.value, "usld")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="16001,23000"
                                                />
                                                <label htmlFor="checkboxe-activite-usld-tranche-3">16 001 - 23 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-usld-tranche-4"
                                                    checked={activiteUsld.ranges.includes("23001,33000")}
                                                    id="checkboxe-activite-usld-tranche-4"
                                                    name="checkboxe-activite-usld-tranche-4"
                                                    onChange={(e) => onchange(e.target.value, "usld")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value="23001,33000"
                                                />
                                                <label htmlFor="checkboxe-activite-usld-tranche-4">23 001 - 33 000</label>
                                            </div>
                                            <div className={`${styles["checkElement"]} fr-checkbox-group`}>
                                                <input
                                                    aria-describedby="checkboxe-activite-usld-tranche-5"
                                                    checked={activiteUsld.ranges.includes(">33000")}
                                                    id="checkboxe-activite-usld-tranche-5"
                                                    name="checkboxe-activite-usld-tranche-5"
                                                    onChange={(e) => onchange(e.target.value, "usld")}
                                                    onKeyDown={(event) => onKeyDown(event)}
                                                    type="checkbox"
                                                    value=">33000"
                                                />
                                                <label htmlFor="checkboxe-activite-usld-tranche-5">33 001 et plus</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="fr-modal__footer">
                                <button
                                    className={"fr-btn fr-btn--secondary " + styles["eraseButton"]}
                                    disabled={activiteMco.ranges.length === 0 && activitePsy.ranges.length === 0 && activiteSsr.ranges.length === 0 && activiteUsld.ranges.length === 0}
                                    onClick={effacerButton}
                                >
                                    Effacer
                                </button>
                                <button
                                    aria-controls="fr-modal-activite-Filtre"
                                    className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                                    disabled={activiteMco.ranges.length === 0 && activitePsy.ranges.length === 0 && activiteSsr.ranges.length === 0 && activiteUsld.ranges.length === 0}
                                    id="activite-san-appliquer-botton"
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
