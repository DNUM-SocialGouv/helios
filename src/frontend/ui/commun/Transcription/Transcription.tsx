import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/transcription/transcription.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import { useDependencies } from "../contexts/useDependencies";
import styles from "./Transcription.module.css";

type TableIndicateurProps = Readonly<{
  disabled?: boolean;
  entêteLibellé: string;
  identifiants: string[];
  identifiantUnique?: string;
  libellés: (number | string)[];
  valeurs: (number | string | null)[][];
}>;

export const Transcription = ({ disabled = false, entêteLibellé, identifiants, identifiantUnique = "", libellés, valeurs }: TableIndicateurProps) => {
  const { wording } = useDependencies();
  const identifiant = identifiantUnique !== "" ? identifiantUnique : identifiants[0].replace(/\s/g, "");

  return (
    <div className={"fr-transcription fr-mb-5w fr-mt-3w " + styles["indicateur"]}>
      <button aria-controls={identifiant} aria-expanded="false" className="fr-transcription__btn" disabled={disabled}>
        {wording.AFFICHER_LA_TRANSCRIPTION}
      </button>
      <div className="fr-collapse" id={identifiant}>
        {/*
          Hack pour les tests : on ajoute style={{ display: "flex" }} pour que la dialog ne soit pas en display:none dans les tests.
          En dehors des tests la classe "fr-modal" ajoute le display:"flex" mais les classes ne sont pas appliquées dans les tests
        */}
        <dialog aria-labelledby={identifiant + "-modal-title"} className="fr-modal" id={identifiant + "-modal-transcription"} style={{ display: "flex" }}>
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
                    <h1 className="fr-modal__title" id={identifiant + "-modal-title"}>
                      {wording.TITRE_TRANSCRIPTION}
                    </h1>
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
                          {libellés.map((libellé, index) => (
                            <tr key={libellé}>
                              <td>{libellé}</td>
                              {valeurs.map((valeur, index2) => (
                                <td key={valeur[index] + index2.toString()}>
                                  {/* @ts-ignore */}
                                  {valeur[index] === null ? wording.NON_RENSEIGNÉ : valeur[index]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="fr-transcription__footer">
                    <div className="fr-transcription__actions-group">
                      <button aria-controls={identifiant + "-modal-transcription"} className="fr-btn fr-btn--fullscreen" data-fr-opened="false" title="">
                        Agrandir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};
