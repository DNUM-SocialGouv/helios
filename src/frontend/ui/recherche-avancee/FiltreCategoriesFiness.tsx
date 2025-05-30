import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useState } from "react";

import { AttribuesDefaults } from "./model/Attribues";
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

    const [categoriesSelectedList, setCategoriesSelectedList] = useState<CategoriesFinessViewModel[]>([]);

    const [filtredCategories, setFiltredCategories] = useState<CategoriesFinessViewModel[]>([]);

    const [terme, setTerme] = useState<string>("");

    useEffect(() => {
        filtrerLesCategories();
    }, [terme])

    useEffect(() => {
        if (rechercheAvanceeContext?.typeStructure.length === 1 && rechercheAvanceeContext?.typeStructure[0] === AttribuesDefaults.entiteJuridque) {
            setCategoriesSelectedList([]);
            rechercheAvanceeContext?.setCategories([]);
            rechercheAvanceeContext?.setCategoriesDomaines([]);
            rechercheAvanceeContext?.setCategoriesLibellesCourt([]);
        }
        if (rechercheAvanceeContext?.categories.length === 0) {
            setCategoriesSelectedList([]);
            setFiltredCategories([]);
            setTerme("");
        }
    }, [rechercheAvanceeContext?.typeStructure])


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
            rechercheAvanceeContext?.setCategories(categoriesSelectedList.map((categorie => { return categorie.categorieCode })));
            rechercheAvanceeContext?.setCategoriesDomaines(categoriesSelectedList.map((categorie => { return categorie.categorieDomaine })))
            rechercheAvanceeContext?.setCategoriesLibellesCourt(categoriesSelectedList.map((categorie => { return categorie.categorieLibelleCourt })));
            setTerme("");
            if (setIsChanged) setIsChanged(true);
        }
    }

    const effacerLaSelection = () => {
        rechercheAvanceeContext?.setCategories([]);
        rechercheAvanceeContext?.setCategoriesDomaines([]);
        rechercheAvanceeContext?.setCategoriesLibellesCourt([]);
        setCategoriesSelectedList([]);
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
                                <label className="fr-label fr-mb-1w">
                                    {wording.CATEGORIES_FINESS_TITLE}
                                </label>
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
                                    listSuggestions={terme !== "" ? filtredCategories : categoriesSelectedList}
                                    noDataMessage={filtredCategories.length === 0 && terme !== ""}
                                    selectedElements={categoriesSelectedList}
                                    setSelectedElements={setCategoriesSelectedList}
                                />
                            </div>
                            <div className="fr-modal__footer">
                                <button
                                    className={"fr-btn fr-btn--secondary " + styles["eraseButton"]}
                                    disabled={categoriesSelectedList.length === 0}
                                    onClick={effacerLaSelection}
                                >
                                    Effacer
                                </button>
                                <button
                                    aria-controls="fr-modal-Categories-Filtre"
                                    className={"fr-btn fr-btn--secondary " + styles["applyButton"]}
                                    disabled={categoriesSelectedList.length === 0}
                                    id="categories-appliquer-botton"
                                    onClick={mettreAJourCriteresDeRecherche}
                                >
                                    Appliquer {categoriesSelectedList.length === 0 ? 'X' : categoriesSelectedList.length} catégorie(s)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
