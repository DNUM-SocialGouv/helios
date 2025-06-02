import { Dispatch, SetStateAction } from "react";

import { checkFillSvg } from "./checkFillSvg";
import styles from "../../comparaison/Comparaison.module.css";
import { CategoriesFinessViewModel } from "../../recherche-avancee/model/CategoriesFinessViewModel";

type listeRicheProps = {
    listSuggestions?: CategoriesFinessViewModel[];
    selectedElements: CategoriesFinessViewModel[];
    setSelectedElements: Dispatch<SetStateAction<CategoriesFinessViewModel[]>>;
    noDataMessage: boolean;
};

export const ListeRiche = ({ listSuggestions, selectedElements, setSelectedElements, noDataMessage }: listeRicheProps) => {
    const codeColorOfDisabled = "#808080";
    const codeColorOfSelected = "#000091";

    const onSelectElement = (suggestion: CategoriesFinessViewModel) => {
        setSelectedElements((prevSelected) => {
            if (prevSelected.some(category => category.categorieCode === suggestion.categorieCode)) {
                return prevSelected.filter((category) => category.categorieCode !== suggestion.categorieCode);
            } else {
                return [...prevSelected, suggestion];
            }
        });
    };

    const computeListRowClassName = (code: string): string => {
        let className = "";
        if (selectedElements.some(category => category.categorieCode === code)) {
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
                                onClick={() => onSelectElement(suggestion)}
                                onKeyDown={() => { }}
                                role="button"
                                style={{ display: "flex", marginTop: "5px", marginBottom: "5px" }}
                                tabIndex={0}
                            >
                                <span className={styles["main-span"]}>
                                    {suggestion.categorieCode} - {suggestion.categorieLibelleCourt} - {suggestion.categorieLibelle}
                                    {selectedElements.some(category => category.categorieCode === suggestion.categorieCode) && (
                                        <div className={styles["icon-check-fill"]}>
                                            {checkFillSvg(selectedElements.some(category => category.categorieCode === suggestion.categorieCode) ? codeColorOfSelected : codeColorOfDisabled)}
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
