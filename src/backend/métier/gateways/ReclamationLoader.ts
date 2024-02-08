export interface ReclamationLoader {
  createReclamation(row: IReclamation): Promise<void>;
}

export interface IReclamation {
  id: number;
  id_reclamation: string;
  ndeg_finess_rpps: string;
  annee_de_reception: number;
  encours_total: number;
  encours_motif_10: number;
  encours_motif_11: number;
  encours_motif_12: number;
  encours_motif_13: number;
  encours_motif_14: number;
  encours_motif_15: number;
  encours_motif_16: number;
  encours_motif_17: number;
  encours_motif_18: number;
  encours_motif_19: number;
  encours_motif_155: number;
  encours_motif_156: number;
  clot_total: number;
  clot_motif_10: number;
  clot_motif_11: number;
  clot_motif_12: number;
  clot_motif_13: number;
  clot_motif_14: number;
  clot_motif_15: number;
  clot_motif_16: number;
  clot_motif_17: number;
  clot_motif_18: number;
  clot_motif_19: number;
  clot_motif_155: number;
  clot_motif_156: number;
}
