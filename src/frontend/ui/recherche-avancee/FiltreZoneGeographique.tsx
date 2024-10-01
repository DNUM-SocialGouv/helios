import { useSession } from "next-auth/react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import styles from "./RechercheAvanceeFormulaire.module.css"

export const FiltreZoneGeographique = () => {
    const { data } = useSession();
    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);
    const [zoneGeoValue, setZoneGeoValue] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zoneGeoSelected, setZoneGeoSelected] = useState("");


    // Debounce function to control the rate of API calls
    const debounce = (func: any, delay: number) => {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const fetchSuggestions = async (searchQuery: string) => {
        if (!searchQuery) return;
        setIsLoading(true);
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${searchQuery}&type=municipality&limit=50`);
            const responseData = await response.json();
            const maRegion = data?.user.institution.slice(4);
            const sortedOptions = (data?.user.role === 3 || data?.user.role === 2) ? [...responseData.features].sort((a, b) => {
                const estMaRegionA = a.properties.context.split(',')[2].trim() === maRegion;
                const estMaRegionB = b.properties.context.split(',')[2].trim() === maRegion;
                if (estMaRegionA === estMaRegionB) return 0;
                return estMaRegionA ? -1 : 1;
            }) : responseData.features;
            setSuggestions(sortedOptions);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced version of fetchSuggestions
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    useEffect(() => {
        if (zoneGeoValue.length > 2 && zoneGeoSelected !== zoneGeoValue) {
            debouncedFetchSuggestions(zoneGeoValue);
        } else {
            setSuggestions([]);
        }
    }, [zoneGeoValue]);


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
                                {isLoading && <div>Loading...</div>}
                                {suggestions.length > 0 && (
                                    <ul className={styles["autocompleteList"]}>
                                        {suggestions.map((item, index) => (
                                            <li
                                                className={styles["autocompleteListItem"]}
                                                key={index}
                                            >
                                                <button className={styles["autocompleteListItemButton"]}
                                                    onClick={() => {
                                                        setSuggestions([]);
                                                        setZoneGeoValue(item.properties.label);
                                                        setZoneGeoSelected(item.properties.label);
                                                    }}>
                                                    {item.properties.label} ({item.properties.postcode})
                                                </button>

                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {(data?.user.role === 3 || data?.user.role === 2) && <p className={"fr-notice fr-notice--info " + styles["notice"]}>
                                    <span aria-hidden="true" className="fr-icon-info-fill"> </span>
                                    Votre région : {data?.user.institution.slice(4)}
                                </p>}
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