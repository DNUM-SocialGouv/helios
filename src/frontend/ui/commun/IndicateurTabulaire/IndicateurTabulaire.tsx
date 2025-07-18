import styles from "./IndicateurTabulaire.module.css";
import { useDependencies } from "../contexts/useDependencies";
import { MiseEnExergue } from "../MiseEnExergue/MiseEnExergue";

export type IndicateurTabulaireProps = Readonly<{
  annéesManquantes: number[];
  valeursParAnnée: { année: number; miseEnForme?: string; valeur: string }[];
}>;

export const IndicateurTabulaire = ({ annéesManquantes, valeursParAnnée }: IndicateurTabulaireProps) => {
  const { wording } = useDependencies();

  return (
    <>
      {valeursParAnnée.length > 0 && (
        <div className="fr-table">
          <table className={`${styles["table"]}`}>
            <thead>
              <tr>
                <th>{wording.ANNÉE}</th>
                <th>{wording.MONTANT}</th>
              </tr>
            </thead>
            <tbody>
              {valeursParAnnée.map((valeurParAnnée) => (
                <tr key={valeurParAnnée.année}>
                  <td>{valeurParAnnée.année}</td>
                  <td className={valeurParAnnée.miseEnForme}>{valeurParAnnée.valeur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {annéesManquantes.length > 0 && <MiseEnExergue>{`${wording.AUCUNE_DONNÉE_RENSEIGNÉE} ${annéesManquantes.join(", ")}`}</MiseEnExergue>}
    </>
  );
};
