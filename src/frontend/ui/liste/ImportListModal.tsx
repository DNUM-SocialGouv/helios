import { useState } from "react";

import styles from "./ImportListModal.module.css";
import { ImportListViewModel } from "./ImportListModalViewModel";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";
import { RechercheModel } from "../../../../database/models/RechercheModel";
import { useDependencies } from "../commun/contexts/useDependencies";

type ImportListModalProps = Readonly<{

}>;

export const ImportListModal = ({ }: ImportListModalProps) => {
  const { wording } = useDependencies();
  const [finessAImporter, setFinessAImporter] = useState<string>("");
  const [finessEnErreur, setFinessEnErreur] = useState<string[]>([]);
  const [findedEtablissments, setFindedEtablissments] = useState<ImportListViewModel[]>([]);

  const onChangeFinessAImporter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFinessAImporter(e.target.value);
  };

  const importEts = () => {
    const finessList = finessAImporter.split(/\r?\n/).filter(ligne => ligne.trim() !== "");

    fetch("/api/recherche-par-finess", {
      body: JSON.stringify({ finessNumber: finessList }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((response) => response.json())
      .then((data: RechercheModel[]) => {
        let findedEtab = data.map((resultat: RechercheModel) => new ImportListViewModel(resultat.numeroFiness, resultat.raisonSocialeCourte));
        findedEtab = [...findedEtablissments, ...findedEtab];
        // Code pour dedupliquer les finess
        findedEtab = [...new Set(findedEtab)];
        setFindedEtablissments(findedEtab);

        const findedFiness = findedEtab.map((model) => model.finess);
        const finessKo = finessList.filter((finess) => !findedFiness.includes(finess));
        setFinessEnErreur(finessKo);
        setFinessAImporter(finessKo.join("\n"))
      });
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
    let label = "Valider";
    if (isErrorForm()) {
      label = "Vérifier";
    } else if (isImportForm()) {
      label = "Importer"
    }
    return label;
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
                  Importer des établissements
                </h1>
                <p className={styles["sous-titre"]}>
                  {title()}
                </p>
                {findedEtablissments.length > 0 &&
                  <div className={"fr-table " + tableClassName()}>
                    <div className="fr-table__wrapper">
                      <div className="fr-table__container">
                        <div className="fr-table__content">
                          <table>
                            <caption>test</caption>
                            <thead>
                              <tr>
                                <th scope="col">N° Finess</th>
                                <th scope="col">Raison sociale</th>
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
                    <p>{wording.IMPORT_LIST_ERROR_MESSAGE(finessEnErreur.length)}</p>
                  </div>
                }
                <textarea
                  className={finessEnErreur.length > 0 ? styles["import-textarea-erreur"] : styles["import-textarea"]}
                  onChange={onChangeFinessAImporter}
                  placeholder="Le numéro FINESS est composé de 9 caractères alphanumérique. Veuillez saisir un numéro par lingne sans espace, ni ponctuation."
                  rows={10}
                  value={finessAImporter}
                />
              </div>
              <div className="fr-modal__footer">
                <button className="fr-btn"
                  disabled={finessAImporter === ""}
                  onClick={() => importEts()}
                >
                  {okButtonLabel()}
                </button>
                <button
                  aria-controls="fr-modal-import-list"
                  className={"fr-btn fr-btn--secondary " + styles["button-position"]}
                  data-fr-opened="false"
                  disabled={finessAImporter === ""}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog >
  );
};
