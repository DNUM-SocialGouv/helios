import { useSession } from "next-auth/react";
import { ChangeEvent, useContext, useState } from "react";

import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import styles from "./RechercheAvanceeFormulaire.module.css"

export const FiltreZoneGeographique = () => {
    const { data } = useSession();
    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
    const [zoneGeoValue, setZoneGeoValue] = useState("");

    const changeZoneGeoValue = (e: ChangeEvent<HTMLInputElement>) => {
        setZoneGeoValue(e.target.value);
    }

    const eraseZoneGeoValue = () => {
        setZoneGeoValue("");
    }

    const applyZoneGeoValue = () => {
        rechercheAvanceeContext?.setZoneGeo(zoneGeoValue);
    }

    return (
        <dialog aria-labelledby="fr-modal-Zone-Geographique-Filtre-title" className="fr-modal" id="fr-modal-Zone-Geographique-Filtre" >
            <div className="fr-container fr-container--fluid fr-container-md">
                <div className="fr-grid-row fr-grid-row--center">
                    <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                        <div className="fr-modal__body">
                            <div className="fr-modal__content fr-pt-5w">
                                <div className="fr-mb-1w">
                                    <label className="fr-label" htmlFor="text-input-text">Ville, commune ou département :</label>
                                    <input
                                        className="fr-input"
                                        id="text-input-text"
                                        name="text-input-text"
                                        onChange={changeZoneGeoValue}
                                        placeholder="Ville, commune ou département"
                                        type="text"
                                        value={zoneGeoValue}
                                    />
                                </div>
                                <p className={"fr-notice fr-notice--info " + styles["notice"]}>
                                    <span aria-hidden="true" className="fr-icon-info-fill"> </span>
                                    Votre région : {data?.user.institution.slice(4)}
                                </p>
                            </div>
                            <div className="fr-modal__footer">
                                <button
                                    className={"fr-btn fr-btn--secondary " + styles["eraseButton"]}
                                    disabled={zoneGeoValue === ""}
                                    onClick={eraseZoneGeoValue}
                                    style={zoneGeoValue === "" ? {} : { textDecoration: "underline" }}
                                >
                                    Effacer
                                </button>
                                <button
                                    aria-controls="fr-modal-Zone-Geographique-Filtre"
                                    className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                                    disabled={zoneGeoValue === ""}
                                    onClick={applyZoneGeoValue}
                                >
                                    Appliquer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}