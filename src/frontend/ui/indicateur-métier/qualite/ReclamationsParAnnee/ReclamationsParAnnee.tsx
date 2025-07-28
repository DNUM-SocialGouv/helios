import { memo } from "react";

import { HistogrammeHorizontalRow } from "./HistogrammeHorizontalRow/HistogrammeHorizontalRow";
import { NombreTotaleReclamation } from "./NombreTotaleReclamation/NombreTotaleReclamation";
import styles from "./ReclamationParAnnee.module.css";
import { useDependencies } from "../../../commun/contexts/useDependencies";

interface rowReclamation {
  motif: string;
  clot: number;
  encours: number;
}

type GraphiqueReclamationsProps = Readonly<{
  total_clotures: number;
  total_encours: number;
  details: rowReclamation[];
}>;

const ReclamationsParAnnee = ({ total_clotures, total_encours, details }: GraphiqueReclamationsProps) => {
  function trimString(string: string, length: number): string {
    return string.length > length ? string.substring(0, length) + "..." : string;
  }

  const getMotifWording = (motif: string) => {
    let motifWording = '';
    switch (motif) {
      case "MOTIF_10": motifWording = wording.MOTIF_10; break;
      case "MOTIF_11": motifWording = wording.MOTIF_11; break;
      case "MOTIF_12": motifWording = wording.MOTIF_12; break;
      case "MOTIF_13": motifWording = wording.MOTIF_13; break;
      case "MOTIF_14": motifWording = wording.MOTIF_14; break;
      case "MOTIF_15": motifWording = wording.MOTIF_15; break;
      case "MOTIF_16": motifWording = wording.MOTIF_16; break;
      case "MOTIF_17": motifWording = wording.MOTIF_17; break;
      case "MOTIF_18": motifWording = wording.MOTIF_18; break;
      case "MOTIF_19": motifWording = wording.MOTIF_19; break;
      case "MOTIF_155": motifWording = wording.MOTIF_155; break;
      case "MOTIF_156": motifWording = wording.MOTIF_156; break;
      default: motifWording = ""
    }
    return motifWording;
  }
  const { wording } = useDependencies();

  return (
    <div className={styles["reclamations_par_annee_container"]}>
      <div className={styles["nombre_totale_reclamation_container"]}>
        <NombreTotaleReclamation label="Nombre total de réclamation" number={total_clotures + total_encours} size="big" />
        <NombreTotaleReclamation label="Cloturés" number={total_clotures} size="small" />
        <NombreTotaleReclamation label="En cours" number={total_encours} size="small" />
      </div>

      <div className={styles["table_reclamations_Container"]}>
        <table>
          <thead>
            <tr>
              <th className={styles["motif_width"]} scope="col">
                {wording.MOTIF_DES_RECLAMATIONS}
              </th>
              <th className={styles["histogramme_width"]} scope="col">
                {wording.NOMBRE_TOTAL_RECLAMATIONS}
              </th>
              <th className={styles["histogramme_width"]} scope="col">
                {wording.NOMBRE_RECLAMATIONS_EN_ENCOURS}
              </th>
              <th className={styles["histogramme_width"]} scope="col">
                {wording.NOMBRE_RECLAMATIONS_CLOTUREES}
              </th>
            </tr>
          </thead>
          <tbody>
            {details &&
              details.map((item, i) => {
                return (
                  <tr key={i}>
                    <td title={getMotifWording(item.motif)}>{trimString(getMotifWording(item.motif), 45)}</td>

                    <td>
                      <HistogrammeHorizontalRow color="darkBlue" number={item.clot + item.encours} total={total_clotures + total_encours} />
                    </td>
                    <td>
                      <HistogrammeHorizontalRow color="lightBlue" number={item.encours} total={total_clotures + total_encours} />
                    </td>
                    <td>
                      <HistogrammeHorizontalRow color="lightBlue" number={item.clot} total={total_clotures + total_encours} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ReclamationsParAnnee);
