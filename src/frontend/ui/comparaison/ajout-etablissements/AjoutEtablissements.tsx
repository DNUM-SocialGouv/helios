import { useContext, useEffect, useState } from "react";

import { WordingFr } from "../../../configuration/wording/WordingFr";
import { ComparaisonContext } from "../../commun/contexts/ComparaisonContext";
import { UserContext } from "../../commun/contexts/userContext";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { CategoriesFinessViewModel } from "../../recherche-avancee/model/CategoriesFinessViewModel";
import { RechercheAvanceeFormulaire } from "../../recherche-avancee/RechecheAvanceeFormulaire";
import styles from "../Comparaison.module.css";
import { ListEtablissements } from "./ListEtablissements";
import { useRechercheAvanceeComparaison } from "./useRechercheAvanceeComparaison";
import { UserListViewModel } from "../../user-list/UserListViewModel";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type AjoutEtablissementsProps = {
  setIsShowAjoutEtab: Dispatch<SetStateAction<boolean>>;
  setComparedTypes: Dispatch<SetStateAction<string[]>>;
  handleFinessChange: (numerosFiness: string[]) => void;
  setTriggerCompare: Dispatch<SetStateAction<number>>;
  categories: CategoriesFinessViewModel[];
};

export const AjoutEtablissements = ({ setIsShowAjoutEtab, setComparedTypes, handleFinessChange, setTriggerCompare, categories }: AjoutEtablissementsProps) => {
  const { lancerLaRecherche, rechercheOnChange, resultats, lastPage, nombreRésultats } = useRechercheAvanceeComparaison();
  const wording = new WordingFr();
  const [listData, setListData] = useState<RechercheViewModel[]>([]);
  const [currentPageData, setCurrentPageData] = useState<RechercheViewModel[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const comparaisonContext = useContext(ComparaisonContext);
  const userContext = useContext(UserContext);
  const [prevPage, setPrevPage] = useState<number>(1);
  const [isChangedCapacite, setIsChangedCapacite] = useState<boolean>(false);
  const [isChangedZG, setIsChangedZG] = useState<boolean>(false);
  const [isChangedActivite, setIsChangedActivite] = useState<boolean>(false);
  const [isChangedStructure, setIsChangedStructure] = useState<boolean>(false);
  const [isChangedCategories, setIsChangedCategories] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [newEtablissements, setNewEtablissements] = useState<string[]>([]);
  const [newStructures, setNewStructures] = useState<string[]>([]);

  const [sortedFavorisList, setSortedFavorisList] = useState(userContext?.favorisLists);
  const listFinessFromStorage = sessionStorage.getItem("listFinessNumbers");
  const finessNumbersListFromTable = listFinessFromStorage ? JSON.parse(listFinessFromStorage) : [];

  useEffect(() => {
    let list = userContext?.favorisLists.slice();
    if (list) {
      const favorisListIndex = list.findIndex((list) => list.isFavoris);
      const favorisList = list.splice(favorisListIndex, 1);
      list.sort((a: UserListViewModel, b: UserListViewModel) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      list = favorisList.concat(...list);
    }

    setSortedFavorisList(list);
  }, [userContext?.favorisLists])

  useEffect(() => {
    if (isAtBottom && comparaisonContext) {
      if (comparaisonContext.page < lastPage) {
        comparaisonContext.setPage(prevPage + 1);
        setPrevPage(prevPage + 1);
      }
      setIsAtBottom(false);
    }
    if (resultats) {
      setCurrentPageData(resultats);
    }
  }, [resultats, isAtBottom]);

  // update la list des resultats ( ajout des resultats de la nouvelle page à la list )
  useEffect(() => {
    if (!arraysAreEqual(currentPageData, listData.slice(-20))) {
      const collectData = comparaisonContext?.page === 1 ? currentPageData : [...listData, ...currentPageData];
      setListData(collectData);
    }
  }, [currentPageData]);

  // lancer la recherche quand la page change
  useEffect(() => {
    lancerLaRecherche();
    setReload(false);
  }, [prevPage, reload]);

  // detect filtre(s) changes to update results
  useEffect(() => {
    if (isChangedZG || isChangedCapacite || comparaisonContext?.terme || isChangedActivite || isChangedCategories || isChangedStructure) {
      comparaisonContext?.setPage(1);
      setPrevPage(1);
      if (isChangedZG || isChangedCapacite || isChangedActivite || isChangedCategories || isChangedStructure) {
        setIsChangedCapacite(false);
        setIsChangedZG(false);
        setIsChangedActivite(false);
        setIsChangedCategories(false);
        setIsChangedStructure(false);
        setReload(true);
      }
    }
  }, [isChangedZG, isChangedCapacite, isChangedCategories, isChangedStructure, isChangedActivite, comparaisonContext?.terme]);

  // check if lits are equals or not
  const arraysAreEqual = (arr1: any[], arr2: any[]): boolean => {
    const str1 = JSON.stringify(arr1);
    const str2 = JSON.stringify(arr2);
    if (str1 !== str2) {
      return false;
    }
    return true;
  };

  // fonction de la fermeture du composent
  const onClickFermer = () => {
    comparaisonContext?.setCapaciteAgees([]);
    comparaisonContext?.setCapaciteHandicap([]);
    comparaisonContext?.setCapaciteMedicoSociaux([]);
    comparaisonContext?.setActiviteMco([]);
    comparaisonContext?.setActivitePsy([]);
    comparaisonContext?.setActiviteSsr([]);
    comparaisonContext?.setActiviteUsld([]);
    comparaisonContext?.setZoneGeo("");
    comparaisonContext?.setZoneGeoD("");
    comparaisonContext?.setZoneGeoLabel("");
    comparaisonContext?.setZoneGeoType("");
    comparaisonContext?.setTerme("");
    comparaisonContext?.setCategories([]);
    comparaisonContext?.setCategoriesDomaines([]);
    comparaisonContext?.setCategoriesLibellesCourt([]);
    comparaisonContext?.setTypeStructure([]);
    comparaisonContext?.setStatutJuridiqueStructure([]);
    setPrevPage(1);
    setIsShowAjoutEtab(false);
  };

  const onClickAjouter = () => {
    const stringListOfTable = sessionStorage.getItem("listFinessNumbers");
    const comparedTypes = sessionStorage.getItem("comparaisonType");
    const arrayListOfTable = stringListOfTable ? JSON.parse(stringListOfTable) : [];
    const arrayComparedTypes = comparedTypes ? JSON.parse(comparedTypes) : [];
    const listToCompare = [...arrayListOfTable, ...newEtablissements];
    sessionStorage.setItem("listFinessNumbers", JSON.stringify(listToCompare));
    handleFinessChange(listToCompare);
    const missingInOld = newStructures.filter(item => !arrayComparedTypes.includes(item));
    // relancer la comparaison soit par le changement de structure, soit par l'ajout d'un Et
    // bug lié au lancement au double appel de la comparaison à l'ajout d'un et
    if (missingInOld.length > 0) {
      const newComparedTypes = [...new Set([...arrayComparedTypes, ...newStructures])];
      sessionStorage.setItem("comparaisonType", JSON.stringify(newComparedTypes));
      setComparedTypes(newComparedTypes);
    } else {
      setTriggerCompare(Date.now());
    }
    onClickFermer();
  };

  const addButtonLabel = (): string => {
    let label = "Ajouter";
    const etabCount = newEtablissements.length;
    if (etabCount === 1) {
      label += " " + etabCount + " établissement";
    } else if (etabCount > 1) {
      label += " " + etabCount + " établissements";
    }
    return label;
  }

  const toggleFinessInSelection = (
    currentSelection: string[],
    finess: string
  ): string[] => {
    return currentSelection.includes(finess)
      ? currentSelection.filter((item) => item !== finess)
      : [...currentSelection, finess];
  };

  const handleOnChangeListe = (event: ChangeEvent<HTMLSelectElement>) => {
    setNewEtablissements([]);
    const listeFinessNumbers = event.target.value.split(',');

    listeFinessNumbers.forEach((numFiness: string) => {
      const isAlreadyInTable = finessNumbersListFromTable.includes(numFiness);
      if (!isAlreadyInTable) {
        setNewEtablissements((prevSelected) =>
          toggleFinessInSelection(prevSelected, numFiness)
        );
      }
    });
  };

  return (
    <div className="fr-col-12 fr-col-md-12 fr-col-lg-12" style={{ marginBottom: 20 }}>
      <div className={styles["ajout-etab-body"]} id="recherche-avancee-comparaison-modal-body">
        <div className="fr-modal__header">
          <h1 className="fr-modal__title" id="titre-info-bulle-etablissement" style={{ marginTop: "20px" }}>
            {wording.TITRE_AJOUTER_DES_ETABLISSEMENTS}
          </h1>
          <button className="fr-btn--close fr-btn" onClick={onClickFermer} title="Fermer la fenêtre modale" type="button">
            {wording.FERMER}
          </button>
        </div>
        <div className="fr-modal__content">
          <div className={`${styles["titreComposentSpan"]}`} id="modal-body-composents-title">
            <span>{wording.LIBELLE_AJOUTER_DES_ETABLISSEMENTS}</span>
          </div>
          <div id="modal-body-composents" style={{ marginTop: "10px", marginBottom: "20px" }}>
            <RechercheAvanceeFormulaire
              categoriesViewModel={categories}
              isComparaison={true}
              lancerLaRecherche={lancerLaRecherche}
              rechercheOnChange={rechercheOnChange}
              setIsChangedActivite={setIsChangedActivite}
              setIsChangedCapacite={setIsChangedCapacite}
              setIsChangedCategories={setIsChangedCategories}
              setIsChangedStructure={setIsChangedStructure}
              setIsChangedZG={setIsChangedZG}
              setSelectedRows={() => { }}
            />
            {listData && listData?.length > 0 && (
              <ListEtablissements
                newEtablissements={newEtablissements}
                newStructures={newStructures}
                resultatRechercheList={listData}
                setIsAtBottom={setIsAtBottom}
                setNewEtablissement={setNewEtablissements}
                setNewStructures={setNewStructures}
              ></ListEtablissements>
            )}
          </div>
          <div className={`${styles["titreComposentSpan"]}`} id="list-selector-composents-title" >
            <span>{wording.LIBELLE_AJOUTER_DES_ETABLISSEMENTS_LISTE}</span>
            <div className="fr-select-group">
              <select
                className={"fr-select fr-icon-arrow-down-s-fill " + styles["ListeSelecteur"]}
                onChange={handleOnChangeListe}>
                <option selected value=""> Mes listes</option>
                {sortedFavorisList?.map((liste: UserListViewModel) => (
                  <option
                    key={liste.id}
                    value={liste.userListEtablissements.map(user => user.finessNumber)}
                  >
                    {liste.nom} ({liste.userListEtablissements.length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="fr-modal__footer" style={{ display: "flex", alignItems: "center" }}>
          <button
            aria-controls="fr-modal-Capacite-Filtre"
            className="fr-btn fr-btn--primary"
            disabled={newEtablissements.length < 1}
            id="ajouter-etablissement-botton"
            onClick={onClickAjouter}
          >
            {addButtonLabel()}
          </button>
          {nombreRésultats > 0 && <span style={{ marginLeft: "auto", fontSize: "small", opacity: 0.5 }}>{nombreRésultats} Établissement(s)</span>}
        </div>
      </div>
    </div>
  );
};
