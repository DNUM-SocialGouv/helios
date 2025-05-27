import { Dispatch, SetStateAction } from "react";

import { checkFillSvg } from "./checkFillSvg";
import styles from "../../comparaison/Comparaison.module.css";
import { CategoriesFinessViewModel } from "../../recherche-avancee/model/CategoriesFinessViewModel";

type listeRicheProps = {
    listSuggestions?: CategoriesFinessViewModel[];
    selectedElements: string[];
    setSelectedElements: Dispatch<SetStateAction<string[]>>;
    noDataMessage: boolean;
};

export const ListeRiche = ({ listSuggestions, selectedElements, setSelectedElements, noDataMessage }: listeRicheProps) => {
    const codeColorOfDisabled = "#808080";
    const codeColorOfSelected = "#000091";

    const onSelectElement = (code: string) => {
        setSelectedElements((prevSelected) => {
            if (prevSelected.includes(code)) {
                return prevSelected.filter((categorieCode) => categorieCode !== code);
            } else {
                return [...prevSelected, code];
            }
        });
    };

    const computeListRowClassName = (code: string): string => {
        let className = "";
        if (selectedElements.includes(code)) {
            className = styles["selected-container"];
        }
        return className;
    }

    return (
        <div className={styles["list-etablissements-container"]} id="list-etablissements-container">
            {listSuggestions && (
                <ul className={styles["list-etablissements"]}>
                    {listSuggestions.map((suggestion) => (
                        <li className={styles["etablissement-info"]} key={suggestion.categorieCode}>
                            <div
                                className={computeListRowClassName(suggestion.categorieCode)}
                                onClick={() => onSelectElement(suggestion.categorieCode)}
                                onKeyDown={() => { }}
                                role="button"
                                style={{ display: "flex", marginTop: "5px", marginBottom: "5px" }}
                                tabIndex={0}
                            >
                                <span className={styles["main-span"]}>
                                    {suggestion.categorieCode} - {suggestion.categorieLibelleCourt} - {suggestion.categorieLibelle}
                                    {selectedElements.includes(suggestion.categorieCode) && (
                                        <div className={styles["icon-check-fill"]}>
                                            {checkFillSvg(selectedElements.includes(suggestion.categorieCode) ? codeColorOfSelected : codeColorOfDisabled)}
                                        </div>
                                    )}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {noDataMessage && <span>Aucun résultat trouvé.</span>}
        </div>
    );
};
