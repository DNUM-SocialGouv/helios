import { DataSource } from "typeorm";

import { ReclamationModel } from "../../../../../database/models/ReclamationModel";
import { IReclamation, ReclamationLoader } from "../../../métier/gateways/ReclamationLoader";

export class TypeOrmReclamationLoader implements ReclamationLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async createReclamation(row: IReclamation): Promise<void> {
    try {
      if (row.id_reclamation) {
        const checkExiste = await (await this.orm).getRepository(ReclamationModel).findOne({ where: { id_reclamation: row.id_reclamation } });
        if (!checkExiste) {
          const reclamation = new ReclamationModel();

          reclamation.id_reclamation = row.id_reclamation;
          reclamation.ndeg_finess_rpps = row.ndeg_finess_rpps;
          reclamation.annee_de_reception = row.annee_de_reception;
          reclamation.encours_total = row.encours_total;
          reclamation.encours_motif_10 = row.encours_motif_10;
          reclamation.encours_motif_11 = row.encours_motif_11;
          reclamation.encours_motif_12 = row.encours_motif_12;
          reclamation.encours_motif_13 = row.encours_motif_13;
          reclamation.encours_motif_14 = row.encours_motif_14;
          reclamation.encours_motif_15 = row.encours_motif_15;
          reclamation.encours_motif_16 = row.encours_motif_16;
          reclamation.encours_motif_17 = row.encours_motif_17;
          reclamation.encours_motif_18 = row.encours_motif_18;
          reclamation.encours_motif_19 = row.encours_motif_19;
          reclamation.encours_motif_155 = row.encours_motif_155;
          reclamation.encours_motif_156 = row.encours_motif_156;
          reclamation.clot_total = row.clot_total;
          reclamation.clot_motif_10 = row.clot_motif_10;
          reclamation.clot_motif_11 = row.clot_motif_11;
          reclamation.clot_motif_12 = row.clot_motif_12;
          reclamation.clot_motif_13 = row.clot_motif_13;
          reclamation.clot_motif_14 = row.clot_motif_14;
          reclamation.clot_motif_15 = row.clot_motif_15;
          reclamation.clot_motif_16 = row.clot_motif_16;
          reclamation.clot_motif_17 = row.clot_motif_17;
          reclamation.clot_motif_18 = row.clot_motif_18;
          reclamation.clot_motif_19 = row.clot_motif_19;
          reclamation.clot_motif_155 = row.clot_motif_155;
          reclamation.clot_motif_156 = row.clot_motif_156;

          (await this.orm)
            .getRepository(ReclamationModel)
            .save(reclamation)

            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log("error", error);
            });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error);
    }
  }
}
