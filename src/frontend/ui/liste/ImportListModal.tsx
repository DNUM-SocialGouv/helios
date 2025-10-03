import { KeyboardEvent as KeyboardEventReact, useContext, useState } from "react";

import styles from "./ImportListModal.module.css";
import { ImportListViewModel } from "./ImportListModalViewModel";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css"
import { RechercheModel } from "../../../../database/models/RechercheModel";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { useFavoris } from "../favoris/useFavoris";

type ImportListModalProps = Readonly<{
  onSuccess: () => void;
  listId?: number;
}>;

export const ImportListModal = ({ onSuccess, listId }: ImportListModalProps) => {
  const { wording } = useDependencies();
  const userContext = useContext(UserContext);
  const { addToFavorisList, createFavorisList, getFavorisLists } = useFavoris();
  const [finessAImporter, setFinessAImporter] = useState<string>("");
  const [finessEnErreur, setFinessEnErreur] = useState<string[]>([]);
  const [findedEtablissments, setFindedEtablissments] = useState<ImportListViewModel[]>([]);
  const [selectedList, setSelectedList] = useState<number>(listId ?? -1);
  const [displayNewListInput, setDisplayNewListInput] = useState<boolean>(false);
  const [newListError, setNewListError] = useState<boolean>(false);
  const [newListErrorMessage, setNewListErrorMessage] = useState<string>("");
  const [addToListError, setAddToListError] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const [textChanged, setTextChanged] = useState<boolean>(false);

  const onChangeFinessAImporter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextChanged(true);
    setFinessAImporter(e.target.value);
  };

  const importEts = () => {
    const finessList = finessAImporter.split(/\r?\n/).filter(ligne => ligne.trim() !== "");

    if (finessList && finessList.length > 0) {
      fetch("/api/recherche-par-finess", {
        body: JSON.stringify({ finessNumber: finessList }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }).then((response) => response.json())
        .then((data: RechercheModel[]) => {
          let findedEtab = data.map((resultat: RechercheModel) => new ImportListViewModel(resultat.numeroFiness, resultat.raisonSocialeCourte));
          findedEtab = [...findedEtablissments, ...findedEtab];
          // Code pour dedupliquer les finess
          const findedFiness: string[] = [];
          findedEtab = findedEtab.filter((etab) => {
            if (findedFiness.includes(etab.finess)) {
              return false;
            } else {
              findedFiness.push(etab.finess);
              return true;
            }
          })
          setFindedEtablissments(findedEtab);

          const finessKo = finessList.filter((finess) => !findedFiness.includes(finess));
          setFinessEnErreur(finessKo);
          setFinessAImporter(finessKo.join("\n"))
        });
    } else {
      setFinessEnErreur([]);
    }
  }

  const isErrorForm = () => {
    return findedEtablissments.length > 0 && finessEnErreur.length > 0;
  }

  const isImportForm = () => {
    return findedEtablissments.length > 0 && finessEnErreur.length === 0;
  }

  const title = () => {
    let title = "Coller les n° FINESS à importer";
    if (isErrorForm() || isImportForm()) {
      title = `${findedEtablissments.length} établissements`;
    }
    return title;
  }


  const okButtonLabel = () => {
    let label = wording.IMPORT_LIST_OK_VALIDATE_LABEL;
    if (isErrorForm()) {
      label = wording.IMPORT_LIST_OK_VERIFY_LABEL;
    } else if (isImportForm()) {
      label = wording.IMPORT_LIST_OK_IMPORT_LABEL;
    }
    return label;
  }

  const handleOkButton = () => {
    setTextChanged(false);
    if (isImportForm() && displayNewListInput) {
      handleListCreation()
    } else if (isImportForm() && !displayNewListInput) {
      addToList(selectedList)
    } else {
      importEts()
    }
  }

  const isButtonEnabled = () => {
    if (isErrorForm()) {
      return textChanged;
    } else if (isImportForm()) {
      return !!listId || selectedList >= 0 || newListName.trim().length > 0
    } else {
      return finessAImporter !== ""
    }
  }

  const tableClassName = () => {
    if (isErrorForm()) {
      return styles['resultTable-error'];
    } else if (isImportForm()) {
      return styles['resultTable-import'];
    } else {
      return "";
    }
  }

  const handleKeyDown = (event: KeyboardEventReact) => {
    if (event.key === 'Enter' && displayNewListInput) {
      handleListCreation();
    }
  };

  const handleListCreation = async () => {
    setNewListError(false);
    setAddToListError(false);

    const newListTrimmedName = newListName.trim();

    if (newListTrimmedName) {
      let status = -1;
      let listId = -1;
      await createFavorisList(newListTrimmedName, false)
        .then(response => {
          status = response.status;
          if (status === 201) {
            return response.json();
          }
          return null;
        })
        .then(response => {
          if (response) {
            listId = response.id;
          }
        });

      if (status === 201) {
        addToList(listId);
      } else if (status === 403) {
        setNewListError(true);
        setNewListErrorMessage(wording.ETOILE_MAX_LISTE_ATTEINT);
        getFavorisLists();
      } else {
        setNewListError(true);
        setNewListErrorMessage(wording.SOMETHING_WENT_WRONG);
      }
    }
  }

  const onSuccessImport = () => {
    onSuccess();
    resetAndClose();
    getFavorisLists();
  }

  const resetAndClose = () => {
    reset();
    closeModal();
  }

  const reset = () => {
    setAddToListError(false);
    setDisplayNewListInput(false);
    setNewListError(false);
    setNewListName("");
    setSelectedList(listId ?? -1);
    setFindedEtablissments([]);
    setFinessAImporter("");
    setFinessEnErreur([]);
  }

  const closeModal = () => {
    const closeBtn = document.getElementById("fr-modal-import-close-btn");
    if (closeBtn) closeBtn.click();
  }

  const listSelector = () => {
    return <>
      {!displayNewListInput
        ? <div className="fr-select-group">
          <label className="fr-label" htmlFor="listSelector">{wording.IMPORT_LIST_SELECTOR}</label>
          <select className="fr-select" disabled={!!listId} id="listSelector" name="listSelector" onChange={selectList}>
            <option key="-1" selected value="-1">Sélectionner</option>
            {userContext?.favorisLists.map((list) => (
              <option key={list.id} selected={list.id === listId} value={list.id}>{list.nom}</option>
            ))}
          </select>
          <button className={"fr-btn fr-btn--sm fr-btn--secondary fr-mt-2w fr-mb-2w " + styles['full-width-button']} disabled={(userContext && userContext?.favorisLists.length >= 11) || !!listId} onClick={() => setDisplayNewListInput(true)}>{wording.IMPORT_NOUVELLE_LISTE_BOUTON}</button>
        </div>
        : <div className={"fr-input-group " + (newListError ? "fr-input-group--error " : " ") + styles['new-list-button-group']} >
          <label className="fr-label fr-text--lead fr-text--bold fr-my-1w fr-p-0" htmlFor="new-list-form">Nouvelle liste</label>
          {/* Autofocus dans un formulaire a un seul champs et dans une popup. Ne casse pas le flux de la page */}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input aria-describedby={newListError ? "new-list-error-message" : undefined} autoFocus className={"fr-input " + (newListError ? "fr-input--error" : "")} id="newListForm" name="new-list-input" onChange={(e) => setNewListName(e.target.value)} onKeyDown={handleKeyDown} type="text" value={newListName} />
          <div className="fr-messages-group">
            {newListError && <p className={"fr-message fr-message--error " + styles['error-message']} id="new-list-error-message">{newListErrorMessage}</p>}
          </div>
        </div>

      }
    </>
  }

  const selectList = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedList(Number(event.target.value));
  }

  const addToList = async (list: number) => {
    let isOnError = false;
    for (const etab of findedEtablissments) {
      await addToFavorisList(etab.finess, list)
        .then(response => {
          if (response.status !== 200) {
            isOnError = true;
          }
        });
    }
    if (isOnError) {
      setAddToListError(true);
    } else {
      onSuccessImport();
    }
  }

  return (
    <dialog aria-labelledby="fr-modal-import-list-title" aria-modal="true" className="fr-modal" id="fr-modal-import-list">
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__header">
              </div>
              <div className="fr-modal__content">
                <h1 className="fr-modal__title" id="fr-modal-import-list-title">
                  {wording.IMPORT_LIST_TITLE}
                </h1>
                <p className={styles["sous-titre"]}>
                  {title()}
                </p>
                {addToListError &&
                  <div className="fr-alert fr-alert--error fr-alert--sm">
                    <p>{wording.IMPORT_LIST_ERREUR_IMPORT}</p>
                  </div>
                }
                {findedEtablissments.length > 0 &&
                  <div className={"fr-table " + tableClassName()}>
                    <div className="fr-table__wrapper">
                      <div className="fr-table__container">
                        <div className="fr-table__content">
                          <table>
                            <thead>
                              <tr>
                                <th scope="col">{wording.IMPORT_LIST_FINESS_HEADER}</th>
                                <th scope="col">{wording.IMPORT_LIST_RS_HEADER}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {findedEtablissments.map((etab) => (
                                <tr key={etab.finess}>
                                  <td>{etab.finess}</td>
                                  <td>{etab.raisonSociale}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {finessEnErreur.length > 0 &&
                  <div className="fr-alert fr-alert--error fr-alert--sm">
                    <p>{wording.IMPORT_LIST_FINESS_ERROR_MESSAGE(finessEnErreur.length)}</p>
                  </div>
                }
                {!isImportForm()
                  ? <textarea
                    className={finessEnErreur.length > 0 ? styles["import-textarea-erreur"] : styles["import-textarea"]}
                    onChange={onChangeFinessAImporter}
                    placeholder={wording.IMPORT_LIST_TEXT_PLACEHOLDER}
                    rows={10}
                    value={finessAImporter}
                  />
                  : listSelector()
                }
              </div>
              <div className="fr-modal__footer">
                <button className="fr-btn"
                  disabled={!isButtonEnabled()}
                  onClick={handleOkButton}
                >
                  {okButtonLabel()}
                </button>
                <button
                  aria-controls="fr-modal-import-list"
                  className={"fr-btn fr-btn--secondary " + styles["button-position"]}
                  data-fr-opened="false"
                  id="fr-modal-import-close-btn"
                  onClick={reset}
                >
                  {wording.IMPORT_LIST_CANCEL_LABEL}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog >
  );
};
