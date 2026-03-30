import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { MiseEnExergue } from "../../../../commun/MiseEnExergue/MiseEnExergue";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import styles from "./DepartsPrematuresCdi.module.css";
import { annéesManquantesVigieRh } from "../../../../../utils/dateUtils";
import StringFormater from "../../../../commun/StringFormater";
import { Transcription } from "../../../../commun/Transcription/Transcription";

type DepartsPrematuresCdiProps = Readonly<{
  blocVigieRhViewModel: BlocVigieRHViewModel;
  etabFiness: string;
  etabTitle: string;
}>;

const DepartsPrematuresCdi = ({ blocVigieRhViewModel, etabFiness, etabTitle }: DepartsPrematuresCdiProps) => {
  const { wording } = useDependencies();
  const donnees = blocVigieRhViewModel.departsPrematuresCdi;
  const annees = donnees.map(item => item.annee);

  const libellesValeursManquantes = annéesManquantesVigieRh(annees, 3);
  const anneeCourante = new Date().getFullYear();
  const anneeMax = donnees.reduce<number | null>((accum, { annee }) => {
    if (accum === null) {
      return annee;
    }
    return Math.max(accum, annee);
  }, null);
  const formatValeur = (valeur: number | null): string => {
    if (typeof valeur !== "number" || Number.isNaN(valeur)) {
      return wording.NON_RENSEIGNÉ;
    }
    return StringFormater.formatInFrench(valeur);
  };

  return (
    <div>
      <table className={`fr-table fr-table--no-scroll ${styles["table"]}`}>
        <thead>
          <tr>
            <th scope="col">{wording.ANNÉE}</th>
            <th scope="col">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {donnees.map(({ annee, valeur }, _index) => (
            <tr className={anneeCourante === annee ? styles["highlightRow"] : styles["row"]} key={annee}>
              <td>{annee}{anneeCourante === annee ? "*" : ""}</td>
              <td>{formatValeur(valeur)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {anneeMax !== null && anneeMax === anneeCourante && (
        <p className={`fr-text--sm ${styles["partial-data-note"]}`}>
          {wording.DEPARTS_PREMATURES_CDI_DONNEES_PARTIELLES(
            anneeMax,
            blocVigieRhViewModel.echelleTemporelle.get("vr-departs-prematures-cdi")?.valeurTranscription,
          )}
        </p>
      )}
      {libellesValeursManquantes.length > 0 && (
        <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${libellesValeursManquantes.join(", ")}`}</MiseEnExergue>
      )}
      <Transcription
        entêteLibellé={wording.PERIODE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={["Nombre"]}
        libellés={donnees.map(({ annee }) => annee)}
        nomGraph={wording.DEPARTS_PREMATURES_CDI}
        valeurs={[donnees.map(({ valeur }) => formatValeur(valeur))]}
      />
    </div>
  );
};

export default DepartsPrematuresCdi;
