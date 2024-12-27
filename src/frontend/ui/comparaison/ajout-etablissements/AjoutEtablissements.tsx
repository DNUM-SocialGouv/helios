import { useContext, useEffect, useState } from "react";

import { WordingFr } from "../../../configuration/wording/WordingFr";
import { ComparaisonContext } from "../../commun/contexts/ComparaisonContext";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { RechercheAvanceeFormulaire } from "../../recherche-avancee/RechecheAvanceeFormulaire";
import styles from "../Comparaison.module.css";
import { ListEtablissements } from "./ListEtablissements";
import { useRechercheAvanceeComparaison } from "./useRechercheAvanceeComparaison";
import type { Dispatch, SetStateAction } from "react";

type AjoutEtablissementsProps = {
  setIsShowAjoutEtab: Dispatch<SetStateAction<boolean>>;
};

export const AjoutEtablissements = ({ setIsShowAjoutEtab }: AjoutEtablissementsProps) => {
  const { lancerLaRecherche, rechercheOnChange, resultats, lastPage } = useRechercheAvanceeComparaison();
  const wording = new WordingFr();
  const [listData, setListData] = useState<RechercheViewModel[]>([]);
  const [currentPageData, setCurrentPageData] = useState<RechercheViewModel[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const comparaisonContext = useContext(ComparaisonContext);
  const [prevPage, setPrevPage] = useState<number>(1);
  const [isChangedCapacite, setIsChangedCapacite] = useState<boolean>(false);
  const [isChangedZG, setIsChangedZG] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

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
    if (!arraysAreEqual(currentPageData, listData)) {
      const collectData = comparaisonContext?.page === 1 ? currentPageData : [...listData, ...currentPageData];
      setListData(collectData);
    }
  }, [currentPageData]);

  // lancer la recherche quand la page change
  useEffect(() => {
    if (
      comparaisonContext &&
      (comparaisonContext?.terme ||
        comparaisonContext?.capaciteAgees.length > 0 ||
        comparaisonContext?.capaciteHandicap.length > 0 ||
        comparaisonContext?.capaciteMedicoSociaux.length > 0 ||
        comparaisonContext?.zoneGeo ||
        comparaisonContext?.zoneGeoD)
    ) {
      lancerLaRecherche();
      setReload(false);
    }
  }, [prevPage, reload]);

  useEffect(() => {
    if (isChangedZG || isChangedCapacite || comparaisonContext?.terme) {
      comparaisonContext?.setPage(1);
      //lancerLaRecherche();
      if (isChangedZG || isChangedCapacite) {
        setIsChangedCapacite(false);
        setIsChangedZG(false);
        setReload(true);
      }
    }
  }, [isChangedZG, isChangedCapacite, comparaisonContext?.terme]);

  // check if lits are equals or not
  const arraysAreEqual = (arr1: any[], arr2: any[]): boolean => {
    const str1 = JSON.stringify(arr1);
    const str2 = JSON.stringify(arr2);
    if (str1 !== str2) {
      return false;
    }
    return true;
  };

  return (
    <div className="fr-col-12 fr-col-md-12 fr-col-lg-12" style={{ marginBottom: 20 }}>
      <div className={styles["ajout-etab-body"]} id="recherche-avancee-comparaison-modal-body">
        <div className="fr-modal__header">
          <h1 className="fr-modal__title" id="titre-info-bulle-etablissement" style={{ marginTop: "20px" }}>
            {wording.TITRE_AJOUTER_DES_ETABLISSEMENTS}
          </h1>
          <button className="fr-btn--close fr-btn" onClick={() => setIsShowAjoutEtab(false)} title="Fermer la fenêtre modale" type="button">
            {wording.FERMER}
          </button>
        </div>
        <div className="fr-modal__content">
          <div className={`${styles["titreComposentSpan"]}`} id="modal-body-composents-title">
            <span>{wording.LIBELLE_AJOUTER_DES_ETABLISSEMENTS}</span>
          </div>
          <div id="modal-body-composents" style={{ marginTop: "10px" }}>
            <RechercheAvanceeFormulaire
              isComparaison={true}
              lancerLaRecherche={lancerLaRecherche}
              rechercheOnChange={rechercheOnChange}
              setIsChangedCapacite={setIsChangedCapacite}
              setIsChangedZG={setIsChangedZG}
            ></RechercheAvanceeFormulaire>
            {listData && listData?.length > 0 && <ListEtablissements resultatRechercheList={listData} setIsAtBottom={setIsAtBottom}></ListEtablissements>}
          </div>
        </div>
        <div className="fr-modal__footer">
          <button
            aria-controls="fr-modal-Capacite-Filtre"
            className="fr-btn fr-btn--primary"
            disabled={true}
            id="ajouter-etablissement-botton"
            onClick={() => {}}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};
