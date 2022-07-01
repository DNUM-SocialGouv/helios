import { Column, Entity, PrimaryColumn } from 'typeorm'

export enum SourceDeDonnées {
  FINESS = 'FINESS'
}

@Entity({ name: 'date_mise_a_jour_source' })
export class DateMiseÀJourSourceModel {
  @Column({ name: 'derniere_mise_a_jour', type: 'date' })
  public dernièreMiseÀJour!: string

  @PrimaryColumn({
    enum: SourceDeDonnées,
    enumName: 'source_de_donnees',
    type: 'enum',
  })
  public source!: SourceDeDonnées
}
