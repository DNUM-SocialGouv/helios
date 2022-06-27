import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activitéMédicoSocial' })
export class ActivitéMédicoSocialModel {
  @PrimaryColumn({ name: 'année', type: 'int' })
  public année!: number

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numérofinessÉtablissementterritorial', referencedColumnName: 'numérofinessÉtablissementterritorial' })
  @PrimaryColumn({ length: 9, name: 'numérofinessÉtablissementterritorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'tauxDOccupationEnAccueilDeJour', nullable: true, type: 'float' })
  public tauxDOccupationDesLitsAutorisésEnAccueil!: number

  @Column({ name: 'tauxDOccupationEnHébergementTemporaire', nullable: true, type: 'float' })
  public tauxDOccupationDesLitsAutorisésEnHébergementTemporaire!: number

  @Column({ name: 'tauxDOccupationEnHébergementPermanent', nullable: true, type: 'float' })
  public tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent!: number
}
