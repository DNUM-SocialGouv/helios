import { Column, Entity, PrimaryColumn } from 'typeorm'

enum SourceDeDonnées {
  FINESS = 'FINESS'
}

@Entity({ name: 'datemiseÀjoursource' })
export class DateMiseÀJourSourceEntity {
  @Column({ name: 'dernièremiseÀjour', type: 'date' })
  public dernièreMiseÀJour!: Date

  @PrimaryColumn({
    enum: SourceDeDonnées,
    enumName: 'sourcededonnées',
    type: 'enum',
  })
  public source!: SourceDeDonnées
}
