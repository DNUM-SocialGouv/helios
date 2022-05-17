import { Column, Entity, PrimaryColumn } from 'typeorm'

export enum SourceDeDonnées {
  FINESS = 'FINESS'
}

@Entity({ name: 'datemiseÀjoursource' })
export class DateMiseÀJourSourceModel {
  @Column({ name: 'dernièremiseÀjour', type: 'date' })
  public dernièreMiseÀJour!: Date

  @PrimaryColumn({
    enum: SourceDeDonnées,
    enumName: 'sourcededonnées',
    type: 'enum',
  })
  public source!: SourceDeDonnées
}
