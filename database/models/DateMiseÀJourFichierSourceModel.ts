import { Column, Entity, PrimaryColumn } from "typeorm";

export enum FichierSource {
  FINESS_CS1400101 = "finess_cs1400101",
  FINESS_CS1400102 = "finess_cs1400102",
  FINESS_CS1400103 = "finess_cs1400103",
  FINESS_CS1400104 = "finess_cs1400104",
  FINESS_CS1400105 = "finess_cs1400105",
  FINESS_CS1600101 = "finess_cs1600101",
  FINESS_CS1600102 = "finess_cs1600102",
  FINESS_AMM_ARHGOS = "amm_arhgos",
  DIAMANT_ANN_ERRD_EJ_ET = "ann_errd_ej_et",
  DIAMANT_ANN_MS_TDP_ET = "ann_ms_tdp_et",
  DIAMANT_MEN_PMSI_ANNUEL = "men_pmsi_annuel",
  DIAMANT_MEN_PMSI_MENCUMU = "men_pmsi_mencumu",
  DIAMANT_ANN_RPU = "ann_rpu",
  DIAMANT_ANN_SAE = "ann_sae",
  DIAMANT_ANN_CA_EJ_ET = "ann_ca_ej_et",
  DIAMANT_ANN_ERRD_EJ = "ann_errd_ej",
  DIAMANT_QUO_SAN_FINANCE = "quo_san_finance",
  DIAMANT_MEN_HAPI = "men_hapi",
  SIREC = "sirec",
  SIVSS = "sivss",
  SIICEA = "siicea",

  // contrat
  VIGIE_RH_CONTRAT = "vigierh_contrat",
  VIGIE_RH_REF_TYPE_CONTRAT = "vigierh_ref_nature_contrat",
  // profession_filiere
  VIGIE_RH_PROFESSION_FILIERE = "vigierh_profession1",
  VIGIE_RH_REF_PROFESSION_FILIERE = "vigierh_ref_profession1",
  // profession_groupe
  VIGIE_RH_PROFESSION_GROUPE = "vigierh_profession2",
  VIGIE_RH_REF_PROFESSION_GROUPE = "vigierh_ref_profession2",
  // tranches des ages
  VIGIE_RH_REF_TRANCHE_AGE = "vigierh_ref_tranche_age",
  VIGIE_RH_PYRAMIDE = "vigierh_pyramide"
}

@Entity({ name: "date_mise_a_jour_fichier_source" })
export class DateMiseÀJourFichierSourceModel {
  @Column({ name: "derniere_mise_a_jour", type: "date" })
  public dernièreMiseÀJour!: string;

  @PrimaryColumn({
    enum: FichierSource,
    enumName: "fichier_source",
    type: "enum",
  })
  public fichier!: FichierSource;
}
