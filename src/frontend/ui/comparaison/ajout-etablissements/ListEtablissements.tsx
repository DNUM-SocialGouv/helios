import { Dispatch, SetStateAction, useEffect } from "react";

import { LogoEntiteJuridiqueSvg } from "../../entité-juridique/bloc-activité/LogoEntitéJuridique";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { LogoEtablissementTerritorialMedicoSociauxSvg } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import { LogoEtablissementTerritorialSanitaireSvg as LogoÉtablissementTerritorialSanitaire } from "../../établissement-territorial-sanitaire/logo-établissement-territorial-sanitaire";
import styles from "../Comparaison.module.css";
import { checkFillSvg } from "../model/data";

type listEtablissementsProps = {
  resultatRechercheList?: RechercheViewModel[];
  setIsAtBottom: Dispatch<SetStateAction<boolean>>;
  newEtablissements: string[];
  setNewEtablissement: Dispatch<SetStateAction<string[]>>;
};

export const ListEtablissements = ({ resultatRechercheList, setIsAtBottom, newEtablissements, setNewEtablissement }: listEtablissementsProps) => {
  const codeColorOfDisabled = "#808080";
  const codeColorOfBlack = "#3a3a3a";
  const codeColorOfSelected = "#000091";

  const listFinessFromStorage = sessionStorage.getItem("listFinessNumbers");
  const finessNumbersListFromTable = listFinessFromStorage ? JSON.parse(listFinessFromStorage) : null;

  useEffect(() => {
    const scrollableDiv = document.getElementById("list-etablissements-container");

    if (scrollableDiv) {
      const handleScroll = () => {
        if (Math.floor(scrollableDiv.scrollHeight - scrollableDiv.scrollTop) === scrollableDiv.clientHeight) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      };
      scrollableDiv.addEventListener("scroll", handleScroll);

      return () => {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      };
    }
    return () => {};
  }, []);

  const onHandleSelectEtablissement = (numFiness: string) => {
    if (!finessNumbersListFromTable.includes(numFiness)) {
      setNewEtablissement((prevSelected) => {
        if (prevSelected.includes(numFiness)) {
          return prevSelected.filter((finess) => finess !== numFiness);
        } else {
          return [...prevSelected, numFiness];
        }
      });
    }
  };

  return (
    <div className={styles["list-etablissements-container"]} id="list-etablissements-container">
      {resultatRechercheList && (
        <ul className={styles["list-etablissements"]}>
          {resultatRechercheList.map((res) => (
            <li className={styles["etablissement-info"]} key={res.numéroFiness}>
              <div
                className={
                  finessNumbersListFromTable && finessNumbersListFromTable.includes(res.numéroFiness)
                    ? styles["disabled-container"]
                    : newEtablissements.includes(res.numéroFiness)
                    ? styles["selected-container"]
                    : ""
                }
                onClick={() => onHandleSelectEtablissement(res.numéroFiness)}
                onKeyDown={() => {}}
                role="button"
                style={{ display: "flex", marginTop: "5px", marginBottom: "5px" }}
                tabIndex={0}
              >
                <span className={styles["logo-center"]}>
                  {res.type === "Sanitaire" && (
                    <span className={styles["logo-container"]}>
                      {LogoÉtablissementTerritorialSanitaire(newEtablissements.includes(res.numéroFiness) ? codeColorOfSelected : codeColorOfBlack)}
                    </span>
                  )}
                  {res.type === "Médico-social" && (
                    <span className={styles["logo-container"]}>
                      {LogoEtablissementTerritorialMedicoSociauxSvg(newEtablissements.includes(res.numéroFiness) ? codeColorOfSelected : codeColorOfBlack)}
                    </span>
                  )}
                  {res.type === "Entité juridique" && (
                    <span className={styles["logo-container"]}>
                      {LogoEntiteJuridiqueSvg(newEtablissements.includes(res.numéroFiness) ? codeColorOfSelected : codeColorOfBlack)}
                    </span>
                  )}
                </span>
                <span className={styles["main-span"]}>
                  {res.numéroFiness} - {res.socialReason}
                  {(newEtablissements.includes(res.numéroFiness) || (finessNumbersListFromTable && finessNumbersListFromTable.includes(res.numéroFiness))) && (
                    <div className={styles["icon-check-fill"]}>
                      {checkFillSvg(newEtablissements.includes(res.numéroFiness) ? codeColorOfSelected : codeColorOfDisabled)}
                    </div>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!resultatRechercheList && <span>Aucun résultat trouvé.</span>}
    </div>
  );
};
