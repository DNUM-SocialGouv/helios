import { useSession } from "next-auth/react";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState, useRef, KeyboardEvent } from "react";

import styles from "./RechercheAvanceeFormulaire.module.css";
import { ComparaisonContext } from "../commun/contexts/ComparaisonContext";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";

type ZoneGeo = Readonly<{
  type: string;
  nom: string;
  departement: {
    code: string;
    nom: string;
  },
  code: string;
  codeRegion: string;
  codesPostaux: string[];
  codeNum: string;
}>;

type FiltresForComparaisonProps = Readonly<{
  isComparaison: boolean;
  setIsChanged: Dispatch<SetStateAction<boolean>> | undefined;
  zoneGeoValue: string;
  setZoneGeoValue: Dispatch<SetStateAction<string>>;
  zoneGeoType: string;
  setZoneGeoType: Dispatch<SetStateAction<string>>
}>;

export const FiltreZoneGeographique = ({ isComparaison, setIsChanged, zoneGeoValue, setZoneGeoValue, zoneGeoType, setZoneGeoType }: FiltresForComparaisonProps) => {
  const { data } = useSession();
  const rechercheAvanceeContext = useContext(isComparaison ? ComparaisonContext : RechercheAvanceeContext);
  const [suggestions, setSuggestions] = useState<ZoneGeo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [zoneGeoSelected, setZoneGeoSelected] = useState<ZoneGeo>({
    type: "",
    nom: "",
    departement: {
      code: "",
      nom: "",
    },
    code: "",
    codeRegion: "",
    codesPostaux: [],
    codeNum: "",
  });

  const requestCounterRef = useRef(0);

  // Debounce function to control the rate of API calls
  const debounce = (func: any, delay: number) => {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (searchQuery: string, requestId: number) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const searchParamDepartement = +searchQuery ? `code=${searchQuery}` : `nom=${searchQuery}`;
      const searchParamCommune = +searchQuery ? `codePostal=${searchQuery}` : `nom=${searchQuery}`;

      const [responseRegion, responseDepartement, responseCommune] = await Promise.all([
        fetch(`https://geo.api.gouv.fr/regions?fields=nom&nom=${searchQuery}`)
          .then((res) => res.json())
          .then((data) => data.map((elt: any) => {
            return { ...elt, type: "R", codeRegion: elt.code, codeNum: "" };
          })),
        fetch(`https://geo.api.gouv.fr/departements?fields=code,codeRegion&format=json&zone=metro,drom,com&${searchParamDepartement}`)
          .then((res) => res.json())
          .then((data) => data.map((elt: any) => {
            return { ...elt, type: "D", codeNum: elt.code };
          })),
        fetch(
          `https://geo.api.gouv.fr/communes?fields=codesPostaux,codeRegion,departement&format=json&type=arrondissement-municipal,commune-actuelle&${searchParamCommune}`
        )
          .then((res) => res.json())
          .then((data) => data.map((elt: any) => {
            // Afficher toute la ville pour les villes avec arrondissements: Paris, Marseille et Lyon
            if (elt.nom === "Marseille" || elt.nom === "Paris" || elt.nom === "Lyon") {
              elt.codeNum = "tous les arrondissements";
            } else if (elt.codesPostaux.length > 0) {
              elt.codeNum = elt.codesPostaux[0];
            }
            return { ...elt, type: "C" };
          }))]);
      const responseData = responseRegion.concat(responseDepartement.concat(responseCommune));

      if (requestId === requestCounterRef.current && zoneGeoValue !== '') {
        // Separate the items that match the search value and the ones that don't
        const matchingItems = responseData.filter((item: any) => item.nom.toLowerCase().startsWith(searchQuery.toLowerCase()));
        const nonMatchingItems = responseData.filter((item: any) => !item.nom.toLowerCase().startsWith(searchQuery.toLowerCase()));

        //Adds padding to numbers to handle them correctly in comparison
        const normalize = (str: string) => str.toLowerCase().replace(/(\d+)/g, (match) => match.padStart(2, "0"));

        // Sort both lists alphabetically by 'nom'
        const sortedMatchingItems = matchingItems.sort((a: any, b: any) => {
          return normalize(a.nom).localeCompare(normalize(b.nom));
        });

        const sortedNonMatchingItems = nonMatchingItems.sort((a: any, b: any) => {
          return normalize(a.nom).localeCompare(normalize(b.nom));
        });

        const sortedAlphabetically = [...sortedMatchingItems, ...sortedNonMatchingItems];

        const maRegion = data?.user.codeRegion;
        const sortedOptions =
          data?.user.role === 3 || data?.user.role === 2
            ? sortedAlphabetically.toSorted((a: any, b: any) => {
              const estMaRegionA = a.codeRegion === maRegion;
              const estMaRegionB = b.codeRegion === maRegion;
              if (estMaRegionA === estMaRegionB) return 0;
              return estMaRegionA ? -1 : 1;
            })
            : sortedAlphabetically;

        setSuggestions(sortedOptions);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce((searchQuery: string) => {
    const requestId = ++requestCounterRef.current; // Increment the request counter
    fetchSuggestions(searchQuery, requestId);
  }, 300);

  useEffect(() => {
    if (zoneGeoSelected?.nom !== zoneGeoValue) {
      debouncedFetchSuggestions(zoneGeoValue);
    } else {
      setSuggestions([]);
    }
    return () => { };
  }, [zoneGeoValue]);

  const changeZoneGeoValue = (e: ChangeEvent<HTMLInputElement>) => {
    setZoneGeoValue(e.target.value);
  };

  const eraseZoneGeoValue = () => {
    setZoneGeoValue("");
    rechercheAvanceeContext?.setZoneGeo("");
    setZoneGeoType("");
    rechercheAvanceeContext?.setZoneGeoType("");
    setSuggestions([]);
    rechercheAvanceeContext?.setZoneGeoLabel("");
    setZoneGeoSelected({
      type: "",
      nom: "",
      departement: {
        code: "",
        nom: "",
      },
      code: "",
      codeRegion: "",
      codesPostaux: [],
      codeNum: "",
    });

    if (setIsChanged) setIsChanged(true);
  };

  const applyZoneGeoValue = () => {
    rechercheAvanceeContext?.setZoneGeoD(zoneGeoType === "C" ? zoneGeoSelected?.departement.nom : "");
    rechercheAvanceeContext?.setZoneGeo(zoneGeoType === "R" ? zoneGeoSelected?.codeRegion : zoneGeoValue);
    rechercheAvanceeContext?.setZoneGeoType(zoneGeoType);
    rechercheAvanceeContext?.setZoneGeoLabel(zoneGeoSelected.codeNum ? `${zoneGeoSelected.nom} (${zoneGeoSelected.codeNum})` : zoneGeoSelected.nom);
    if (setIsChanged) setIsChanged(true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("zoneGeo-appliquer-botton")?.click();
    }
  }

  return (
    <dialog aria-labelledby="fr-modal-Zone-Geographique-Filtre-title" className="fr-modal" id="fr-modal-Zone-Geographique-Filtre">
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__content fr-pt-5w">
                <div className="fr-mb-1w">
                  <label className="fr-label" htmlFor="text-input-text">
                    Ville, département ou région :
                  </label>
                  <input
                    className="fr-input  fr-mt-1w"
                    id="text-input-text"
                    name="text-input-text"
                    onChange={changeZoneGeoValue}
                    onKeyDown={(event) => onKeyDown(event)}
                    placeholder="Ville, département ou région"
                    type="text"
                    value={zoneGeoValue}
                  />
                </div>
                {isLoading && <div>Loading...</div>}
                {suggestions?.length > 0 && (
                  <ul className={styles["autocompleteList"]}>
                    {suggestions.map((item) => (
                      <li className={styles["autocompleteListItem"]} key={item.codeNum ? `${item.nom} (${item.codeNum})` : item.nom}>
                        <button
                          className={styles["autocompleteListItemButton"]}
                          onClick={() => {
                            setSuggestions([]);
                            setZoneGeoType(item.type);
                            setZoneGeoValue(item.nom);
                            setZoneGeoSelected(item);
                          }}
                        >
                          {item.codeNum ? `${item.nom} (${item.codeNum})` : item.nom}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {(data?.user.role === 3 || data?.user.role === 2) && (
                  <p className={"fr-notice fr-notice--info " + styles["notice"]}>
                    <span aria-hidden="true" className="fr-icon-info-fill">
                      {" "}
                    </span>
                    Votre région : {data?.user.institution.slice(4)}
                  </p>
                )}
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
                  id="zoneGeo-appliquer-botton"
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
  );
};
