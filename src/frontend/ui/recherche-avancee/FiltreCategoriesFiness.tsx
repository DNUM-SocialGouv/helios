import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useState } from "react";

import { CategoriesFinessViewModel } from "./model/CategoriesFinessViewModel";
import styles from "./RechercheAvanceeFormulaire.module.css";
import { ComparaisonContext } from "../commun/contexts/ComparaisonContext";
import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";
import { ListeRiche } from "../commun/ListeRiche/ListeRiche";

type FiltresForComparaisonProps = Readonly<{
    isComparaison: boolean;
    setIsChanged: Dispatch<SetStateAction<boolean>> | undefined;
    categoriesViewModel: CategoriesFinessViewModel[]
}>;

export const FiltreCategoriesFiness = ({ isComparaison, setIsChanged, categoriesViewModel }: FiltresForComparaisonProps) => {
    const { wording } = useDependencies();

    const rechercheAvanceeContext = useContext(isComparaison ? ComparaisonContext : RechercheAvanceeContext);
    const [categoriesSelected, setCategoriesSelected] = useState<string[]>(rechercheAvanceeContext?.categories || []);
    const [filtredCategories, setFiltredCategories] = useState<CategoriesFinessViewModel[]>([]);
    const [terme, setTerme] = useState<string>("");

    useEffect(() => {
        filtrerLesCategories();
    }, [terme])

    const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTerme(event.target.value);
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("categories-appliquer-botton")?.click();
        }
    }

    const filtrerLesCategories = () => {
        if (terme !== "") {
            const termeRecheche = terme.replaceAll('.', '').toLowerCase();
            setFiltredCategories(categoriesViewModel.filter((option) => option.categorieCode.includes(terme) ||
                option.categorieLibelleRecherche.includes(termeRecheche) ||
                option.categorieLibelleCourtRecherche.includes(termeRecheche)))
        }
    }

    const mettreAJourCriteresDeRecherche = () => {
        if (rechercheAvanceeContext) {
            rechercheAvanceeContext?.setCategories(categoriesSelected);
            if (setIsChanged) setIsChanged(true);
        }
    }

    const effacerLaSelection = () => {
        rechercheAvanceeContext?.setCategories([]);
        setCategoriesSelected([]);
        setFiltredCategories([]);
        setTerme("");
        if (setIsChanged) setIsChanged(true);
    }

    return (
        <dialog aria-labelledby="fr-modal-Categories-Filtre-title" className="fr-modal" id="fr-modal-Categories-Filtre">
            <div className="fr-container fr-container--fluid fr-container-md">
                <div className="fr-grid-row fr-grid-row--center">
                    <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                        <div className="fr-modal__body">
                            <div className="fr-modal__content fr-pt-5w">
                                <div id="type">
                                    <label className="fr-label" htmlFor="type">
                                        {wording.CATEGORIES_FINESS}
                                    </label>
                                </div>
                                <form className="fr-search-bar fr-mb-1w" role="search">
                                    <input
                                        className="fr-input"
                                        id="search-input"
                                        name="terme"
                                        onChange={rechercheOnChange}
                                        onKeyDown={(event) => onKeyDown(event)}
                                        placeholder="Rechercher un code ou libellé d'une catégorie"
                                        type="search"
                                        value={terme}
                                    />
                                    <button
                                        className="fr-btn"
                                        id="filtre-categories-botton"
                                        onClick={filtrerLesCategories}
                                        title="Rechercher"
                                        type="button">
                                    </button>
                                </form>
                                <ListeRiche
                                    listSuggestions={filtredCategories}
                                    noDataMessage={filtredCategories.length === 0 && terme !== ""}
                                    selectedElements={categoriesSelected}
                                    setSelectedElements={setCategoriesSelected}
                                />
                            </div>
                            <div className="fr-modal__footer">
                                <button
                                    className={"fr-btn fr-btn--secondary " + styles["eraseButton"]}
                                    disabled={categoriesSelected.length === 0}
                                    onClick={effacerLaSelection}
                                >
                                    Effacer
                                </button>
                                <button
                                    aria-controls="fr-modal-Categories-Filtre"
                                    className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                                    disabled={categoriesSelected.length === 0}
                                    id="categories-appliquer-botton"
                                    onClick={mettreAJourCriteresDeRecherche}
                                >
                                    Appliquer {categoriesSelected.length === 0 ? 'X' : categoriesSelected.length} catégorie(s)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
