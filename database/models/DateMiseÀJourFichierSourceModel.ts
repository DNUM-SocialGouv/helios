import { Column, Entity, PrimaryColumn } from 'typeorm'

export enum FichierSource {
  FINESS_CS1400101 = 'finess_cs1400101',
  FINESS_CS1400102 = 'finess_cs1400102',
  FINESS_CS1400103 = 'finess_cs1400103',
  FINESS_CS1400104 = 'finess_cs1400104',
  FINESS_CS1400105 = 'finess_cs1400105',
  FINESS_CS1600101 = 'finess_cs1600101',
  FINESS_CS1600102 = 'finess_cs1600102',
  DIAMANT_ANN_ERRD_EJ_ET = 'ann_errd_ej_et',
  DIAMANT_ANN_MS_TDP_ET = 'ann_ms_tdp_et',
  DIAMANT_MEN_PMSI_ANNUEL = 'men_pmsi_annuel',
  DIAMANT_ANN_RPU = 'ann_rpu',
  DIAMANT_ANN_SAE = 'ann_sae',
  DIAMANT_ANN_CA_EJ_ET = 'ann_ca_ej_et',
}

@Entity({ name: 'date_mise_a_jour_fichier_source' })
export class DateMiseÀJourFichierSourceModel {
  @Column({ name: 'derniere_mise_a_jour', type: 'date' })
  public dernièreMiseÀJour!: string

  @PrimaryColumn({
    enum: FichierSource,
    enumName: 'fichier_source',
    type: 'enum',
  })
  public fichier!: FichierSource
}
