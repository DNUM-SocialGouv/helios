import { Column, Entity, PrimaryColumn } from 'typeorm'

export enum FichierSource {
  FINESS_CS1400101 = 'finess_cs1400101',
  FINESS_CS1400102 = 'finess_cs1400102',
  DIAMANT_ANN_ERRD_EJ_ET = 'ann_errd_ej_et',
  DIAMANT_ANN_MS_TDP_ET = 'ann_ms_tdp_et',
  DIAMANT_MEN_PMSI_ANNUEL = 'men_pmsi_annuel',
  DIAMANT_ANN_RPU = 'ann_rpu',
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
