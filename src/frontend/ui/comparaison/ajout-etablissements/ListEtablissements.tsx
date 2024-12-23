import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { LogoEntiteJuridiqueSvg } from "../../entité-juridique/bloc-activité/LogoEntitéJuridique";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { LogoEtablissementTerritorialMedicoSociauxSvg } from "../../établissement-territorial-médico-social/logo-établissement-territorial-médico-social";
import { LogoEtablissementTerritorialSanitaireSvg as LogoÉtablissementTerritorialSanitaire } from "../../établissement-territorial-sanitaire/logo-établissement-territorial-sanitaire";
import styles from "../Comparaison.module.css";
import { checkFillSvg } from "../model/data";

type listEtablissementsProps = {
  resultatRechercheList?: RechercheViewModel[];
  setIsAtBottom: Dispatch<SetStateAction<boolean>>;
};

export const ListEtablissements = ({ resultatRechercheList, setIsAtBottom }: listEtablissementsProps) => {
  //const codeColorOfDisabled = "#808080";
  const codeColorOfSelected = "#3a3a3a";

  const teeeestliisst = ["060790730", "620024331", "620029603"];
  const [newEtablissements, setNewEtablissement] = useState<string[]>([]);

  useEffect(() => {
    const scrollableDiv = document.getElementById("list-etablissements-container");

    if (scrollableDiv) {
      const handleScroll = () => {
        if (scrollableDiv.scrollHeight - scrollableDiv.scrollTop === scrollableDiv.clientHeight) {
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
    setNewEtablissement((prevSelected) => {
      if (prevSelected.includes(numFiness)) {
        return prevSelected.filter((finess) => finess !== numFiness);
      } else {
        return [...prevSelected, numFiness];
      }
    });
  };

  return (
    <div className={styles["list-etablissements-container"]} id="list-etablissements-container">
      {resultatRechercheList && (
        <ul className={styles["list-etablissements"]}>
          {resultatRechercheList.map((res) => (
            <li className={styles["etablissement-info"]} key={res.numéroFiness}>
              <div
                className={teeeestliisst.includes(res.numéroFiness) ? styles["disabled-container"] : ""}
                onClick={() => onHandleSelectEtablissement(res.numéroFiness)}
                onKeyDown={() => {}}
                role="button"
                style={{ display: "flex", marginTop: "5px", marginBottom: "5px" }}
                tabIndex={0}
              >
                <span className={styles["logo-center"]}>
                  {res.type === "Sanitaire" && <span className={styles["logo-container"]}>{LogoÉtablissementTerritorialSanitaire(codeColorOfSelected)}</span>}
                  {res.type === "Médico-social" && (
                    <span className={styles["logo-container"]}>{LogoEtablissementTerritorialMedicoSociauxSvg(codeColorOfSelected)}</span>
                  )}
                  {res.type === "Entité juridique" && <span className={styles["logo-container"]}>{LogoEntiteJuridiqueSvg(codeColorOfSelected)}</span>}
                </span>
                <span className={styles["main-span"]}>
                  {res.numéroFiness} - {res.socialReason}
                  {(newEtablissements.includes(res.numéroFiness) || teeeestliisst.includes(res.numéroFiness)) && (
                    <div className={styles["icon-check-fill"]}>{checkFillSvg}</div>
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
