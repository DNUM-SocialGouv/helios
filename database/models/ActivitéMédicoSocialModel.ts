import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activitéMédicoSocial' })
export class ActivitéMédicoSocialModel {
  @Column({ name: 'année', type: 'int' })
  public année!: number

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numérofinessÉtablissementterritorial', referencedColumnName: 'numérofinessÉtablissementterritorial' })
  @Column({ length: 9, name: 'numérofinessÉtablissementterritorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'tauxDOccupationDesLitsAutorisésEnAccueilDeJour', nullable: true, type: 'float' })
  public tauxDOccupationDesLitsAutorisésEnAccueil!: number

  @Column({ name: 'tauxDOccupationDesLitsAutorisésEnHébergementTemporaire', nullable: true, type: 'float' })
  public tauxDOccupationDesLitsAutorisésEnHébergementTemporaire!: number
  @Column({ name: 'tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent', nullable: true, type: 'float' })
  public tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent!: number
}
