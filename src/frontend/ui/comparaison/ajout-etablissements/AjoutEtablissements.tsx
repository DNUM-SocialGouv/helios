import { useContext, useEffect, useState } from "react";

import { WordingFr } from "../../../configuration/wording/WordingFr";
import { ComparaisonContext } from "../../commun/contexts/ComparaisonContext";
import { RechercheViewModel } from "../../home/RechercheViewModel";
import { RechercheAvanceeFormulaire } from "../../recherche-avancee/RechecheAvanceeFormulaire";
import styles from "../Comparaison.module.css";
import { ListEtablissements } from "./ListEtablissements";
import { useRechercheAvanceeComparaison } from "./useRechercheAvanceeComparaison";
import type { Dispatch, MouseEvent, SetStateAction } from "react";

type AjoutEtablissementsProps = {
  setIsShowAjoutEtab: Dispatch<SetStateAction<boolean>>;
};

export const AjoutEtablissements = ({ setIsShowAjoutEtab }: AjoutEtablissementsProps) => {
  const { lancerLaRecherche, rechercheOnChange, resultats } = useRechercheAvanceeComparaison();
  const wording = new WordingFr();
  const [listData, setListData] = useState<RechercheViewModel[] | undefined>(undefined);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const comparaisonContext = useContext(ComparaisonContext);

  useEffect(() => {
    if (isAtBottom) {
      comparaisonContext?.setPage(comparaisonContext.page + 1);
      const button = document.createElement("button");
      button.style.display = "none";
      document.body.appendChild(button);

      // Simulate the click event on the fake button
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });

      button.addEventListener("click", (event) => {
        lancerLaRecherche(event as unknown as MouseEvent<HTMLButtonElement>);
      });

      button.dispatchEvent(clickEvent);
      document.body.removeChild(button);
    }
    if (resultats) {
      setListData(resultats);
    }
  }, [resultats, isAtBottom]);

  return (
    <div className="fr-col-12 fr-col-md-8 fr-col-lg-12" style={{ marginBottom: 20 }}>
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
