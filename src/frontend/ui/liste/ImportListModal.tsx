import { useState } from "react";

import styles from "./ListActionsButton.module.css";

type ImportListModalProps = Readonly<{

}>;

export const ImportListModal = ({ }: ImportListModalProps) => {

    const [finessAImporter, setFinessAImporter] = useState<string>("");
    const [finessEnErreur, setFinessEnErreur] = useState<string[]>([]);

    const onChangeFinessAImporter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFinessAImporter(e.target.value);
    };

    const importEts = () => {
        const finessList = finessAImporter.split(/\r?\n/).filter(ligne => ligne.trim() !== "");

        fetch("/api/favoris/check-finess-list", {
            body: JSON.stringify({ finessNumbers: finessList }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        }).then((response) => response.json())
            .then((data) => {
                setFinessEnErreur(data);
                setFinessAImporter(data.join("\n"))
            });;
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
                                    Coller les n° FINESS à importer
                                </p>
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
                                    Vérifier
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
        </dialog>
    );
};