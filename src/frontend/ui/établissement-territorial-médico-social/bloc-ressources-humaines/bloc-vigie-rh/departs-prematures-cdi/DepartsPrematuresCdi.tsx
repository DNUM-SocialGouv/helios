import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { MiseEnExergue } from "../../../../commun/MiseEnExergue/MiseEnExergue";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import styles from "./DepartsPrematuresCdi.module.css";
import { StringFormater } from "../../../../commun/StringFormater";

type DepartsPrematuresCdiProps = Readonly<{
  blocVigieRhViewModel: BlocVigieRHViewModel;
}>;

const DepartsPrematuresCdi = ({ blocVigieRhViewModel }: DepartsPrematuresCdiProps) => {
  const { wording } = useDependencies();
  const donnees = blocVigieRhViewModel.departsPrematuresCdi;
  const libellesValeursManquantes = donnees.filter(({ valeur }) => typeof valeur !== "number" || !Number.isFinite(valeur)).map(({ annee }) => `${annee}`);

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
          {donnees.map(({ annee, valeur }, index) => (
            <tr className={index === 0 ? styles["highlightRow"] : styles["row"]} key={annee}>
              <td>{annee}</td>
              <td>{formatValeur(valeur)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {libellesValeursManquantes.length > 0 && (
        <MiseEnExergue>{`${wording.AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE} ${libellesValeursManquantes.join(", ")}`}</MiseEnExergue>
      )}
    </div>
  );
};

export default DepartsPrematuresCdi;
