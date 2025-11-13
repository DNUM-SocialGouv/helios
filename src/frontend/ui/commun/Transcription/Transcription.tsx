"use client";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/transcription/transcription.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useExportExcelTranscription } from "./ExportExcel"
import styles from "./Transcription.module.css";
import { useDependencies } from "../contexts/useDependencies";


type TableIndicateurProps = Readonly<{
  disabled?: boolean;
  entêteLibellé: string;
  identifiants: string[];
  nomGraph: string;
  etabTitle: string;
  etabFiness: string;
  identifiantUnique?: string;
  libellés: (number | string)[];
  valeurs: (number | string | null)[][];
}>;

export const Transcription = ({ disabled = false, entêteLibellé, identifiants, nomGraph, etabTitle, etabFiness, identifiantUnique = "", libellés, valeurs }: TableIndicateurProps) => {
  const { wording } = useDependencies();
  const { exportExcelTranscription } = useExportExcelTranscription();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isInlineOpen, setIsInlineOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setContainer(document.body);
  }, []);
  if (identifiantUnique === "" && identifiants[0] === undefined) return null;

  const identifiant = identifiantUnique !== "" ? identifiantUnique : identifiants[0].replaceAll(/\s/g, "");

  const exportTab = () => {
    exportExcelTranscription(nomGraph, etabFiness, etabTitle, [entêteLibellé, ...identifiants], libellés, valeurs);
  }


  const tableContent = (
    <div className="fr-table fr-table--bordered">
      <table aria-label="tableau transcription">
        <thead>
          <tr>
            <th scope="col">{entêteLibellé}</th>
            {identifiants.map((identifiant) => (
              <th key={identifiant} scope="col">
                {identifiant}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {libellés?.map((libellé, index) => (
            <tr key={libellé}>
              <td>{libellé}</td>
              {valeurs.map((valeur, index2) => (
                <td className={styles["transcriptionData"]} key={valeur[index] + index2.toString()}>
                  {valeur[index] ?? wording.NON_RENSEIGNÉ}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /*
    Hack pour les tests : on ajoute style={{ display: "flex" }} pour que la dialog ne soit pas en display:none dans les tests.
    En dehors des tests la classe "fr-modal" ajoute le display:"flex" mais les classes ne sont pas appliquées dans les tests
  */
  const TranscriptionContent = (
    <dialog aria-labelledby={identifiant + "-modal-title"} className="fr-modal" id={identifiant + "-modal-transcription"} open={isModalOpen} style={{ display: "flex" }}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div>
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button aria-controls={identifiant + "-modal-transcription"} className="fr-btn--close fr-btn" title={wording.FERMER}>
                  {wording.FERMER}
                </button>
              </div>
              <div className="fr-modal__content">
                <div className={styles["header-container"]}>
                  <h1 className="fr-modal__title" id={identifiant + "-modal-title"}>
                    {wording.TITRE_TRANSCRIPTION}
                  </h1>
                  <button className="fr-btn fr-icon-download-line fr-btn--icon-left fr-btn--tertiary-no-outline" onClick={exportTab} title={wording.DOWNLOAD_EXCEL} type="button">
                    {wording.DOWNLOAD_EXCEL}
                  </button>
                </div>
                {tableContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )

  return (
    <div className={"fr-transcription fr-mb-5w fr-mt-3w " + styles["indicateur"]}>
      <button aria-controls={identifiant} aria-expanded="false" className="fr-transcription__btn" disabled={disabled} onClick={() => setIsInlineOpen((prev) => !prev)}>
        {wording.AFFICHER_LA_TRANSCRIPTION}
      </button>
      <div className="fr-collapse" id={identifiant}>
        {isInlineOpen && (
          <div style={{ maxHeight: "9.5rem", overflowY: "auto", padding: "1rem" }}>
            {tableContent}
          </div>
        )}
      </div>
      {isInlineOpen && (
        <div className="fr-transcription__footer">
          <div className="fr-transcription__actions-group">
            <button
              aria-controls={identifiant + "-modal-transcription"}
              className="fr-btn fr-btn--fullscreen"
              data-fr-opened="false"
              onClick={() => setIsModalOpen(true)}
              title=""
            >
              Agrandir
            </button>
          </div>
        </div>
      )}
      {container && createPortal(TranscriptionContent, container)}
    </div>
  );
};
